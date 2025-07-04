import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CreateAccountConnectionDto } from './dto/create-account-connection.dto';
import { ActivateCustomerConnectionDto } from './dto/activate-customer-connection.dto';
import { CreateQuoteStripeDto } from './dto/create-quote-stripe.dto';
import { CreateProductStripeDto } from './dto/create-product-stripe.dto';
import { EnvironmentService } from '../environment/environment.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly prismaService: PrismaService,
  ) {
    this.stripe = new Stripe(
      this.environmentService.get('STRIPE_SECRET_KEY', ''),
    );
  }

  async handleWebhook(
    body: Buffer,
    signature: string,
  ): Promise<{ received: boolean; jobPostingId?: string | null }> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.environmentService.get('STRIPE_WEBHOOK_SECRET', ''),
      );
    } catch (error: any) {
      throw new Error(
        'Webhook signature verification failed' +
          (error instanceof Error ? error.message : String(error)),
      );
    }

    const result: { received: boolean; jobPostingId?: string | null } = {
      received: true,
    };

    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSessionCompleted = event.data.object;
        const jobPostingId = await this.handlePaymentSuccess(
          checkoutSessionCompleted,
        );
        result.jobPostingId = jobPostingId;
        break;
      }
      case 'checkout.session.expired': {
        const checkoutSessionExpired = event.data.object;
        this.handlePaymentExpired(checkoutSessionExpired);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntentFailed = event.data.object;
        this.handlePaymentFailed(paymentIntentFailed);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return result;
  }

  private async handlePaymentSuccess(
    session: Stripe.Checkout.Session,
  ): Promise<string | null> {
    try {
      const { metadata } = session;

      if (metadata?.type === 'job_posting_payment' && metadata?.jobPostingId) {
        // Récupérer le job posting
        const jobPosting = await this.prismaService.jobPosting.findUnique({
          where: { id: metadata.jobPostingId },
        });

        if (!jobPosting) {
          throw new Error(`Job posting ${metadata.jobPostingId} not found`);
        }

        // Mettre à jour le statut du job posting à PUBLISHED
        await this.prismaService.jobPosting.update({
          where: { id: metadata.jobPostingId },
          data: {
            status: 'PUBLISHED',
          },
        });

        console.log(
          `Job posting ${metadata.jobPostingId} payment successful - status updated to PUBLISHED`,
        );

        // Stocker l'ID de session Stripe dans les métadonnées
        console.log(
          `Stripe session ${session.id} processed for job posting ${metadata.jobPostingId}`,
        );

        // Retourner l'ID du job posting (pas de projet créé à ce stade)
        return metadata.jobPostingId;
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
    }

    return null;
  }

  private handlePaymentExpired(session: Stripe.Checkout.Session) {
    try {
      const { metadata } = session;

      if (metadata?.type === 'job_posting_payment' && metadata?.jobPostingId) {
        console.log(`Payment expired for job posting ${metadata.jobPostingId}`);
        // Optionnel : marquer comme expiré ou envoyer une notification
      }
    } catch (error) {
      console.error('Error handling payment expiration:', error);
    }
  }

  private handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    try {
      console.log(`Payment failed for payment intent ${paymentIntent.id}`);
      // Optionnel : gérer les échecs de paiement
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }

  async createCheckoutSession(body: CreateCheckoutSessionDto) {
    // Only specify one of customer or customer_email, not both
    const customerParam: { customer?: string; customer_email?: string } = {};

    if (body.customerId && body.customerId.trim() !== '') {
      customerParam.customer = body.customerId;
    } else if (body.customerEmail) {
      customerParam.customer_email = body.customerEmail;
    }

    const checkoutSession = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: body.price * 100,
            product_data: {
              name: body.productName || "Publication d'annonce",
              description:
                body.productDescription ||
                "Publication d'une offre de mission freelance",
            },
          },
          quantity: 1,
        },
      ],
      invoice_creation: {
        enabled: true,
      },
      automatic_tax: {
        enabled: true,
      },
      mode: 'payment',
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      ...customerParam, // Spread the customer parameter (either customer or customer_email)
      metadata: {
        companyId: body.companyId,
        jobPostingId: body.jobPostingId || '',
        type: 'job_posting_payment',
      },
    });
    return checkoutSession;
  }
  async createAccountConnection(body: CreateAccountConnectionDto) {
    console.log('Creating account connection for:', body);

    // Vérifier si un compte existe déjà pour ce freelance
    const existingAccount = await this.getAccountConnection(body.freelanceId);
    if (existingAccount) {
      console.log('Existing account found:', {
        accountId: existingAccount.id,
        freelanceId: body.freelanceId,
      });

      // Si le compte existe, créer directement le lien d'activation
      const accountLink = await this.stripe.accountLinks.create({
        account: existingAccount.id,
        refresh_url: `${process.env.FRONTEND_URL}/profile/freelance?stripe_error=refresh`,
        return_url: `${process.env.FRONTEND_URL}/profile/freelance?stripe_return=success&account_id=${existingAccount.id}`,
        type: 'account_onboarding',
      });

      console.log(
        'Account link created for existing account:',
        accountLink.url,
      );

      return {
        account: existingAccount,
        accountLink: accountLink.url,
        stripeAccountId: existingAccount.id,
      };
    }

    console.log('Creating new Stripe account...');

    // Créer un nouveau compte Stripe
    const accountConnection = await this.stripe.accounts.create({
      type: 'express',
      country: 'FR',
      email: body.email,
      metadata: {
        freelanceId: body.freelanceId,
      },
    });

    console.log('New Stripe account created:', {
      accountId: accountConnection.id,
      freelanceId: body.freelanceId,
    });

    // Mettre à jour le freelance avec le stripeAccountId
    const updatedFreelance = await this.prismaService.freelance.update({
      where: { id: body.freelanceId },
      data: { stripeAccountId: accountConnection.id },
    });

    console.log('Freelance updated with stripeAccountId:', {
      freelanceId: updatedFreelance.id,
      stripeAccountId: updatedFreelance.stripeAccountId,
    });

    // Créer le lien d'activation
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const returnUrl = `${frontendUrl}/profile/freelance?stripe_return=success&account_id=${accountConnection.id}`;

    console.log('Creating account link with return URL:', returnUrl);

    const accountLink = await this.stripe.accountLinks.create({
      account: accountConnection.id,
      refresh_url: `${process.env.FRONTEND_URL}/profile/freelance?stripe_error=refresh`,
      return_url: `${process.env.FRONTEND_URL}/profile/freelance?stripe_return=success&account_id=${accountConnection.id}`,
      type: 'account_onboarding',
    });

    return {
      account: accountConnection,
      accountLink: accountLink.url,
      stripeAccountId: accountConnection.id,
    };
  }

  async activateAccountConnection(body: ActivateCustomerConnectionDto) {
    const accountConnection = await this.stripe.accountLinks.create({
      account: body.accountId,
      refresh_url: body.refreshUrl,
      return_url: body.returnUrl,
      type: 'account_onboarding',
    });
    return accountConnection;
  }

  async getAccountConnection(freelanceId: string) {
    const accounts = await this.stripe.accounts.list();
    const accountConnection = accounts.data.find((account) => {
      return account.metadata?.freelanceId === freelanceId;
    });
    return accountConnection || null;
  }

  // faire un transfer de l'argent vers le compte stripe du freelance
  async transferFundsToAccountStripe(accountId: string, amount: number) {
    const transfer = await this.stripe.transfers.create({
      amount: amount,
      currency: 'eur',
      destination: accountId,
    });
    return transfer;
  }

  async createQuote(body: CreateQuoteStripeDto) {
    const quote = await this.stripe.quotes.create({
      customer: body.customerId,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: body.amount * 100,
            product: body.productId,
          },
        },
      ],
      metadata: {
        projectId: body.projectId,
      },
    });
    const finalizedQuote = await this.stripe.quotes.finalizeQuote(quote.id);
    return finalizedQuote;
  }

  async getQuotesByProjectIdAndCustomerId(
    customerId: string,
    projectId: string,
  ) {
    const quotes = await this.stripe.quotes.list({
      customer: customerId,
    });
    const quotesByProjectId = quotes.data.filter((quote) => {
      return quote.metadata?.projectId === projectId;
    });
    return quotesByProjectId;
  }

  async getQuotePdf(quoteId: string) {
    try {
      const quotePdf = await this.stripe.quotes.pdf(quoteId);

      return {
        data: quotePdf,
        contentType: 'application/pdf',
        filename: `quote-${quoteId}.pdf`,
      };
    } catch (error: any) {
      throw new Error(
        `Failed to generate quote PDF: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async createProduct(body: CreateProductStripeDto) {
    const newProduct = await this.stripe.products.create({
      name: body.name,
      default_price_data: {
        currency: 'eur',
        unit_amount: body.price * 100,
      },
    });
    return newProduct;
  }

  async findProductByProductId(productId: string) {
    const product = await this.stripe.products.retrieve(productId);
    return product;
  }

  async confirmAccountActivation(freelanceId: string, accountId: string) {
    try {
      console.log('Starting account activation for:', {
        freelanceId,
        accountId,
      });

      // Vérifier que le compte Stripe est bien configuré
      const account = await this.stripe.accounts.retrieve(accountId);
      console.log('Stripe account retrieved:', {
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
      });

      if (!account.charges_enabled || !account.payouts_enabled) {
        throw new Error(
          "Le compte Stripe n'est pas encore entièrement configuré",
        );
      }

      // Mettre à jour le freelance avec le stripeAccountId confirmé
      console.log('Updating freelance in database...');
      const updatedFreelance = await this.prismaService.freelance.update({
        where: { id: freelanceId },
        data: { stripeAccountId: accountId },
        include: {
          user: true,
          skills: true,
        },
      });
      console.log('Freelance updated successfully:', {
        id: updatedFreelance.id,
        stripeAccountId: updatedFreelance.stripeAccountId,
      });

      return {
        success: true,
        freelance: updatedFreelance,
        message: 'Compte Stripe activé avec succès',
      };
    } catch (error) {
      console.error('Error confirming account activation:', error);
      throw new Error(
        `Erreur lors de la confirmation d'activation: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
