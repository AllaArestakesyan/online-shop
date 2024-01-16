import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Res, HttpStatus, HttpCode, UseGuards, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/user/role/roles.decorator';
import { Role } from 'src/user/role/enum.role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags("Category*")
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await this.categoryService.findAll();
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  async findOne(@Param("id") id: number, @Res() res: Response) {
    try {
      const data = await this.categoryService.findOne(id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req, @Res() res: Response) {
    try {
      const data = await this.categoryService.create(createCategoryDto);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "you don't have any access" });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateCategoryDto: UpdateCategoryDto, @Request() req, @Res() res: Response) {
    try {
      const data = await this.categoryService.update(id, updateCategoryDto);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: "you don't have any access" });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.categoryService.remove(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "you don't have any access" });
    }
  }
}