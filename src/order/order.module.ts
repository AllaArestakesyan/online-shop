import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { ProductSize } from 'src/product_size/entities/product_size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product, Cart, ProductSize])],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
