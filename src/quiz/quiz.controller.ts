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
import { CreateQuizCategoryDto } from './dto/create-quizCategory.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuizCategoryDto } from './dto/update-quizCategory.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post(':id/questions')
  createQuestion(@Param('id') id: string, @Body() createQuestionDto: CreateQuestionDto) {
    return this.quizService.createQuestion(id, createQuestionDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.quizService.findAll();
  }

  // GET_ALL_QUESTIONS_BY_QUIZ_ID
  @Get(':id/questions')
  getAllQuestionsByQuizId(@Param('id') id: string) {
    console.log('getAllQuestionsByQuizId', id);
    return this.quizService.getAllQuestionsByQuizId(id);
  }
  // @Roles('admin')
  @Get('/category')
  findAllQuizCategory() {
    console.log('findAllQuizCategory');
    return this.quizService.findAllQuizCategory();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Post('/category')
  // @UseGuards(AuthGuard('jwt'))
  createQuizCategory(@Body() createQuizCategoryDto: CreateQuizCategoryDto) {
    return this.quizService.createQuizCategory(createQuizCategoryDto);
  }

  @Patch('/category/:id')
  updateQuizCategory(@Param('id') id: string, @Body() updateQuizCategoryDto: UpdateQuizCategoryDto) {
    return this.quizService.updateQuizCategory(id, updateQuizCategoryDto);
  }

  @Patch('/questions/:questionId')
  @UseGuards(AuthGuard('jwt'))
  updateQuestion(@Param('questionId') questionId: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    // console.log(id, '......', updateQuestionDto);
    return this.quizService.updateQuestion(questionId, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.quizService.remove(+id);
  }
}
