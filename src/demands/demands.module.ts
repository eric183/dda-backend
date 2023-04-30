import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DemandsService } from './demands.service';

@Module({
  providers: [DemandsService, PrismaService],
  exports: [DemandsService],
})
export class DemandsModule {}
