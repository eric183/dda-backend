import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CdkeyService } from './cdkey.service';
import { CreateCdkeyDto } from './dto/create-cdkey.dto';
import { UpdateCdkeyDto } from './dto/update-cdkey.dto';
import { EncryptionService } from 'src/encryption/encryption.service';

const STR_LENGTH = 10;

@Controller('cdkey')
export class CdkeyController {
  constructor(private readonly cdkeyService: CdkeyService) {}

  @Get()
  findAll() {
    return this.cdkeyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cdkeyService.findOne(id);
  }

  @Get('/create/:slug')
  createOne(@Param('slug') slug: string) {
    return this.cdkeyService.create(slug, STR_LENGTH);
  }

  @Get('/createMany/:slug/:count')
  createMany(@Param('slug') slug: string, @Param('count') count: string) {
    console.log(slug, count);
    return this.cdkeyService.createMany(slug, +count, STR_LENGTH);
  }

  @Get('/read/:id')
  checkOne(@Param('id') id: string) {
    return this.cdkeyService.checkOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cdkeyService.remove(+id);
  }
}
