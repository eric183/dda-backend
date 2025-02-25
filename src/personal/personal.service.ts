import { Injectable } from '@nestjs/common';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponseUtil } from 'base/utils/api-response.util';
import { QueryDto } from 'src/dto/query.dto';
import { ApiResponsePagination } from 'base/interfaces/api-response.interface';
import { Personal, QuizResult } from '@prisma/client';

@Injectable()
export class PersonalService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPersonalDto: CreatePersonalDto) {
    const personal = await this.prisma.personal.create({
      data: {
        describePhoto: createPersonalDto.describePhoto,
        personalCategory: createPersonalDto.personalCategory,
        personalAvatar: createPersonalDto.personalAvatar,
        personalAnalyze: createPersonalDto.personalAnalyze,
        personalColor: createPersonalDto.personalColor,
        personalPower: createPersonalDto.personalPower,
        description: createPersonalDto.description,
        quizResult: {
          connect: {
            id: createPersonalDto.quizResultId,
          },
        },
      },
    });
    try {
      return ApiResponseUtil.success(personal, 'Personal created successfully');
    } catch (error) {
      return ApiResponseUtil.error('Failed to create personal');
    }
  }

  async findPersonalsByQuizResultId(quizResultId: string, query) {
    const [total, personals] = await Promise.all([
      this.prisma.personal.count({ where: { quizResultId: quizResultId } }),
      this.prisma.personal.findMany({
        where: {
          quizResultId: quizResultId,
        },
        take: query.pageSize,
        skip: (query.page - 1) * query.pageSize,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
      }),
    ]);

    try {
      return ApiResponseUtil.success<ApiResponsePagination<Personal>>(
        {
          data: personals,
          pagination: {
            total,
            page: query.page,
            pageSize: query.pageSize,
            totalPages: Math.ceil(total / query.pageSize),
          },
        },
        'Personals fetched successfully',
      );
    } catch (error) {
      return ApiResponseUtil.error('Failed to fetch personals');
    }
  }

  findAll() {
    return this.prisma.personal.findMany();
  }

  async findAllBoundQuizResult(query: Partial<QueryDto>) {
    const {
      sortBy,
      sortOrder,
    } = query;


    const results = await this.prisma.quizResult.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        name: true,
      },
    });
    try {
      return ApiResponseUtil.success<ApiResponsePagination<Partial<QuizResult>>>(
        {
          data: results,
          pagination: {
            total: results.length,
            page: 1,
            pageSize: results.length,
            totalPages: 1,
          },
        },
        'Quiz results fetched successfully',
      );
    } catch (error) {
      return ApiResponseUtil.error('Failed to fetch quiz results');
    }
    // where: {
    //   personal: {
    //     isNot: null,
    //   },
    // },
  }

  findOne(id: number) {
    return `This action returns a #${id} personal`;
  }

  async update(id: string, updatePersonalDto: UpdatePersonalDto) {
    const personal = await this.prisma.personal.update({
      where: { id },
      data: updatePersonalDto,
    });
    try {
      return ApiResponseUtil.success(personal, 'Personal updated successfully');
    } catch (error) {
      return ApiResponseUtil.error('Failed to update personal');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} personal`;
  }
}
