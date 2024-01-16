import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) { }
  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const { productId }: any = createWishlistDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    const product = await this.productRepository.findOneBy({ id: productId });
    if (user && product) {
      const x = await this.wishlistRepository.findOneBy({
        product,
        user
      })
      if (!x) {
        const wish = this.wishlistRepository.create({
          product,
          user
        });
        return this.wishlistRepository.save(wish);
      } else {
        return { message: "You already liked this product" }
      }
    } else {
      throw new NotFoundException('user or product not found');
    }
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return await this.wishlistRepository.find({
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

  async remove(id: number, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      const wish = await this.wishlistRepository.findOne({
        where: {
          id
        },
        relations: {
          user: true
        }
      });
      if (wish && wish.user.id == user.id) {
        return await this.wishlistRepository.delete({ id })
      } else {
        throw new NotFoundException("you don't have any access");
      }
    } else {
      throw new NotFoundException('user not found');
    }
  }
}
