import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from './entities/order.entity';
import { ProductSize } from 'src/product_size/entities/product_size.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(ProductSize)
    private productSizeRepository: Repository<ProductSize>,

  ) { }

  async create(createOrderDto: CreateOrderDto, userId: number) {
    const { cartId }: any = createOrderDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: {
        product: true,
        size: true,
        user: true,
      }
    });
    if (user && cart) {
      const product = await this.productRepository.findOne({
        where: { id: cart.product.id }
      });
      if (product && cart.user.id == user.id) {
        const order = this.orderRepository.create({
          product,
          user,
          quantity: cart.quantity,
          size: cart.size.size,
          price: cart.price,
        });
        await this.orderRepository.save(order);
        await this.productSizeRepository.update({ id: cart.size.id }, {
          count: cart.size.count - cart.quantity
        })
        await this.cartRepository.delete({ id: cart.id });
        return "add order"
      } else {
        throw new NotFoundException('data is incorrect');
      }
    } else {
      throw new NotFoundException('user or cart not found');
    }
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return await this.orderRepository.find({
        where: {
          user
        },
        relations: {
          product: true
        }
      });
    } else {
      throw new NotFoundException('user not found');
    }
  }
}
