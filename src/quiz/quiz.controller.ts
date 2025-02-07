import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/guards/roles.guard';
import { QueryDto } from 'src/dto/query.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuizAlgorithmDto } from './dto/create-quizAlgorithm.dto';
import { CreateQuizCategoryDto } from './dto/create-quizCategory.dto';
import { CreateQuizResultDto } from './dto/create-quizResult.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateQuizCategoryDto } from './dto/update-quizCategory.dto';
import { QuizService } from './quiz.service';

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
  createQuestion(
    @Param('id') id: string,
    @Body() createQuestionDto: CreateQuestionDto | CreateQuestionDto[],
  ) {
    return this.quizService.createQuestion(id, createQuestionDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.quizService.findAll();
  }

  @Get('/algorithm')
  findAllQuizAlgorithm(@Query() query: QueryDto) {
    const {
      page = 1,
      pageSize = 100000,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
      filters = {},
    } = query;  
    return this.quizService.findAllQuizAlgorithm({
      page,
      pageSize,
      sortBy,
      sortOrder,
      search,
      filters,
    });
  }

  @Post('/algorithm')
  createQuizAlgorithm(@Body() createQuizAlgorithmDto: CreateQuizAlgorithmDto) {
    return this.quizService.createQuizAlgorithm(createQuizAlgorithmDto);
  }

  @Get('/questions')
  findAllQuestions(@Query() query: QueryDto) {
    const {
      page = 1,
      pageSize = 100000,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
      filters = {},
    } = query;
    return this.quizService.findAllQuestions({
      page,
      pageSize,
      sortBy,
      sortOrder,
      search,
      filters,
    });
  }

  // GET_ALL_QUESTIONS_BY_QUIZ_ID
  @Get(':id/questions')
  getAllQuestionsByQuizId(@Param('id') id: string, @Query() query: QueryDto) {
    const {
      page = 1,
      pageSize = 100000,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
      filters = {},
    } = query;
    return this.quizService.getAllQuestionsByQuizId(id, {
      page,
      pageSize,
      sortBy,
      sortOrder,
      search,
      filters,
    });
  }
  // @Roles('admin')
  @Get('/category')
  findAllQuizCategory(@Query() query: QueryDto) {
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
      filters = {},
    } = query;

    return this.quizService.findAllQuizCategory({
      page,
      pageSize,
      sortBy,
      sortOrder,
      search,
      filters,
    });
  }

  @Get('/result')
  getAllQuizResult() {
    console.log('getAllQuizResult');
    return this.quizService.getAllQuizResult();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Get('/result/:id')
  getOneQuizResult(@Param('id') id: string) {
    return this.quizService.getOneQuizResult(id);
  }

  @Post('/category')
  @UseGuards(AuthGuard('jwt'))
  createQuizCategory(@Body() createQuizCategoryDto: CreateQuizCategoryDto) {
    return this.quizService.createQuizCategory(createQuizCategoryDto);
  }

  @Delete('/category/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteQuizCategory(@Param('id') id: string) {
    return this.quizService.deleteQuizCategory(id);
  }

  @Patch('/category/:id')
  @UseGuards(AuthGuard('jwt'))
  updateQuizCategory(
    @Param('id') id: string,
    @Body() updateQuizCategoryDto: UpdateQuizCategoryDto,
  ) {
    return this.quizService.updateQuizCategory(id, updateQuizCategoryDto);
  }

  @Patch('/questions/:questionId')
  @UseGuards(AuthGuard('jwt'))
  updateQuestion(
    @Param('questionId') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    // console.log(id, '......', updateQuestionDto);
    return this.quizService.updateQuestion(questionId, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.quizService.remove(+id);
  }

  @Post('/result')
  createQuizResult(@Body() createQuizResultDto: CreateQuizResultDto) {
    return this.quizService.createQuizResult(createQuizResultDto);
  }

  @Patch('/result/:id')
  updateQuizResult(
    @Param('id') id: string,
    @Body()
    updateQuizResultDto: {
      name: string;
      description: string;
      headerImage: string;
    },
  ) {
    return this.quizService.updateQuizResult(id, updateQuizResultDto);
  }

  @Delete('/result/:id')
  deleteQuizResult(@Param('id') id: string) {
    return this.quizService.deleteQuizResult(id);
  }
}
