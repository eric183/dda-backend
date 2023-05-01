import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

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
  getselfAllDemands(@Param('userId') userId: string) {
    return this.demandsService.getSelfDemandsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  setDemandToUser(@Body() demandInfo) {
    return this.demandsService.createDemandByUser(demandInfo);
  }

  @UseGuards(JwtAuthGuard)
  @Get('count/:userId')
  getselfCount(@Param('userId', ParseIntPipe) userId: string) {
    return this.demandsService.getSelfDemandCountByUserId(userId);
  }
}
