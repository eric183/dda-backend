import { Injectable } from '@nestjs/common';
import { Question, QuizAlgorithm, QuizCategory } from '@prisma/client';
import { ApiResponsePagination } from 'base/interfaces/api-response.interface';
import { ApiResponseUtil } from 'base/utils/api-response.util';
import { QueryDto } from 'src/dto/query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuizAlgorithmDto } from './dto/create-quizAlgorithm.dto';
import { CreateQuizCategoryDto } from './dto/create-quizCategory.dto';
import { CreateQuizResultDto } from './dto/create-quizResult.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateQuizCategoryDto } from './dto/update-quizCategory.dto';

@Injectable()
export class QuizService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createQuizDto: CreateQuizDto) {
    return 'This action adds a new quiz';
  }

  async createQuestion(
    id: string,
    createQuestionDto: CreateQuestionDto | CreateQuestionDto[],
  ) {
    // console.log('createQuestionDto.......', createQuestionDto);
    if (!Array.isArray(createQuestionDto)) {
      await this.prismaService.quiz.update({
        where: { id },
        data: {
          questions: {
            create: {
              content: createQuestionDto.content,
              image: createQuestionDto.image ? createQuestionDto.image : null,
              questionIndex: createQuestionDto.questionIndex,
              typeClass: createQuestionDto.typeClass,
              powerClass: createQuestionDto.powerClass,
              type:
                createQuestionDto.type === 'MULTIPLE' ? 'MULTIPLE' : 'RADIO',
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
    } else {
      await this.prismaService.quiz.update({
        where: { id },
        data: {
          questions: {
            create: createQuestionDto.map((question) => ({
              content: question.content,
              image: question.image,
              questionIndex: question.questionIndex,
              typeClass: question.typeClass,
              powerClass: question.powerClass,
              type: question.type === 'MULTIPLE' ? 'MULTIPLE' : 'RADIO',
              options: {
                create: question.options.map((option) => ({
                  content: option.content,
                  optionIndex: option.optionIndex,
                })),
              },
              optionAnswers: {
                create: question.optionAnswers.map((option) => ({
                  content: option.content,
                  optionAnswerIndex: option.optionAnswerIndex,
                })),
              },
            })),
          },
        },
      });

      return ApiResponseUtil.success(true, 'Questions created successfully');
    }
  }

  async createQuizCategory(createQuizCategoryDto: CreateQuizCategoryDto) {
    const d = await this.prismaService.quizCategory.create({
      data: {
        name: createQuizCategoryDto.name,
        // image: createQuizCategoryDto.image || '',
        algorithm: {
          connect: {
            id: createQuizCategoryDto.algorithmId,
          },
        },
      },
    });

    try {
      return ApiResponseUtil.success(d, 'QuizCategory created successfully');
    } catch (error) {
      return ApiResponseUtil.error('Failed to create QuizCategory');
    }
  }

  async updateQuizCategory(
    id: string,
    updateQuizCategoryDto: UpdateQuizCategoryDto,
  ) {
    const quizDataWithIds = updateQuizCategoryDto.quizzes.filter(
      (quiz) => quiz.id,
    );

    const quizDataWithoutIds = updateQuizCategoryDto.quizzes
      .filter((quiz) => !quiz.id)
      .map((quiz) => {
        const { id, ...rest } = quiz;
        return rest;
      });

    await this.prismaService.$transaction(async (tx) => {
      // 先获取当前 category 下的所有 quiz
      const currentQuizzes = await tx.quiz.findMany({
        where: { categoryId: id },
        select: { id: true },
      });

      console.log('currentQuizzes', currentQuizzes);
      // 找出需要删除的 quiz IDs（在当前列表中但不在新列表中的）
      const quizIdsToDelete = currentQuizzes
        .map((quiz) => quiz.id)
        .filter(
          (currentId) => !quizDataWithIds.some((quiz) => quiz.id === currentId),
        );
      console.log('quizIdsToDelete', quizIdsToDelete);
      // 删除不再需要的关联关系
      if (quizIdsToDelete.length > 0) {
        await tx.quiz.updateMany({
          where: { id: { in: quizIdsToDelete } },
          data: {
            categoryId: null,
          },
        });
        await tx.quiz.deleteMany({
          where: { id: { in: quizIdsToDelete } },
        });
      }

      // 更新 category 本身
      await tx.quizCategory.update({
        where: { id },
        data: {
          ...(updateQuizCategoryDto.name && {
            name: updateQuizCategoryDto.name,
          }),
          ...(updateQuizCategoryDto.algorithmId && {
            algorithm: {
              connect: { id: updateQuizCategoryDto.algorithmId },
            },
          }),
          ...(updateQuizCategoryDto.quizResultId && {
            quizResult: {
              connect: { id: updateQuizCategoryDto.quizResultId },
            },
          }),
        },
      });

      // 更新保留的 quizzes
      await Promise.all(
        quizDataWithIds.map((quiz) =>
          tx.quiz.update({
            where: { id: quiz.id },
            data: {
              name: quiz.name,
              categoryId: id, // 确保关联关系
            },
          }),
        ),
      );

      // 创建新的 quizzes
      if (quizDataWithoutIds.length > 0) {
        await tx.quiz.createMany({
          data: quizDataWithoutIds.map((quiz) => ({ ...quiz, categoryId: id })),
        });
      }
    });

    return ApiResponseUtil.success(true, 'QuizCategory updated successfully');
  }

  async deleteQuizCategory(id: string) {
    await this.prismaService.quizCategory.delete({
      where: { id },
    });
    return ApiResponseUtil.success(true, 'QuizCategory deleted successfully');
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

  async findAllQuizAlgorithm(query: QueryDto) {
    const { page, pageSize, sortBy, sortOrder, search, filters } = query;
    const quiz = await this.prismaService.quizAlgorithm.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      where: {
        name: {
          contains: search,
        },
      },
    });
    return ApiResponseUtil.success<ApiResponsePagination<QuizAlgorithm>>(
      {
        data: quiz,
        pagination: {
          total: quiz.length,
          page: page,
          pageSize: pageSize,
          totalPages: Math.ceil(quiz.length / pageSize),
        },
      },
      'QuizAlgorithm list retrieved successfully',
    );
  }

  async createQuizAlgorithm(createQuizAlgorithmDto: CreateQuizAlgorithmDto) {
    console.log('createQuizAlgorithmDto', createQuizAlgorithmDto);
    const algorithm = await this.prismaService.quizAlgorithm.create({
      data: createQuizAlgorithmDto,
    });
    console.log('algorithm', algorithm);
    return ApiResponseUtil.success(
      algorithm,
      'QuizAlgorithm created successfully',
    );
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
      return ApiResponseUtil.success(
        question,
        'Question retrieved successfully',
      );
    } catch (error) {
      return ApiResponseUtil.error('Failed to retrieve question');
    }
  }

  async findAllQuestions(query: QueryDto) {
    const { page, pageSize, sortBy, sortOrder, search, filters } = query;
    const questions = await this.prismaService.question.findMany({
      where: {
        content: {
          contains: search,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        content: true,
        quiz: true,
      },
    });

    try {
      return ApiResponseUtil.success<ApiResponsePagination<Partial<Question>>>(
        {
          data: questions,
          pagination: {
            total: questions.length,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(questions.length / pageSize),
          },
        },
        'Questions retrieved successfully',
      );
    } catch (error) {
      return ApiResponseUtil.error('Failed to retrieve questions');
    }
  }

  async getAllQuestionsByQuizId(id: string, query: QueryDto) {
    const { page, pageSize, sortBy, sortOrder, search, filters } = query;
    try {
      const questions = await this.prismaService.question.findMany({
        where: {
          quizId: id,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
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
      return ApiResponseUtil.success<ApiResponsePagination<Question>>(
        {
          data: questions,
          pagination: {
            total: questions.length,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(questions.length / pageSize),
          },
        },
        'Quiz list retrieved successfully',
      );
    } catch (error) {
      return ApiResponseUtil.error('Failed to retrieve quiz list');
    }
  }

  async findAllQuizCategory(query: QueryDto) {
    try {
      const { page, pageSize, sortBy, sortOrder, search, filters } = query;

      const [total, quiz] = await Promise.all([
        this.prismaService.quizCategory.count({
          where: {
            name: {
              contains: search,
            },
          },
        }),
        await this.prismaService.quizCategory.findMany({
          include: {
            quizzes: true,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: {
            [sortBy]: sortOrder,
          },
          where: {
            name: {
              contains: search,
            },
          },
        }),
      ]);

      return ApiResponseUtil.success<ApiResponsePagination<QuizCategory>>(
        {
          data: quiz,
          pagination: {
            total,
            page: query.page,
            pageSize: query.pageSize,
            totalPages: Math.ceil(total / query.pageSize),
          },
        },
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

      // 分离有 ID 和没有 ID 的选项，并确保 ID 不为空
      const optionsWithIds = updateQuestionDto.options.filter(
        (option) => option.id && option.id.trim() !== '',
      );
      const optionsWithoutIds = updateQuestionDto.options.filter(
        (option) => !option.id || option.id.trim() === '',
      );

      // 同样处理 optionAnswers
      const answersWithIds = updateQuestionDto.optionAnswers.filter(
        (answer) => answer.id && answer.id.trim() !== '',
      );
      const answersWithoutIds = updateQuestionDto.optionAnswers.filter(
        (answer) => !answer.id || answer.id.trim() === '',
      );

      const changedBlocks = await this.prismaService.question.update({
        where: { id },
        data: {
          content: updateQuestionDto.content,
          image: updateQuestionDto.image,
          type: updateQuestionDto.type === 'MULTIPLE' ? 'MULTIPLE' : 'RADIO',
          options: {
            ...(optionsWithIds.length > 0 && {
              update: optionsWithIds.map((option) => ({
                where: { id: option.id },
                data: {
                  content: option.content,
                  optionIndex: option.optionIndex,
                },
              })),
            }),
            ...(optionsWithoutIds.length > 0 && {
              create: optionsWithoutIds.map((option) => ({
                content: option.content,
                optionIndex: option.optionIndex,
              })),
            }),
          },
          optionAnswers: {
            ...(answersWithIds.length > 0 && {
              update: answersWithIds.map((answer) => ({
                where: { id: answer.id },
                data: {
                  content: answer.content,
                  optionAnswerIndex: answer.optionAnswerIndex,
                },
              })),
            }),
            ...(answersWithoutIds.length > 0 && {
              create: answersWithoutIds.map((answer) => ({
                content: answer.content,
                optionAnswerIndex: answer.optionAnswerIndex,
              })),
            }),
          },
          powerClass: updateQuestionDto.powerClass,
        },
      });
      const question = await this.getOneQuestionById(changedBlocks.id);
      return question;
    } catch (error) {
      console.log(error, 'error: updateQuestion');
      return ApiResponseUtil.error('Failed to update question');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }

  async getAllQuizResult() {
    const result = await this.prismaService.quizResult.findMany({});
    return ApiResponseUtil.success(
      result,
      'QuizResult list retrieved successfully',
    );
  }

  async getOneQuizResult(id: string) {
    const result = await this.prismaService.quizResult.findUnique({
      where: { id },
    });
    return ApiResponseUtil.success(result, 'QuizResult retrieved successfully');
  }

  async createQuizResult(createQuizResultDto: CreateQuizResultDto) {
    const result = await this.prismaService.quizResult.create({
      data: createQuizResultDto,
    });
    return ApiResponseUtil.success(result, 'QuizResult created successfully');
  }

  async updateQuizResult(
    id: string,
    updateQuizResultDto: {
      name: string;
      description: string;
      headerImage: string;
    },
  ) {
    const result = await this.prismaService.quizResult.update({
      where: { id },
      data: updateQuizResultDto,
    });
    return ApiResponseUtil.success(result, 'QuizResult updated successfully');
  }

  async deleteQuizResult(id: string) {
    const result = await this.prismaService.quizResult.delete({
      where: { id },
    });
    return ApiResponseUtil.success(result, 'QuizResult deleted successfully');
  }
}
