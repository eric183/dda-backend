import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Put,
  Patch,
  UnauthorizedException,
  Query,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DemandsService } from 'src/demands/demands.service';
import { UsersService } from './users.service';
type UpdateUsernameDto = {
  username: string;
};

type UpdateUserpasswordDto = {
  password: string;
  email: string;
};
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly demandsService: DemandsService,
  ) {}

  @Get('test')
  getTest(@Param() param) {
    return this.usersService.getALLUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('email')
  getUserByEmail(@Param() param) {
    return this.usersService.getUserByMail(param.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('single/:userId')
  getUserById(@Param('userId') userId: string) {
    console.log(userId, '...');
    return this.usersService.getUserbyId(userId);
  }

  @Post('password')
  async resetPWD(
    @Param('email') email: string,
    @Body() updateUserpasswordDto: UpdateUserpasswordDto,
  ) {
    console.log('shdaf');
    const user = await this.usersService.getUserByMail(
      updateUserpasswordDto.email,
    );

    if (!user) {
      // throw new UnauthorizedException('User does not exist');

      throw new UnauthorizedException('User does not exist');
    }

    return this.usersService.resetPWD(user.id, updateUserpasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':userId/usename')
  updateUsername(
    @Param('userId') userId: number,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ) {
    return this.usersService.updateUserName(userId, updateUsernameDto);
  }
  // @UseGuards(JwtAuthGuard)
  // @Get('count/:user')
  // getselfCount(@Param() user) {
  //   return this.demandsService.getSelfDemandCountByUserId(user.userId);
  // }
}
