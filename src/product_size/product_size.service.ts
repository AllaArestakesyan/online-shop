import { Injectable , NotFoundException} from '@nestjs/common';
import { CreateProductSizeDto } from './dto/create-product_size.dto';
import { UpdateProductSizeDto } from './dto/update-product_size.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSize } from './entities/product_size.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class ProductSizeService {
  constructor(
    @InjectRepository(ProductSize)
    private sizeRepository: Repository<ProductSize>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(createsizeProductDto: CreateProductSizeDto, id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (product) {
      const img = this.sizeRepository.create({
        ...createsizeProductDto,
        product
      });
      await this.sizeRepository.save(img);
      return "add new size"
    } else {
      throw new NotFoundException('product not found');
    }
  }
 
  // async findAll() {
  //   const data = await this.sizeRepository.find()
  //   if (data) {
  //     return data
  //   } else {
  //     throw new NotFoundException('sizeProduct not found')
  //   }
  // }

  // async findOne(id: number) {
  //   const ImageProduct = await this.sizeRepository.findOne({
  //     where: { id },
  //   });
  //   if (ImageProduct) {
  //     return ImageProduct;
  //   } else {
  //     throw new NotFoundException('sizeProduct not found');
  //   }
  // }

  async remove(id: number) {
    const size = await this.sizeRepository.findOneBy({ id });
    if (size) {
      this.sizeRepository.delete({ id })
      return true;
    } else {
      throw new NotFoundException('size not found');
    }
  }

  async removeByProductId(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if(product){
      this.sizeRepository.delete({ product })
    }
    return true;
  }

  async update(id: number, updateProductSizeDto: UpdateProductSizeDto) {
    const size = await this.sizeRepository.findOneBy({ id });
    if (size) {
      this.sizeRepository.update({ id }, updateProductSizeDto)
      return "update size by id " + id;
    } else {
      throw new NotFoundException('size not found');
    }
  }
}
