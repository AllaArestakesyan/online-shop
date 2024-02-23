import { Controller,Request, Get,UseGuards, Post, Body, Patch, Param, Delete, HttpCode , HttpStatus, Res} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/user/role/roles.decorator';
import { Role } from 'src/user/role/enum.role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Response } from 'express';

@ApiTags('Order*')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth('JWT-auth')
  // @HasRoles(Role.USER)
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Post()
  // async create(
  //   @Body()  createOrderDto: CreateOrderDto,
  //   @Request() req,
  //   @Res() res: Response) {
  //   try {
  //     const data = await this.orderService.create(createOrderDto, req.user.userId);
  //     return res.status(HttpStatus.OK).json(data);
  //   } catch (e) {
  //     return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
  //   }
  // }
  
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ description: "user-ին հնարավորություն է տալիս տեսնել իր բոլոր գնած product—ները" })
  @Get('getByUserId')
  async findOne(
    @Request() req,
    @Res() res: Response) {
    try {
      const data = await this.orderService.findOne(+req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

}
