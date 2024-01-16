import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request, Res } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/user/role/roles.decorator';
import { Role } from 'src/user/role/enum.role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Response } from 'express';

@ApiTags("Wishlist*")
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @HasRoles(Role.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Request() req,
    @Res() res: Response) {
    try {
      const data = await this.wishlistService.create(createWishlistDto, req.user.userId);
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
      const data = await this.wishlistService.findOne(+req.user.userId);
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
      const data = await this.wishlistService.remove(id, req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
