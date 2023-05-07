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
// import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: Omit<TUser, 'password'> }) {
    return req.user;
  }

  @Post('register')
  registerUser(@Body() createUserDto) {
    return this.usersService.registerUser(createUserDto);
  }
}
