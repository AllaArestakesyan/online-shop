import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { ProductSize } from 'src/product_size/entities/product_size.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(ProductSize)
    private productSizeRepository: Repository<ProductSize>,
  ) { }

  async create(createCartDto: CreateCartDto, userId: number) {
    const { productId, quantity,  sizeId }: any = createCartDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    const product = await this.productRepository.findOneBy({ id: productId });
    if (user && product) {
      const productSize = await this.productSizeRepository.findOne({
        where: { id: sizeId },
        relations: { product: true }
      });
      if (productSize &&
        productSize.product.id == product.id &&
        productSize.count >= quantity
      ) {
        const x = await this.cartRepository.findOneBy({
          product,
          user,
          size:productSize
        })
        if (!x) {
          const wish = this.cartRepository.create({
            product,
            user,
            quantity,
            size:productSize
          });
          return this.cartRepository.save(wish);
        } else {
          return await this.cartRepository.update({ id: x.id }, {
            quantity: x.quantity + 1
          })
        }
      } else {
        throw new NotFoundException(!productSize?'productSize does not exist':productSize.product.id != product.id?"productSize and product do not match":"quantity is exceeded");
      }
    } else {
      throw new NotFoundException('user or product not found');
    }
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return await this.cartRepository.find({
        where: {
          user
        },
        relations: {
          product: true,
          size:true,
        }
      });
    } else {
      throw new NotFoundException('user not found');
    }
  }

  async update(id: number, updateCartDto: UpdateCartDto, userId: number) {
    const { quantity } = updateCartDto
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      const wish = await this.cartRepository.findOne({
        where: {
          id
        },
        relations: {
          user: true,
          product: true,
          size: true
        }
      });
      if (wish && wish.user.id == user.id) {
        if (wish.size.count >= quantity) {
           await this.cartRepository.update({ id }, {quantity})
           return true;
        } else {
          throw new NotFoundException('data is incorrect');
        }
      } else {
        throw new NotFoundException("you don't have any access");
      }
    } else {
      throw new NotFoundException('user not found');
    }
  }

  async remove(id: number, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      const wish = await this.cartRepository.findOne({
        where: {
          id
        },
        relations: {
          user: true
        }
      });
      if (wish && wish.user.id == user.id) {
         await this.cartRepository.delete({ id })
         return true;
      } else {
        throw new NotFoundException("you don't have any access");
      }
    } else {
      throw new NotFoundException('user not found');
    }
  }
}
