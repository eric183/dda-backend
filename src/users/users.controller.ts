import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('register')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getIndex() {
    return 'Pass!';
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mail')
  getUserByUsername(@Param() param) {
    return this.usersService.getUserByMail(param.mail);
  }

  @Post()
  registerUser(@Body() createUserDto) {
    return this.usersService.registerUser(createUserDto);
  }
}
