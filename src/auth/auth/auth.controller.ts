import { Controller, HttpCode, HttpStatus, Request, Get, Post, Body, Query, Res } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/user/role/enum.role';
import { HasRoles } from 'src/user/role/roles.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { LocalAuthGuard } from '../local-auth.guard';
import { RolesGuard } from '../roles.guard';
import { RegisterDTO } from '../dto/auth.dto';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginUser } from '../dto/login.dto';


@ApiTags("Auth*")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private userService: UserService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() us: LoginUser, @Request() req) {
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  async register(@Body() registerDto: RegisterDTO, @Res() res: Response) {
    try {
      const data = await this.authService.register(registerDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  async getProfile(@Request() req, @Res() res: Response) {
    try {
      const data = await this.userService.findOneById(req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: e.message });
    }
  }

}