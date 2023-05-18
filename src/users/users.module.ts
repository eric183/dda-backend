import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from 'src/users/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { HashService } from 'src/hash/hash.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DemandsService } from 'src/demands/demands.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, HashService, PrismaService, DemandsService],
  exports: [UsersService],
})
export class UsersModule {}
