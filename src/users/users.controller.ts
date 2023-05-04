import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DemandsService } from 'src/demands/demands.service';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly demandsService: DemandsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  getUserByUsername(@Param() param) {
    return this.usersService.getUserByMail(param.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('demand/create')
  setDemandToUser(@Body() demandInfo) {
    // console.log(demandInfo, '!!......!!');
    return this.demandsService.createDemandByUser(demandInfo);
  }

  @Post('register')
  registerUser(@Body() createUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  @Get('users')
  getAllUser() {
    console.log('users');
    return this.usersService.getALLUsers();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  getUserById(@Param('userId') userId: string) {
    return this.usersService.getUserbyId(userId);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('count/:user')
  // getselfCount(@Param() user) {
  //   return this.demandsService.getSelfDemandCountByUserId(user.userId);
  // }
}
