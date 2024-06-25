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
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, EncryptionService],
})
export class AppModule {}
