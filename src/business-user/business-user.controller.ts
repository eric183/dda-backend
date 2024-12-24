import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BusinessUserService } from './business-user.service';
import { CreateBusinessUserDto } from './dto/create-business-user.dto';
import { UpdateBusinessUserDto } from './dto/update-business-user.dto';
import { Roles } from 'src/auth/decorators';

@Controller('business-user')
export class BusinessUserController {
  constructor(private readonly businessUserService: BusinessUserService) {}

  @Post()
  create(@Body() createBusinessUserDto: CreateBusinessUserDto) {
    return this.businessUserService.create(createBusinessUserDto);
  }

  // @Roles('admin')
  @Get()
  findAll() {
    return this.businessUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessUserService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusinessUserDto: UpdateBusinessUserDto,
  ) {
    return this.businessUserService.update(+id, updateBusinessUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessUserService.remove(+id);
  }
}
