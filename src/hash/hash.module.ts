import { Module } from '@nestjs/common';
import { HashService } from './hash.service';

@Module({
  providers: [HashService],
  exports: [HashService],
  controllers: [],
})
export class HashModule {}
