import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request, Res } from '@nestjs/common';
import { ProductSizeService } from './product_size.service';
import { CreateProductSizeDto } from './dto/create-product_size.dto';
import { UpdateProductSizeDto } from './dto/update-product_size.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/user/role/roles.decorator';
import { Role } from 'src/user/role/enum.role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Response } from 'express';

@ApiTags('Product-size*')
@Controller('product-size')
export class ProductSizeController {
  constructor(private readonly productSizeService: ProductSizeService) { }

  @HttpCode(HttpStatus.OK)
  // @HasRoles(Role.ADMIN)
  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(":productId")
  async create(@Body() createProductSizeDto: CreateProductSizeDto,
    @Request() req,
    @Param("productId") id: number,
    @Res() res: Response) {
    try {
      const data = await this.productSizeService.create(createProductSizeDto, id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string,
  //   @Request() req,
  //   @Res() res: Response) {
  //   try {
  //     const data = await this.productSizeService.findOne(+id);
  //     return res.status(HttpStatus.OK).json(data)
  //   } catch (e) {
  //     return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
  //   }
  // }

  @HttpCode(HttpStatus.OK)
  // @HasRoles(Role.ADMIN)
  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string,
    @Body() updateProductSizeDto: UpdateProductSizeDto,
    @Request() req,
    @Res() res: Response) {
    try {
      const data = await this.productSizeService.update(+id, updateProductSizeDto);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  // @HasRoles(Role.ADMIN)
  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string,
    @Request() req,
    @Res() res: Response) {
    try {
      const data = await this.productSizeService.remove(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
