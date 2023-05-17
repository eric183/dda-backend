import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HashModule } from './hash/hash.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { DemandsService } from './demands/demands.service';
import { DemandsModule } from './demands/demands.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    HashModule,
    AuthModule,
    DemandsModule,
    ChatModule,
    // ChatModule,
  ],
  controllers: [AppController],
  // providers: [AppService],
  providers: [AppService, PrismaService, DemandsService],
})
export class AppModule {}
