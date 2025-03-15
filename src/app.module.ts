import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BusinessUserModule } from './business-user/business-user.module';
import { CdkeyModule } from './cdkey/cdkey.module';
import { EncryptionModule } from './encryption/encryption.module';
import { EncryptionService } from './encryption/encryption.service';
import { GlobalCacheModule } from './global-cache/global-cache.module';
import { HashModule } from './hash/hash.module';
import { PersonalModule } from './personal/personal.module';
import { PrismaService } from './prisma/prisma.service';
import { QuizModule } from './quiz/quiz.module';
import { UserModule } from './user/user.module';
import { WxModule } from './wx/wx.module';
import { CoachModule } from './coach/coach.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    HashModule,

    CdkeyModule,
    EncryptionModule,
    QuizModule,
    AuthModule,
    UserModule,
    BusinessUserModule,
    GlobalCacheModule,
    WxModule,
    PersonalModule,
    CoachModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, EncryptionService],
})
export class AppModule {}
