import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartService } from 'src/cart/cart.service';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderService } from 'src/order/order.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductSize } from 'src/product_size/entities/product_size.entity';
import { User } from 'src/user/entities/user.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { PaymentDto, StripeData } from './dto/stripe.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;


  constructor(

    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductSize) private productSizeRepository: Repository<ProductSize>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
  ) {
    this.stripe = new Stripe("sk_test_51HWiPKCJWPBoW4PKKVuFPkyjxJsD52wUEhFshHFBT6w9sPgeoH7RVSoiry7hRt4pkhX7XYx24bkmTZhgkv1I06EV00OaEz2R4M", {
      apiVersion: '2023-10-16',
    });
  }
  // async checkout(payment:any) {
  //  console.log( payment.data);

  //   const data =  await this.stripe.checkout.sessions.create({
  //     line_items: payment.data,
  //     // [
  //       // {
  //       //   price_data: {
  //       //     currency: 'usd',
  //       //     product_data: {
  //       //       name: 'T-shirt',
  //       //     },
  //       //     unit_amount: 2000,
  //       //   },
  //       //   quantity: 1,
  //       // },
  //       // {
  //       //   price_data: {
  //       //     currency: 'usd',
  //       //     product_data: {
  //       //       name: 'T-good',
  //       //     },
  //       //     unit_amount: 5000,
  //       //   },
  //       //   quantity: 5,
  //       // },
  //     // ],
  //     mode: 'payment',
  //     success_url: 'http://localhost:3001/success',
  //     cancel_url: 'http://localhost:3001/cancel',
  //   })
  //   return {url: data.url}
  // }

  async createCharge(param: PaymentDto, userId: number) {
    const arr: StripeData[] = []
    // for (let e of param.data) {
    //   const prod = await this.productRepository.findOne({
    //     where: {
    //       id: e.price_data.productId
    //     }
    //   })
    //   const prodSize = await this.productSizeRepository.findOne({
    //     where: {
    //       id: e.price_data.sizeId
    //     }
    //   })
    //   console.log(prod, prodSize);

    //   if (prod && prodSize && prod.id == prodSize.productId && prodSize.count > e.quantity) {
    //     const data: StripeData = {
    //       price_data: {
    //         currency: param.currency,
    //         product_data: {
    //           name: prod.name
    //         },
    //         unit_amount: prod.price
    //       },
    //       quantity: e.quantity
    //     }
    //     arr.push(data)
    //   } else {
    //     throw new BadRequestException("Ooops! incorrect data")
    //   }
    // }
    const user = await this.userRepository.findOneBy({ id: userId });
    for (let e of param.data) {
      console.log(e);

      const cart = await this.cartRepository.findOne({
        where: {
          id: e,
          user
        },
        relations: {
          user: true,
          product: true,
          size: true
        }
      });
      if (!cart) {
        throw new BadRequestException("Ooops! cart incorrect data")
      }
      const product = await this.productRepository.findOne({
        where: { id: cart.product.id }
      });
      if (!product) {
        throw new BadRequestException("Ooops! product incorrect data")
      }
      const data: StripeData = {
        price_data: {
          currency: param.currency,
          product_data: {
            name: cart.product.name
          },
          unit_amount: cart.product.price
        },
        quantity: cart.quantity
      }
      arr.push(data)
    }
    console.log(arr);
    for (let e of param.data) {
      const cart = await this.cartRepository.findOne({
        where: {
          id: e,
          user
        },
        relations: {
          user: true,
          product: true,
          size: true
        }
      });
      const product = await this.productRepository.findOne({
        where: { id: cart.product.id }
      });
      const order =await this.orderRepository.create({
        product,
        user,
        quantity: cart.quantity,
        size: cart.size.size,
        price: cart.product.price,
        date: new Date(),
        sizeId: cart.size
      });
      await this.orderRepository.save(order);
      // await this.productSizeRepository.update({ id: cart.size.id }, {
      //   count: cart.size.count - cart.quantity
      // })
      await this.cartRepository.delete({ id: cart.id });
    }
    const data = await this.stripe.checkout.sessions.create({
      line_items: arr,
      mode: 'payment',
      success_url: 'http://localhost:3001/stripe/success',
      cancel_url: 'http://localhost:3001/stripe/cancel',
    })
    return { url: data.url }
    // return { arr }
  }

  async success(userId: number) {
    console.log(userId);

    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      const arr = await this.orderRepository.find({
        where: {
          user,
          status: 0
        },
        relations: {
          product: true,
          sizeId: true
        }
      });
      await this.orderRepository.update({ userId }, { status: 1 })
      console.log(arr);
      for (let e of arr) {
        await this.productSizeRepository.update({ id: e.sizeId.id }, {
          count: e.sizeId.count - e.quantity
        })
      }
      
      return arr
    } else {
      throw new NotFoundException('user not found');
    }
  }
  async cancel(userId: number) {
    console.log(userId);

    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      const arr = await this.orderRepository.find({
        where: {
          user,
          status: 0
        },
        relations: {
          product: true,
          sizeId:true
        }
      });
      for (let e of arr) {
        await this.cartRepository.save({
          product:e.product,
          user,
          quantity: e.quantity,
          size: e.sizeId,
          price: e.price,
        });
      }
      await this.orderRepository.delete({ userId, status:0 })
      return arr
    } else {
      throw new NotFoundException('user not found');
    }
  }

  // async createSubscription(customerId: string, priceId: string) {
  //   return this.stripe.subscriptions.create({
  //     customer: customerId,
  //     items: [{ price: priceId }],
  //   });
  // }

  // async createCustomer(email: string) {
  //   return this.stripe.customers.create({ email });
  // }

}

// https://stripe.com/docs/payments/accept-a-payment#web-collect-card-details