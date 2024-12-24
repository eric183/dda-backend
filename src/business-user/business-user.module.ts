import { Module } from '@nestjs/common';
import { BusinessUserService } from './business-user.service';
import { BusinessUserController } from './business-user.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BusinessUserController],
  providers: [BusinessUserService, PrismaService],
})
export class BusinessUserModule {}
