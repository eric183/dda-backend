import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HashModule } from './hash/hash.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ChatModule } from './chat/chat.module';
import { MailModule } from './mail/mail.module';
import { CdkeyModule } from './cdkey/cdkey.module';
import { EncryptionService } from './encryption/encryption.service';
import { EncryptionModule } from './encryption/encryption.module';
import { QuizModule } from './quiz/quiz.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BusinessUserModule } from './business-user/business-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HashModule,
    ChatModule,
    MailModule,
    CdkeyModule,
    EncryptionModule,
    QuizModule,
    AuthModule,
    UserModule,
    BusinessUserModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, EncryptionService],
})
export class AppModule {}
