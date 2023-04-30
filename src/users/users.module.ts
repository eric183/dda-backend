import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from 'src/users/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { AuthService } from 'src/auth/auth.service';
// import { jwtConstants } from 'src/auth/constants';
// import { JwtStrategy } from 'src/auth/jwt.strategy';
// import { LocalStrategy } from 'src/auth/local.strategy';
import { HashService } from 'src/hash/hash.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DemandsService } from 'src/demands/demands.service';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   {
    //     name: User.name,
    //     schema: UserSchema,
    //   },
    // ]),
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: {
    //     expiresIn: '60d',
    //   },
    // }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    HashService,
    PrismaService,
    DemandsService,
    // AuthService,
    // JwtService,
    // JwtService
    // JwtStrategy,
    // LocalStrategy,
  ],
  exports: [UsersService],
})
export class UsersModule {}
