import { Injectable } from '@nestjs/common';
import { CreateBusinessUserDto } from './dto/create-business-user.dto';
import { UpdateBusinessUserDto } from './dto/update-business-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponseUtil } from 'base/utils/api-response.util';
import { Prisma } from '@prisma/client';
import { QueryDto } from 'src/dto/query.dto';

@Injectable()
export class BusinessUserService {
  constructor(private readonly prismaService: PrismaService) {}

  wxapp(businessUserId: string) {
    return this.prismaService.businessUser.findUnique({
      where: { id: businessUserId },
      select: {
        id: true,
        name: true,
        image: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        quizQRImage: true,
        selectedQuiz: {
          select: {
            id: true,
            name: true,
            category: {
              select: {
                id: true,
                name: true,
                quizResult: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    headerImage: true,
                    personal: true,
                  },
                },
              },
            },
            questions: {
              select: {
                id: true,
                content: true,
                image: true,
                type: true,
                typeClass: true,
                questionIndex: true,
                powerClass: true,
                options: {
                  select: {
                    id: true,
                    content: true,
                    optionIndex: true,
                  },
                },
                optionAnswers: {
                  select: {
                    id: true,
                    content: true,
                    optionAnswerIndex: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
  // constructor(prismaClient: PrismaService) {}
  async create(createBusinessUserDto: CreateBusinessUserDto) {
    const d = await this.prismaService.businessUser.create({
      data: {
        name: createBusinessUserDto.name,
        image: createBusinessUserDto.image,
        isActive: true,
      },
    });
    console.log(d, '....');
    try {
      return ApiResponseUtil.success(d, 'user created successfully');
    } catch (e) {
      return ApiResponseUtil.error('Failed to create user');
    }
  }

  async findAll(params: QueryDto) {
    const { page, pageSize, sortBy, sortOrder, search, filters } = params;
    const businessUsers = await this.prismaService.businessUser.findMany({
      // skip: page,
      // take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      where: filters,
      select: {
        id: true,
        name: true,
        image: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        quizQRImage: true,
        selectedQuizId: true,
      },
    });
    try {
      return ApiResponseUtil.success(
        businessUsers,
        'users list retrieved successfully',
      );
    } catch (e) {
      return ApiResponseUtil.error('Failed to retrieve quiz list');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} businessUser`;
  }

  update(id: string, updateBusinessUserDto: UpdateBusinessUserDto) {
    return this.prismaService.businessUser.update({
      where: { id },
      data: updateBusinessUserDto,
    });
  }
  generateQuizQRImage(id: string, image: string) {
    return this.prismaService.businessUser.update({
      where: { id },
      data: { quizQRImage: image },
    });
  }
  updateActive(id: string, isActive: boolean) {
    return this.prismaService.businessUser.update({
      where: { id },
      data: { isActive },
    });
  }
  remove(id: string) {
    return this.prismaService.businessUser.delete({
      where: { id },
    });
  }
}
