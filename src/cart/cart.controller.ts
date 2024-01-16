import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/user/role/roles.decorator';
import { Role } from 'src/user/role/enum.role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Response } from 'express';

@ApiTags("Cart*")
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @HasRoles(Role.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(
    @Body() createCartDto: CreateCartDto,
    @Request() req,
    @Res() res: Response) {
    try {
      const data = await this.cartService.create(createCartDto, req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }


  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @HasRoles(Role.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('getByUserId')
  async findOne(
    @Request() req,
    @Res() res: Response) {
    try {
      const data = await this.cartService.findOne(+req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @HasRoles(Role.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Request() req,
    @Res() res: Response,
    @Body() updateCartDto: UpdateCartDto) {
    try {
      const data = await this.cartService.update(+id,  updateCartDto, req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @HasRoles(Role.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Request() req,
    @Res() res: Response) {
    try {
      const data = await this.cartService.remove(id, req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
