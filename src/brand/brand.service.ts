import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService {

  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>
  ) { }


  async create(createBrandDto: CreateBrandDto) {
    const catgeory = await this.brandRepository.findOneBy({ name: createBrandDto.name });
    if (!catgeory) {
      const cat = this.brandRepository.create({
        ...createBrandDto,
      });
      return this.brandRepository.save(cat);
    } else {
      throw new NotFoundException('brand has already');
    }
  }

  async findAll() {
    const data = await this.brandRepository.find()
    if (data) {
      return data
    } else {
      throw new NotFoundException('brand not found')
    }
  }

  async findOne(id: number) {
    const category = await this.brandRepository.findOne({
      where: { id },
      relations: {
        products: true,
      },
    });
    if (category) {
      return category;
    } else {
      throw new NotFoundException('brand not found');
    }
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const catgeory = await this.brandRepository.findOneBy({ id });
    if (catgeory) {
      await this.brandRepository.update(id, updateBrandDto)
      return true;
    } else {
      throw new NotFoundException('brand not found');
    }
  }
  async remove(id: number) {
    const cat = await this.brandRepository.findOneBy({ id });
    if (cat) {
      this.brandRepository.delete({ id })
      return true;
    } else {
      throw new NotFoundException('catgeory not found');
    }
  }
}
