import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request, Res, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/user/role/roles.decorator';
import { Role } from 'src/user/role/enum.role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/upload/config';

@ApiTags('Product-images*')
@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) { }


  @HttpCode(HttpStatus.OK)
  // @HasRoles(Role.ADMIN)
  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: "number" },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images', null, multerOptions))
  @Post('/addImagesProduct')
  async update(
    @Body() obj:any,
    @Res() res: Response,
    @UploadedFiles() images:Array<any>,
    @Request() req
  ) {
    try {
      const data = await this.productImagesService.addImagesProduct(obj.productId, images);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }


  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string,
    @Request() req,
    @Res() res: Response) {
    try {
      const data = await this.productImagesService.remove(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
