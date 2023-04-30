import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DemandsService } from './demands.service';
import { DemandsController } from './demands.controller';

@Module({
  providers: [DemandsService, PrismaService],
  exports: [DemandsService],
  controllers: [DemandsController],
})
export class DemandsModule {}
