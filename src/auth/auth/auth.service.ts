import { Injectable, HttpException, HttpStatus, } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO, VerificationDto } from '../dto/auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService

  ) {
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    if (!user.isVerified) {
      throw new HttpException('Is not verified', HttpStatus.BAD_REQUEST);
    }
    const payload = {
      username: user.email,
      userId: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      role:user.role
    };
  }

  async register(userDto: RegisterDTO) {
    const { email, name, username, password, phone_number } = userDto;
    const user = await this.userService.findOneBy(email);
    const userN = await this.userService.findOneBy(username);
    if (user) {
      throw new HttpException('Email is already in use.', HttpStatus.BAD_REQUEST);
    } else if (userN) {
      throw new HttpException('Username is already in use.', HttpStatus.BAD_REQUEST);
    } else {
      const emailToken = uuidv4();
      const createdUser = await this.userService.create({
        name,
        username,
        email,
        password: bcrypt.hashSync(password, 10),
        role: 0,
        emailToken,
        isVerified: 0,
        phone_number
      });

      try {
        const url = `http://localhost:3000/verify?email=${email}&emailToken=${emailToken}`;
        await this.mailerService.sendMail({
          to: "...",
          // to:email,
          from: '...',
          subject: 'Welcome to Shop! Confirm your Email',
          html: `Hi! There, You have recently visited 
          our website and entered your email.
          Please follow the given link to verify your email
          <a href='${url}'>click</a> 
          Thanks`
        });
      } catch (e) {
        console.log(e.message);
      }
      return {
        message: "Registration successful."
      };
    }
  }
}