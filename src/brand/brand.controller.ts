import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/role/enum.role';
import { HasRoles } from 'src/user/role/roles.decorator';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiTags("Brand*")
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }


  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "admin-ին հնարավորություն է տալիս ավելացնել նոր brand" })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(@Body() createBrandDto: CreateBrandDto, @Request() req, @Res() res: Response) {
    try {
      const data = await this.brandService.create(createBrandDto);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: "you don't have any access" });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "hնարավորություն է տալիս ավելացնել բոլոր brand-ին" })
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await this.brandService.findAll();
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: "you don't have any access" });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "hնարավորություն է տալիս brand-ի տվյալները ըստ id-ի, իր հետ բերելոբ նաև իր բոլոր product-ները" })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.brandService.findOne(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: "you don't have any access" });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ description: "admin-ին հնարավորություն է տալիս թարմացնել brand-ի տվյալները ըստ id-ի" })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Res() res: Response, @Body() updateBrandDto: UpdateBrandDto) {
    try {
      const data = await this.brandService.update(+id, updateBrandDto);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: "you don't have any access" });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ description: "admin-ին հնարավորություն է տալիս ջնջել brand-ի տվյալները" })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.brandService.remove(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: "you don't have any access" });
    }
  }
}
