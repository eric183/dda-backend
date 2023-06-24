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
import { omit } from 'lodash';

// import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  getCode() {
    return Math.floor(Math.random() * 1000000).toString();
  }

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
  async sendMailVerification(@Body() { to, context }) {
    // this.userVerificationMap.set(body.email, code);

    return this.mailService.sendMail({
      to,
      subject: 'Email Verification',
      context: {
        ...context,
        authUrl: process.env.MAIL_AUTH_URL,
        code: context.code,
      },
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
    const isUserExsit = await this.usersService.checkUserExist(body.email);

    const code = isUserExsit ? '' : this.getCode();
    const currentUserInfo = await this.usersService.updateOrCreate0AuthUser({
      ...body,
      verifiedCode: code,
      credentialType: 'GOOGLE',
    });

    if (!isUserExsit) {
      console.log('用户不存在，创建新用户');

      this.sendMailVerification({
        to: body.email,
        context: {
          ...body,
          code: currentUserInfo.verifiedCode,
        },
      });
    }

    const tokenInfo = await this.authService.login({
      email: body.email,
      authToken: body.authToken,
      authExpiresAt: body.authExpiresAt,
    });
    return {
      ...omit(currentUserInfo, 'password'),
      ...tokenInfo,
    };
  }

  @Post('register')
  async registerUser(@Body() createUserDto) {
    const code = this.getCode();

    await this.sendMailVerification({
      to: createUserDto.email,
      context: {
        email: createUserDto.email,
        username: createUserDto.username,
        authUrl: process.env.MAIL_AUTH_URL,
        code,
      },
    });

    return this.usersService.registerUser({
      ...createUserDto,
      verifiedCode: code,
    });
  }

  verifyToken(token: string) {
    this.authService.verifyToken(token);
  }
}
