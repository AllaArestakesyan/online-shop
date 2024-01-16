import { Controller, Get, Post, Body, Patch, Param, Delete , Header, Req, Res} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { PaymentDto, UpdateStripeDto } from './dto/update-stripe.dto';
import Stripe from 'stripe';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("stripe")
@Controller('stripe')
export class StripeController {
  private stripe: Stripe;
  constructor(private readonly stripeService: StripeService) { }


  @Post('charge')
  async chargeCard(@Body() paymentData: PaymentDto) {
    return this.stripeService.createCharge(paymentData.amount, paymentData.currency, paymentData.source);
  }

  @Post('webhook')
  @Header('Content-Type', 'application/json')
  async webhook(@Req() request, @Res() response: Response) {
    const sig = request.headers['stripe-signature'];
    console.log(sig);
    let event;  
    try {
      event = this.stripe.webhooks.constructEvent(request.body, sig, "pk_test_51OWwB0JvDs4Tc5XZVAZLF64TIUAHmoVlGMSPtnYzSqqbcuV4neCeQ6850VvXCqlhueULqXrrTEUFTCJ8YaDVIVLM00sQmk93zT");
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle the event...
    response.status(200).send({ received: true });
  }
}
