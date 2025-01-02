import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Roles, RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';
import { CreateQuizClassDto } from './dto/create-quizClass.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.quizService.findAll();
  }

  // @Roles('admin')
  @Get('/class')
  findAllQuizClass() {
    console.log('findAllQuizClass');
    return this.quizService.findAllQuizClass();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Post('/class')
  // @UseGuards(AuthGuard('jwt'))
  createQuizClass(@Body() createQuizClassDto: CreateQuizClassDto) {
    return this.quizService.createQuizClass(createQuizClassDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    // console.log(id, '......', updateQuizDto);
    return this.quizService.update(id, updateQuizDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.quizService.remove(+id);
  }
}
