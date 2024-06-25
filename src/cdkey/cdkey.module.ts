import { Module } from '@nestjs/common';
import { CdkeyService } from './cdkey.service';
import { CdkeyController } from './cdkey.controller';
import { EncryptionService } from 'src/encryption/encryption.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CdkeyController],
  providers: [CdkeyService, EncryptionService, PrismaService],
})
export class CdkeyModule {}
