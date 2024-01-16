import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductImagesModule } from 'src/product-images/product-images.module';
import { ProductSizeModule } from 'src/product_size/product_size.module';
import { Brand } from 'src/brand/entities/brand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product, Brand]), 
    ProductImagesModule,
    ProductSizeModule,
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
