import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponseUtil } from 'base/utils/api-response.util';

@Injectable()
export class QuizService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createQuizDto: CreateQuizDto) {
    return 'This action adds a new quiz';
  }

  async findAll() {
    try {
      const quiz = await this.prismaService.quiz.findMany({
        select: {
          id: true,
          quiz: true,
          type: true,
          category: true,
          image: true,
          quizIndex: true,
          options: {
            select: {
              id: true,
              content: true,
            },
          },
          optionAnswers: {
            select: {
              id: true,
              content: true,
            },
          },
        },
      });

      return ApiResponseUtil.success(quiz, 'Quiz list retrieved successfully');
    } catch (error) {
      return ApiResponseUtil.error('Failed to retrieve quiz list');
    }
  }

  async findAllQuizClass() {
    try {
      const quiz = await this.prismaService.quizClass.findMany({
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
        where: {
          id: {
            in: ids,
          },
        },
        select: {
          id: true,
          quiz: true,
          type: true,
          category: true,
          image: true,
          quizIndex: true,
          options: {
            select: {
              id: true,
              content: true,
            },
          },
          optionAnswers: {
            select: {
              id: true,
              content: true,
            },
          },
        },
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
        select: {
          id: true,
          quiz: true,
          type: true,
          category: true,
          image: true,
          quizIndex: true,
          options: {
            select: {
              id: true,
              content: true,
            },
          },
          optionAnswers: {
            select: {
              id: true,
              content: true,
            },
          },
        },
      });
      return ApiResponseUtil.success(
        selectedQuiz,
        'Quiz retrieved successfully',
      );
    } catch (error) {
      return ApiResponseUtil.error('Failed to retrieve quiz');
    }
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    try {
      const changedBlocks = await this.prismaService.quiz.update({
        where: { id },
        data: {
          quiz: updateQuizDto.quiz,
          image: updateQuizDto.image,
          options: {
            update: updateQuizDto.options.map((option, index) => ({
              where: { id: option.id }, // 需要知道每个 option 的 id
              data: { content: option.content },
            })),
          },
          optionAnswers: {
            update: updateQuizDto.optionAnswers.map((option, index) => ({
              where: { id: option.id }, // 需要知道每个 option 的 id
              data: { content: option.content },
            })),
          },
        },
      });

      return await this.findOne(id);
    } catch (error) {
      return ApiResponseUtil.error('Failed to update quiz');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
