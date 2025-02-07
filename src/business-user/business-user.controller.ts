import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BusinessUserService } from './business-user.service';
import { CreateBusinessUserDto } from './dto/create-business-user.dto';
import { UpdateBusinessUserDto } from './dto/update-business-user.dto';
import { QueryDto } from 'src/dto/query.dto';

@Controller('business-user')
export class BusinessUserController {
  constructor(private readonly businessUserService: BusinessUserService) {}

  @Get('wxapp/:businessUserId')
  wxapp(@Param('businessUserId') businessUserId: string) {
    return this.businessUserService.wxapp(businessUserId);
  }

  // @Roles('admin')
  @Get()
  findAll(@Query() query: QueryDto) {
    const {
      page = 1,
      pageSize = 100000,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
      filters = {},
    } = query;
    return this.businessUserService.findAll({
      page,
      pageSize,
      sortBy,
      sortOrder,
      search,
      filters,
    });
  }

  @Post()
  async create(@Body() createBusinessUserDto: CreateBusinessUserDto) {
    return this.businessUserService.create(createBusinessUserDto);
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
    return this.businessUserService.update(id, updateBusinessUserDto);
  }

  @Patch(':id/active')
  updateActive(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.businessUserService.updateActive(id, body.isActive);
  }

  @Patch(':id/quiz-qr-image')
  generateQuizQRImage(
    @Param('id') id: string,
    @Body() body: { image: string },
  ) {
    return this.businessUserService.generateQuizQRImage(id, body.image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessUserService.remove(id);
  }
}
