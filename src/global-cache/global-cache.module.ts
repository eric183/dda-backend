import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalCacheController } from './global-cache.controller';
import { GlobalCacheService } from './global-cache.service';

@Module({
  imports: [ConfigModule],
  controllers: [GlobalCacheController],
  providers: [GlobalCacheService],
})
export class GlobalCacheModule {}
