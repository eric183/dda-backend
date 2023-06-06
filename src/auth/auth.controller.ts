import {
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TUser, UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { check } from 'prettier';
import { AuthUser } from 'src/decorators/auth';

// import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log(req, 'loginReq!!!!');
    return this.authService.login(req.user);
  }

  // @AuthUser()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: Omit<TUser, 'password'> }) {
    return req.user;
  }

  @Get('verify/:email/:code')
  async verifyEmail(@Param() params) {
    const { email, code } = params;
    console.log(params, 'params !!!!');
    // verifiedCode
    const ifVerified = await this.usersService.verifyCode(
      email,
      code.toString(),
    );

    if (ifVerified) {
      return this.usersService.verifyEmail(email);
    }

    return 'Your code is not correct';
  }

  @Post('sendMailVerification')
  sendMailVerification(@Body() { to, context }) {
    // this.userVerificationMap.set(body.email, code);

    return this.mailService.sendMail({
      to,
      subject: 'Email Verification',
      context,
    });
  }

  @Post('checkEmail')
  async checkEmail(@Body() { email }) {
    const ifUserExist = await this.usersService.checkUserExist(email);

    if (ifUserExist) {
      throw new Error('User already exist');
    }

    return true;
  }

  @Post('googleAuth')
  async googleAuth(@Body() body) {
    const ifUserExist = await this.usersService.checkUserExist(body.email);

    const isUserVerified = this.usersService.checkUserVerified(body.email);

    // if (!isUserVerified) {
    //   await this.sendMailVerification({
    //     to: body.email,
    //     context: {
    //       email: body.email,
    //       username: body.username,
    //       authUrl: process.env.MAIL_AUTH_URL,
    //       code,
    //     },
    //   });
    // }

    if (ifUserExist) {
      console.log(body, 'user exist');
    }

    if (body.authCode) {
      this.authService.login({
        email: body.email,
        authCode: body.authCode,
      });
    }
  }

  @Post('register')
  async registerUser(@Body() createUserDto) {
    const code = Math.floor(Math.random() * 1000000);
    console.log(createUserDto, 'register.....');

    return this.usersService.registerUser({
      ...createUserDto,
      verifiedCode: code.toString(),
    });
  }

  verifyToken(token: string) {
    this.authService.verifyToken(token);
  }
}
