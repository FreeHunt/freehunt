import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CreateAccountConnectionDto } from './dto/create-account-connection.dto';
import { ActivateCustomerConnectionDto } from './dto/activate-customer-connection.dto';
import { CreateQuoteStripeDto } from './dto/create-quote-stripe.dto';
import { CreateProductStripeDto } from './dto/create-product-stripe.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  handleWebhook(body: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (error: any) {
      throw new Error(
        'Webhook signature verification failed' +
          (error instanceof Error ? error.message : String(error)),
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        //const checkoutSessionCompleted = event.data.object;

        break;
      }
      case 'checkout.session.expired': {
        //const checkoutSessionCancelled = event.data.object;
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  async createCheckoutSession(body: CreateCheckoutSessionDto) {
    const checkoutSession = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: body.price * 100,
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
      customer: body.customerId,
      customer_email: body.customerEmail,
      metadata: {
        companyId: body.companyId,
      },
    });
    return checkoutSession;
  }
  async createAccountConnection(body: CreateAccountConnectionDto) {
    const accountConnection = await this.stripe.accounts.create({
      type: 'express',
      country: 'FR',
      email: body.email,
      metadata: {
        freelanceId: body.freelanceId,
      },
    });
    return accountConnection;
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
}
