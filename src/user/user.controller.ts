import { Controller, Get, UploadedFile, Request, UseInterceptors, HttpCode, HttpStatus, UseGuards, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Response } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/upload/config';
import { HasRoles } from './role/roles.decorator';
import { Role } from './role/enum.role';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Verify } from './dto/verify.dto';
import { ForgotPassword } from './dto/forgot-password';
import { ResetPassword } from './dto/reset-password';

@ApiTags("User*")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async findAll(@Request() req, @Res() res: Response) {
    try {
      const data = await this.userService.findAll(req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("/verify")
  async verify(@Body() user: Verify, @Res() res: Response) {
    try {
      const data = await this.userService.verify(user);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message })
    }
  }


  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.userService.findOneById(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Patch('/us/changepassword')
  async changePassword(
    @Body() changePassword: ChangePasswordDto,
    @Res() res: Response,
    @Request() req
  ) {
    try {
      const data = await this.userService.changePassword(changePassword, req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @Patch('/updatePicUrl')
  async update(
    @Res() res: Response,
    @UploadedFile() file,
    @Request() req
  ) {
    try {
      const data = await this.userService.updatePic(req.user.userId, file);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Patch('/us/updateData')
  async updateData(
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
    @Request() req
  ) {
    try {
      const data = await this.userService.updateData(req.user.userId, updateUserDto)
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
  @HttpCode(HttpStatus.OK)
  @Patch('/us/forgotPassword')
  async forgotPassword(
    @Body() forgotPassword: ForgotPassword,
    @Res() res: Response,
    @Request() req
  ) {
    try {
      const data = await this.userService.forgotPassword(forgotPassword)
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
  @HttpCode(HttpStatus.OK)
  @Patch('/us/resetPassword/:email')
  async resetPassword(
    @Body() resetPassword: ResetPassword,
    @Param("email") email:string,
    @Res() res: Response,
    @Request() req
  ) {
    try {
      const data = await this.userService.resetPassword(resetPassword, email)
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.USER)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response, @Request() req) {
    try {
      const data = await this.userService.remove(+id, req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}