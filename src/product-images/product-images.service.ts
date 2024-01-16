import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import * as fs from 'fs'
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { join } from 'path';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private imageRepository: Repository<ProductImage>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(createImageProductDto: CreateProductImageDto, id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (product) {
      const img = this.imageRepository.create({
        ...createImageProductDto,
        product
      });
      return this.imageRepository.save(img);
    } else {
      throw new NotFoundException('product not found');
    }
  }

  // async findAll() {
  //   const data = await this.imageRepository.find()
  //   if (data) {
  //     return data
  //   } else {
  //     throw new NotFoundException('ImageProduct not found')
  //   }
  // }

  // async findOne(id: number) {
  //   const ImageProduct = await this.imageRepository.findOne({
  //     where: { id },
  //   });
  //   if (ImageProduct) {
  //     return ImageProduct;
  //   } else {
  //     throw new NotFoundException('ImageProduct not found');
  //   }
  // }

  async addImagesProduct(id: number, images: any) {
    const product = await this.productRepository.findOneBy({ id });
    console.log(product, images);

    if (product) {
      for (let e of images) {
        await this.imageRepository.save({ name: e.filename, product });
      }
      return true;
    } else {
      return new NotFoundException('product not found');
    }
  }

  async remove(id: number) {
    const img = await this.imageRepository.findOneBy({ id });
    if (img) {
      fs.unlinkSync(join(__dirname, '..\\..', 'uploads\\') + img.name)
      this.imageRepository.delete({ id })
      return true;
    } else {
      throw new NotFoundException('img not found');
    }
  }

  async removeByProductId(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (product) {
      const imgs = await this.imageRepository.find({
        where: { product }
      });
      this.imageRepository.delete({ product })
      for (let e of imgs) {
        fs.unlinkSync(join(__dirname, '..\\..', 'uploads\\') + e.name)
      }
    }
    return true;
  }
}