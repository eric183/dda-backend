import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DemandsService } from 'src/demands/demands.service';
// import { UsersService } from './users.service';

@Controller('demand')
export class DemandsController {
  constructor(
    // private readonly usersService: UsersService,
    private readonly demandsService: DemandsService,
  ) {}

  @Get('all')
  getAllDemands() {
    return this.demandsService.getAllDemands();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  getselfAllDemands(@Param() params) {
    return this.demandsService.getSelfDemandsByUserId(params.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  setDemandToUser(@Body() demandInfo) {
    // console.log(demandInfo, '!!......!!');
    return this.demandsService.createDemandByUser(demandInfo);
  }

  @UseGuards(JwtAuthGuard)
  @Get('count/:user')
  getselfCount(@Param() user) {
    return this.demandsService.getSelfDemandCountByUserId(user.userId);
  }
}
