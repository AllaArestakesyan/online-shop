import { Controller, Get, Post, Body, Patch, Param, Delete, Header, Req, Res, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PaymentDto } from './dto/stripe.dto';
import Stripe from 'stripe';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags("Stripe*")
@Controller('stripe')
export class StripeController {
  private stripe: Stripe;
  constructor(private readonly stripeService: StripeService) { }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ description: "user-ին հնարավորություն է տալիս գնել հավանած product-ները" })
  @Post('checkout-session')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        currency: { type: "string" },
        data: {
          type: 'array',
          items: {
            type: "number"
          }

          // items: {
          //   type: 'object',
          //   properties: {
          //     price_data: {
          //       type: 'object',
          //       properties: {
          //         productId: { type: "number" },
          //         sizeId: { type: "number" }
          //       }
          //     },
          //     quantity: {
          //       type: "number"
          //     }
          //   }
          // },
        },
      },
    },
  })
  async checkout(@Body() paymentData: PaymentDto, @Req() req, @Res() res: Response) {
    try {
      const data = await this.stripeService.createCharge(paymentData, req.user.userId)
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ description: "եթե վճարումը բարեհաջող կատարվում է, ապա աշխատում է success" })
  @Get("success")
  async successData(@Req() req, @Res() res: Response) {
    try {
      const data = await this.stripeService.success(req.user.userId)
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ description: "եթե վճարումը չեղարկվում է, ապա աշխատում է cancel" })
  @Get("cancel")
  async cancelData(@Req() req, @Res() res: Response) {
    try {
      const data = await this.stripeService.cancel(req.user.userId)
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
  // @Post('webhook')
  // @Header('Content-Type', 'application/json')
  // async webhook(@Req() request, @Res() response: Response) {
  //   const sig = request.headers['stripe-signature'];
  //   console.log(sig);
  //   let event;
  //   try {
  //     event = this.stripe.webhooks.constructEvent(request.body, sig, "pk_test_51OWwB0JvDs4Tc5XZVAZLF64TIUAHmoVlGMSPtnYzSqqbcuV4neCeQ6850VvXCqlhueULqXrrTEUFTCJ8YaDVIVLM00sQmk93zT");
  //   } catch (err) {
  //     return response.status(400).send(`Webhook Error: ${err.message}`);
  //   }
  //   response.status(200).send({ received: true });
  // }
}
