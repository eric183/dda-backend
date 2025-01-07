import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponseUtil } from 'base/utils/api-response.util';
import { CreateQuizCategoryDto } from './dto/create-quizCategory.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuizCategoryDto } from './dto/update-quizCategory.dto';

@Injectable()
export class QuizService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createQuizDto: CreateQuizDto) {
    return 'This action adds a new quiz';
  }

  async createQuestion(id: string, createQuestionDto: CreateQuestionDto) {
    await this.prismaService.quiz.update({
      where: { id },
      data: {
        questions: {
          create: {
            content: createQuestionDto.content,
            image: createQuestionDto.image ? createQuestionDto.image : null,
            questionIndex: createQuestionDto.questionIndex,
            typeClass: createQuestionDto.typeClass,
            optionAnswers: {
              create: createQuestionDto.optionAnswers.map((option) => ({
                content: option.content,
                optionAnswerIndex: option.optionAnswerIndex,
              })),
            },
            options: {
              create: createQuestionDto.options.map((option) => ({
                content: option.content,
                optionIndex: option.optionIndex,
              })),
            },
            // questionIndex: createQuestionDto.questionIndex,
          },
        },
      },
    });

    try {
      return ApiResponseUtil.success(true, 'Question created successfully');
    } catch (error) {
      return ApiResponseUtil.error('Failed to create question');
    }

    // const question = await this.prismaService.question.create({
    //   data: {
    //     quizId: quiz.id,
    //     content: createQuestionDto.content,
    //     image: createQuestionDto.image,
    //     options: {
    //       create: createQuestionDto.options.map((option) => ({
    //         content: option.content,
    //         optionIndex: option.optionIndex,
    //       })),
    //     },
    //     optionAnswers: {
    //       create: createQuestionDto.optionAnswers.map((option) => ({
    //         content: option.content,
    //         optionAnswerIndex: option.optionAnswerIndex,
    //       })),
    //     },
    //   },
    // });
  }

  async createQuizCategory(createQuizCategoryDto: CreateQuizCategoryDto) {
    const d = await this.prismaService.quizCategory.create({
      data: createQuizCategoryDto,
    });

    try {
      return ApiResponseUtil.success(d, 'QuizCategory created successfully');
    } catch (error) {
      return ApiResponseUtil.error('Failed to create QuizCategory');
    }
  }

  async updateQuizCategory(id: string, updateQuizCategoryDto: UpdateQuizCategoryDto) {
    console.log('updateQuizCategoryDto....', updateQuizCategoryDto);
    const quizDataWithIds = updateQuizCategoryDto.quizzes.filter((quiz) => quiz.id);
    
    const quizDataWithoutIds = updateQuizCategoryDto.quizzes.filter((quiz) => !quiz.id).map((quiz) => {
      const { id, ...rest } = quiz;
      return rest;
    });



    await this.prismaService.$transaction(async (tx) => {
      // 更新所有含有 ID 的 quiz 信息，例如 name 等 { name: quiz.name }
      await Promise.all(
        quizDataWithIds.map(quiz => 
          tx.quiz.update({
            where: { id: quiz.id },
            data: { name: quiz.name }
          })
        )
      )
      
      // 创建所有不含 ID 的 quiz, 并关联到 category
      await tx.quiz.createMany({
        
        data: quizDataWithoutIds.map((quiz) => ({ ...quiz, categoryId: id })),
      });
    });

    return ApiResponseUtil.success(true, 'QuizCategory updated successfully');
   
  }

  async findAll() {
    try {
      const quiz = await this.prismaService.quiz.findMany({
        include: {
          category: true,
          // questions: true,
        },
        // select: {
        //   id: true,
        //   quiz: true,
        //   type: true,
        //   category: true,
        //   image: true,
        //   quizIndex: true,
        //   options: {
        //     select: {
        //       id: true,
        //       content: true,
        //     },
        //   },
        //   optionAnswers: {
        //     select: {
        //       id: true,
        //       content: true,
        //     },
        //   },
        // },
      });

      return ApiResponseUtil.success(quiz, 'Quiz list retrieved successfully');
    } catch (error) {
      return ApiResponseUtil.error('Failed to retrieve quiz list');
    }
  }

  async getOneQuestionById(id: string) {
    const question = await this.prismaService.question.findUnique({
      where: { id },
      include: {
        options: true,
        optionAnswers: true,
      },
    });
    try { 
      return ApiResponseUtil.success(question, 'Question retrieved successfully');
    } catch (error) {
      return ApiResponseUtil.error('Failed to retrieve question');
    }
  }

  async getAllQuestionsByQuizId(id: string) {
    try {

      // "questionIndex": 1,
      // "parentId": "12917b15-e20d-4f44-b123-c16db101727e",
      // "question": "天气晴朗的城市天空中飞过一只老鹰",
      // "type": "radio",
      // "optionAnswers": ["E", "K", "A", "P", "S"],
      // "options": [
      //   "哇，难得一见耶，快自拍合照一张",
      //   "为什么此时此刻会出现老鹰，我得查查原因",
      //   "想长出翅膀和它一起飞一会儿",
      //   "觉得它太孤单了，帮它画几朵云彩陪着它",
      //   "歪歪歪，我跟你说我看到老鹰了!"
      // ],
      const questions = await this.prismaService.question.findMany({
        where: {
          quizId: id,
        },
        include: {
          options: true,
          optionAnswers: true,
          quiz: true,
        },
      });
      // const quiz = await this.prismaService.quiz.findUnique({
      //   where: { id },
      //   include: {
      //     questions: true,
      //   },
      // });
      // console.log('quiz', quiz);
      return ApiResponseUtil.success(questions, 'Quiz list retrieved successfully');
    } catch (error) {
      return ApiResponseUtil.error('Failed to retrieve quiz list');
    }
  }

  async findAllQuizCategory() {
    try {
      const quiz = await this.prismaService.quizCategory.findMany({
        include: {
          quizzes: true,
        },
        // select: {
        //   id: true,
        //   quiz: true,
        //   type: true,
        //   category: true,
        //   image: true,
        //   quizIndex: true,
        //   options: {
        //     select: {
        //       id: true,
        //       content: true,
        //     },
        //   },
        //   optionAnswers: {
        //     select: {
        //       id: true,
        //       content: true,
        //     },
        //   },
        // },
      });

      return ApiResponseUtil.success(
        quiz,
        'QuizClass list retrieved successfully',
      );
    } catch (error) {
      return ApiResponseUtil.error('Failed to retrieve quiz list');
    }
  }

  async findManyByIds(ids: string[]) {
    try {
      const quiz = await this.prismaService.quiz.findMany({
        // where: {
        //   id: {
        //     in: ids,
        //   },
        // },
        // select: {
        //   id: true,
        //   quiz: true,
        //   type: true,
        //   category: true,
        //   image: true,
        //   quizIndex: true,
        //   options: {
        //     select: {
        //       id: true,
        //       content: true,
        //     },
        //   },
        //   optionAnswers: {
        //     select: {
        //       id: true,
        //       content: true,
        //     },
        //   },
        // },
      });

      return ApiResponseUtil.success(quiz, 'Quiz list retrieved successfully');
    } catch (error) {
      return ApiResponseUtil.error('Failed to retrieve quiz list');
    }
  }

  async findOne(id: string) {
    try {
      const selectedQuiz = await this.prismaService.quiz.findUnique({
        where: { id },
      });
      return ApiResponseUtil.success(
        selectedQuiz,
        'Quiz retrieved successfully',
      );
    } catch (error) {
      return ApiResponseUtil.error('Failed to retrieve quiz');
    }
  }

  async updateQuestion(id: string, updateQuestionDto: UpdateQuestionDto) {
    try {
      console.log('updateQuestionDto', updateQuestionDto.image);
      const changedBlocks = await this.prismaService.question.update({
        where: { id },
        data: {
          content: updateQuestionDto.content,
          image: updateQuestionDto.image,
          options: {
            update: updateQuestionDto.options.map((option, index) => ({
              where: { id: option.id }, // 需要知道每个 option 的 id
              data: { content: option.content },
            })),
          },
          optionAnswers: {
            update: updateQuestionDto.optionAnswers.map((option, index) => ({
              where: { id: option.id }, // 需要知道每个 option 的 id
              data: { content: option.content },
            })),
          },
        },
      });
      const question = await this.getOneQuestionById(changedBlocks.id);
      return ApiResponseUtil.success(question, 'Question updated successfully');
    } catch (error) {
      console.log(error, 'error: updateQuestion');
      return ApiResponseUtil.error('Failed to update question');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
