import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CreateAccountConnectionDto } from './dto/create-account-connection.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async getProducts(): Promise<Stripe.Product[]> {
    const products = await this.stripe.products.list();
    return products.data;
  }

  async getCustomers() {
    const customers = await this.stripe.customers.list({});
    return customers.data;
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
        const checkoutSessionCompleted = event.data.object;

        if (!checkoutSessionCompleted.metadata) {
          console.error('User id not found in checkout session');
          return;
        }

        if (!checkoutSessionCompleted.metadata.userId) {
          console.error('User id not found in checkout session');
          return;
        }

        break;
      }
      case 'checkout.session.expired': {
        const checkoutSessionCancelled = event.data.object;
        console.log('checkoutSessionCancelled', checkoutSessionCancelled);
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
        client_id: 'ca_SIvOaEDhtyne4JKdLiaaYb3ufmm1Dsj0',
      },
      capabilities: {
        transfers: {
          requested: true,
        },
      },
    });
    return accountConnection;
  }

  async getAccountConnection(accountId: string) {
    const accountConnection = await this.stripe.accounts.retrieve(accountId);
    return accountConnection;
  }
}
