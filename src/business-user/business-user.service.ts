import { Injectable } from '@nestjs/common';
import { CreateBusinessUserDto } from './dto/create-business-user.dto';
import { UpdateBusinessUserDto } from './dto/update-business-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponseUtil } from 'base/utils/api-response.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class BusinessUserService {
  constructor(private readonly prismaService: PrismaService) {}

  // constructor(prismaClient: PrismaService) {}
  create(createBusinessUserDto: CreateBusinessUserDto) {
    return 'This action adds a new businessUser';
  }

  // async findAll(params?: {
  //   skip?: number;
  //   take?: number;
  //   orderBy?: Prisma.BusinessUserOrderByWithRelationInput;
  //   where?: Prisma.BusinessUserWhereInput;
  // }) {
  //   try {
  //     const [businessUsers, total] = await Promise.all([
  //       this.prismaService.businessUser.findMany({
  //         skip: params?.skip || 0,
  //         take: params?.take || 10,
  //         orderBy: params?.orderBy || { createdAt: 'desc' },
  //         where: params?.where || {},
  //         select: {
  //           id: true,
  //           name: true,
  //           image: true,
  //           isActive: true,
  //           createdAt: true,
  //           updatedAt: true
  //         }
  //       }),
  //       this.prismaService.businessUser.count({
  //         where: params?.where
  //       })
  //     ]);

  //     return ApiResponseUtil.success(
  //       {
  //         items: businessUsers,
  //         total,
  //         page: params?.skip ? Math.floor(params.skip / (params.take || 10)) + 1 : 1,
  //         pageSize: params?.take || 10
  //       },
  //       'Business users retrieved successfully'
  //     );
  //   } catch (error) {
  //     return ApiResponseUtil.error(
  //       `Failed to retrieve business users: ${error.message}`
  //     );
  //   }
  // }

  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.BusinessUserOrderByWithRelationInput;
    where?: Prisma.BusinessUserWhereInput;
  }) {
    const businessUsers = await this.prismaService.businessUser.findMany({
      skip: params?.skip || 0,
      take: params?.take || 10,
      orderBy: params?.orderBy || { createdAt: 'desc' },
      where: params?.where || {},
      select: {
        id: true,
        name: true,
        image: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
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

  update(id: number, updateBusinessUserDto: UpdateBusinessUserDto) {
    return `This action updates a #${id} businessUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} businessUser`;
  }
}
