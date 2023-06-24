import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Request,
  Patch,
} from '@nestjs/common';
import { DemandStatus } from '@prisma/client';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DemandsService } from 'src/demands/demands.service';
// import { UsersService } from './users.service';

type UpdateDemandStatusDto = {
  status: DemandStatus;
};

@Controller('demand')
export class DemandsController {
  constructor(
    // private readonly usersService: UsersService,
    private readonly demandsService: DemandsService,
  ) {}

  @Get('cores')
  getCore() {
    return this.demandsService.getCore();
  }

  @Post('core')
  createCore() {
    return this.demandsService.createCore();
  }

  @Patch('/:id/core')
  updateCoreToken(@Param('id') id: string, @Body() coreInfo: any) {
    console.log(id, 'id');
    console.log(coreInfo, 'coreInfo');
    return this.demandsService.updateCore(id, {
      token: coreInfo.coreToken,
      prompt: coreInfo.corePrompt,
    });
  }

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
  getselfCount(@Param('userId') userId: string) {
    return this.demandsService.getSelfDemandCountByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id/status')
  updateDemandStatus(
    @Param('id') id: string,
    @Body() updateDemandStatus: UpdateDemandStatusDto,
  ) {
    return this.demandsService.updateDemandStatus(
      id,
      updateDemandStatus.status,
    );
  }
}
