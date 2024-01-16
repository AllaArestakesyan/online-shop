import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe("sk_test_51OWwB0JvDs4Tc5XZ2oLGwVOOJNcvj8SfMn81r3GH1l4JqnTbXKZwsLL6Y5o4jVUZFkoiVexBQkKg5dce1FVAQ5On00F76XFefy", {
      apiVersion: '2023-10-16',
    });
  }

  async createCharge(amount: number, currency: string, source: string) {
    // return this.stripe.paymentIntents.create({
    //   // amount,
    //   // currency,
    //   // payment_method: 'pm_card_visa',
    //   amount: 50000,
    //   // currency: 'gbp',
    //   currency:"usd",
    //   // currency:"amd",
    //   payment_method: 'pm_card_visa',

    // });

    return await this.stripe.charges.create({
      amount: 2000, // amount in cents
      currency: 'usd',
      source: 'tok_visa', // token obtained with Stripe.js
      description: 'Charge for test@example.com',
    });
  }

  async createSubscription(customerId: string, priceId: string) {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
    });
  }

  async createCustomer(email: string) {
    return this.stripe.customers.create({ email });
  }

}