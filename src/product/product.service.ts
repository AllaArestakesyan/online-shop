import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { ProductImagesService } from 'src/product-images/product-images.service';
import { ProductSizeService } from 'src/product_size/product_size.service';
import { ProductImage } from 'src/product-images/entities/product-image.entity';
import { Brand } from 'src/brand/entities/brand.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    private productImageService: ProductImagesService,
    private productSizeService: ProductSizeService,
  ) { }

  async create(createProductDto: CreateProductDto, images: any) {
    const { sizes, ...data }: any = createProductDto;
    const category = await this.categoryRepository.findOneBy({ id: createProductDto.category });
    const brand = await this.brandRepository.findOneBy({ id: createProductDto.brand });
    if (category && brand) {
      const prod = await this.productRepository.create({
        ...data,
        category,
        brand
      });
      const obj: any = await this.productRepository.save(prod)
      // console.log(images, colors, sizes);
      for (let e of images) {
        await this.productImageService.create({ name: e.filename }, obj.id)
      }
      for (let e of JSON.parse(sizes)) {
        await this.productSizeService.create({ ...e }, obj.id)
      }
      // return { createProductDto, images, sizes, colors };
      return "add new product"
    } else {
      throw new NotFoundException('category or brand not found');

    }
  }

  async findAll() {
    const arr = await this.productRepository
      .createQueryBuilder("product")
      .select(["product.id", "product.name", "product.price"])
      .innerJoinAndSelect("product.images", 'product_image')
      .innerJoinAndSelect("product.brand", 'brand')
      .innerJoinAndSelect("product.category", 'category')
      .getMany()
    return arr.map(e => ({ ...e, images: e.images[0].name }))
  }
  async filterBy({ page, categoryName, brandName, min_price, max_price, size, limit }:
    { page: number, categoryName: string,  brandName:string, min_price: number, max_price: number, size: number, limit: number }) {

    const arr = await this.productRepository
      .createQueryBuilder("product")
      .innerJoinAndSelect("product.sizes", "product_size")
      .innerJoinAndSelect("product.category", "category")
      .innerJoinAndSelect("product.brand", "brand")
      .where(size ? "product_size.size = :size" : "product_size.id>0", { size })
      .andWhere(categoryName ? "category.name = :categoryName" : "category.id>0", { categoryName })
      .andWhere(brandName ? "brand.name = :brandName" : "brand.id>0", { brandName })
      .andWhere(min_price ? "product.price >= :min_price" : "product.price>=0", { min_price })
      .andWhere(max_price ? "product.price <= :max_price" : "product.id>0", { max_price })
      .select(["product.id", "product.name",  "product.price", "product_size"])
      .innerJoinAndSelect("product.images", 'product_image')
      .orderBy("product.id")
      .getMany()
    return {
      error: false,
      count: arr.length,
      page,
      rows: arr.map(e => ({ ...e, images: e.images[0].name ?? null })).slice(page * limit, page * limit + +limit)
    }
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
        images: true,
        sizes: true
      },
    });
    if (product) {
      return product;
    } else {
      throw new NotFoundException('Product not found');
    }
  }


  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });
    const category = await this.categoryRepository.findOneBy({ id: updateProductDto.category });
    if (!category) {
      throw new NotFoundException('product not found');
    }
    if (product) {
      const { sizes, ...data }: any = updateProductDto;
      await this.productRepository.update(id, { ...data })
      for (let e of sizes) {
        await this.productSizeService.create({ ...e }, product.id)
      }
      return true;
    } else {
      throw new NotFoundException('product not found');
    }
  }

  async remove(id: number) {
    const prod = await this.productRepository.findOneBy({ id });
    if (prod) {
      await this.productImageService.removeByProductId(id)
      await this.productRepository.delete({ id })
      return true;
    } else {
      throw new NotFoundException('product not found');
    }
  }
}