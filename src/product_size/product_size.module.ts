import { Module } from '@nestjs/common';
import { ProductSizeService } from './product_size.service';
import { ProductSizeController } from './product_size.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSize } from './entities/product_size.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSize, Product])],
  controllers: [ProductSizeController],
  providers: [ProductSizeService],
  exports: [ProductSizeService]
})
export class ProductSizeModule {}
