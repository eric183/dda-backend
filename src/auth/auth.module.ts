import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { HashService } from 'src/hash/hash.service';
import { PrismaService } from 'src/prisma/prisma.service';
// import { JwtStrategy } from './jwt.strategy';

ConfigModule.forRoot();

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
      // signOptions: { expiresIn: '60s' },
    }),
    PassportModule,
  ],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    // JwtStrategy,
    HashService,
    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
