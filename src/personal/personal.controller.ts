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
import { QueryDto } from 'src/dto/query.dto';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { PersonalService } from './personal.service';

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  @Post()
  create(@Body() createPersonalDto: CreatePersonalDto) {
    console.log(createPersonalDto, 'createPersonalDto');
    return this.personalService.create(createPersonalDto);
  }

  @Get()
  findAll() {
    return this.personalService.findAll();
  }

  @Get('quiz-result/:id')
  findPersonalsByQuizResultId(
    @Param('id') id: string,
    @Query() query: QueryDto,
  ) {
    // console.log(query, "original query");
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
      filters = {},
    } = query;

    return this.personalService.findPersonalsByQuizResultId(id, {
      page,
      pageSize,
      sortBy,
      sortOrder,
      search,
      filters,
    });
  }

  @Get('bound/result')
  findAllBoundQuizResult(@Query() query: QueryDto) {
    const {
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    return this.personalService.findAllBoundQuizResult({
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personalService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonalDto: UpdatePersonalDto,
  ) {
    return this.personalService.update(id, updatePersonalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personalService.remove(+id);
  }
}
