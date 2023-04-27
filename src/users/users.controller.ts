import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('regester')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getIndex() {
    return 'reggg';
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('username')
  getUserByUsername(@Param() param) {
    return this.usersService.getUserByUsername(param.username);
  }

  @Post()
  registerUser(@Body() createUserDto) {
    return this.usersService.registerUser(createUserDto);
  }
}
