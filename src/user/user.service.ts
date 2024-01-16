import { RegisterDTO } from '../auth/dto/auth.dto';
import {
  HttpException,
  Injectable,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPassword } from './dto/forgot-password';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPassword } from './dto/reset-password';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly mailerService: MailerService
  ) { }

  async create(userDto: RegisterDTO) {
    const user = this.usersRepository.create(userDto);
    return this.usersRepository.save(user);
  }

  async findOne(email: string): Promise<User | undefined> {
    // return await this.usersRepository.findOne({
    //   where: {
    //     email,
    //   },
    // });
    return await this.usersRepository.
      createQueryBuilder("user")
      .where('user.email = :email', { email })
      .orWhere('user.username = :email', { email })
      .getOne()
  }
  async findOneBy(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findAll(id: number): Promise<User[]> {
    const data = await this.usersRepository.
      createQueryBuilder("user")
      .where('user.id != :id', { id })
      .getMany()
    return data
  }

  async verify(user: { email: string, emailToken: string }) {
    const us = await this.usersRepository.findOne({
      where: {
        email: user.email,
        emailToken: user.emailToken
      },
    })
    if (us) {
      await this.usersRepository.update({ id: us.id }, { emailToken: null, isVerified: 1 })
      return true
    } else {
      throw new NotFoundException("Oops! data not found")
    }
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        pic_url: true,
        role: true
      },
    });
    if (user) {
      return user;
    } else {
      return new NotFoundException('user not found');
    }
  }

  async updatePic(id: number, file: any) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      this.usersRepository.update({ id }, { pic_url: file.filename });
      return true;
    } else {
      return new NotFoundException('user not found');
    }
  }
  
  async updateData(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      const { name, username } = updateUserDto
      this.usersRepository.update({ id }, { name, username });
      return true;
    } else {
      return new NotFoundException('user not found');
    }
  }
  async forgotPassword(fPass: ForgotPassword) {
    const user = await this.usersRepository.findOne({
      where: {
        email: fPass.email,
      },

    })
    if (user) {
      const code = Math.floor(Math.random() * 10000000)
      await this.usersRepository.update({ id: user.id }, { code });

      try {
        await this.mailerService.sendMail({
          to: "...",
          // to:email,
          from: '...',
          subject: 'Welcome to Shop! Confirm your Email',
          html: `<h3 style='color:#0aa'>Hello ${user.name}</h3>\n
          You have requested to reset the password of your account.
          \n\n\nHere is the security code to change your password. 
          \n <h3 style="font-fam">${code}</h3>`
        });
      } catch (e) {
        console.log(e.message);
      }

      return true;
    } else {
      return new NotFoundException('user not found');
    }
  }

  async resetPassword(rPass: ResetPassword, email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
        code: rPass.code
      }
    })
    if (user) {
      if (rPass.password != rPass.confirm_password) {
        throw new BadRequestException('Passwords do not match.');
      }
      await this.usersRepository.update({ id: user.id }, {
        password: bcrypt.hashSync(rPass.password, 10),
        code: null
      })
      return true;
    } else {
      throw new BadRequestException('Invalid or expired reset code.');
    }
  }

  async changePassword(data: ChangePasswordDto, id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    console.log(user);
    let comp1 = bcrypt.compareSync(data.currentPassword, user.password);
    let comp = bcrypt.compareSync(data.password, user.password);
    console.log(data);
    console.log(comp1);

    if (!comp1) {
      throw new HttpException('Wrong passwors', HttpStatus.BAD_REQUEST);
    }
    if (!!comp) {
      throw new HttpException(
        'Current and new password can not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (data.password === data.confirmationPassword) {
      if (user) {
        this.usersRepository.update(
          { id: id },
          { password: bcrypt.hashSync(data.password, 10) },
        );
        return true
      } else {
        throw new NotFoundException('user not found');
      }
    } else {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const us = await this.usersRepository.findOneBy({ id });
    if (us) {
      if (us.id == userId) {
        this.usersRepository.delete({ id })
        return true;
      } else {
        throw new NotFoundException("you don't have any access");
      }
    } else {
      throw new NotFoundException("user not found");
    }
  }
}
