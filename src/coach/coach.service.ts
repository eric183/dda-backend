import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import {
  Coach,
  Prisma,
  ApprovalStatus,
  UserRole,
  CoachLevel,
} from '@prisma/client';
import { ApiResponseUtil } from 'base/utils/api-response.util';

@Injectable()
export class CoachService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCoachDto: CreateCoachDto) {
    try {
      console.log(createCoachDto, '......createCoachDto.....');
      // 检查用户是否存在
      // const userExists = await this.prisma.user.findUnique({
      //   where: { id: createCoachDto.userId },
      // });
      let user = { id: createCoachDto.userId };
      if (!createCoachDto.userId) {
        // 先检查是否已存在相同unionId的用户
        const existingUser = await this.prisma.user.findUnique({
          where: { unionId: createCoachDto.unionId },
        });

        if (existingUser) {
          user = existingUser;
          this.prisma.user.update({
            where: { id: existingUser.id },
            data: {
              mobile: createCoachDto.mobile,
              name: createCoachDto.name,
            },
          });
          console.log('找到已存在的用户，使用该用户');
        } else {
          user = await this.prisma.user.create({
            data: {
              unionId: createCoachDto.unionId,
              mobile: createCoachDto.mobile,
              name: createCoachDto.name,
            },
          });
          console.log('用户不存在，创建用户');
        }
        // throw new BadRequestException('User not found');
      }

      // 检查用户是否已经是教练
      const existingCoach = await this.prisma.coach.findUnique({
        where: { userId: user.id },
      });

      if (existingCoach) {
        throw new BadRequestException('User is already a coach');
      }

      // 检查 resortId 是否有效
      if (createCoachDto.resortId) {
        const resortExists = await this.prisma.skiResort.findUnique({
          where: { id: createCoachDto.resortId },
        });

        if (!resortExists) {
          throw new BadRequestException(
            'Resort not found with the provided ID',
          );
        }
      }

      // 创建教练
      const coach = await this.prisma.coach.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          resort: {
            connect: { id: createCoachDto.resortId },
          },
          bio: createCoachDto.bio,
          specialties: createCoachDto.specialties,
          experienceYears: createCoachDto.experienceYears,
          certifications: createCoachDto.certifications,
          hourlyRate: createCoachDto.hourlyRate,
          availability: createCoachDto.availability,
          isActive: createCoachDto.isActive ?? true,
          coachLevel: createCoachDto.coachLevel,
          languagesSpoken: createCoachDto.languagesSpoken,
          identityDocuments: createCoachDto.identityDocuments,
          qualificationDocuments: createCoachDto.qualificationDocuments,
          approvalStatus: ApprovalStatus.PENDING, // 默认待审核
        },
      });

      return ApiResponseUtil.success(
        {
          coach,
          user,
        },
        'Coach created successfully',
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        return ApiResponseUtil.error(error.message, 500);
      }
      console.error('Create coach error:', error);
      return ApiResponseUtil.error('Failed to create coach');
    }
  }

  async findAll() {
    try {
      const coaches = await this.prisma.coach.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              avatar: true,
              nickname: true,
              name: true,
              mobile: true,
            },
          },
          resort: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return ApiResponseUtil.success(coaches, 'Coaches retrieved successfully');
    } catch (error) {
      console.error('Find all coaches error:', error);
      return ApiResponseUtil.error('Failed to retrieve coaches');
    }
  }

  // 获取在职的以通过审核的教练列表
  async getCoachList() {
    const coaches = await this.prisma.coach.findMany({
      where: { approvalStatus: ApprovalStatus.APPROVED, isActive: true },
      include: {
        user: true,
        resort: true,
      },
    });
    return ApiResponseUtil.success(coaches, 'Coaches retrieved successfully');
  }

  async findOne(id: number) {
    try {
      const coach = await this.prisma.coach.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              avatar: true,
              nickname: true,
            },
          },
          resort: {
            select: {
              id: true,
              name: true,
            },
          },
          certificationRecords: true,
          schedules: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  avatar: true,
                  nickname: true,
                },
              },
            },
          },
        },
      });

      if (!coach) {
        return ApiResponseUtil.notFound('Coach not found');
      }

      return ApiResponseUtil.success(coach, 'Coach retrieved successfully');
    } catch (error) {
      console.error('Find coach error:', error);
      return ApiResponseUtil.error('Failed to retrieve coach');
    }
  }

  async update(id: number, updateCoachDto: UpdateCoachDto) {
    try {
      // 检查教练是否存在
      const existingCoach = await this.prisma.coach.findUnique({
        where: { id },
      });

      if (!existingCoach) {
        return ApiResponseUtil.notFound('Coach not found');
      }

      // 如果更新了审批状态为已批准，设置审批时间
      let approvedAt = undefined;
      if (
        updateCoachDto.approvalStatus === ApprovalStatus.APPROVED &&
        existingCoach.approvalStatus !== ApprovalStatus.APPROVED
      ) {
        approvedAt = new Date();
        // 设置用户角色
        await this.prisma.user.update({
          where: { id: existingCoach.userId },
          data: {
            roles: {
              set: [UserRole.COACH],
            },
          },
        });
      }

      // 更新教练信息
      const updatedCoach = await this.prisma.coach.update({
        where: { id },
        data: {
          ...updateCoachDto,
          approvedAt:
            updateCoachDto.approvalStatus === ApprovalStatus.APPROVED
              ? approvedAt
              : undefined,
        },
      });

      console.log(updatedCoach, '......updatedCoach.....');
      return updatedCoach;
    } catch (error) {
      console.error('Update coach error:', error);
      return ApiResponseUtil.error('Failed to update coach');
    }
  }

  async remove(id: number) {
    try {
      // 检查教练是否存在
      const existingCoach = await this.prisma.coach.findUnique({
        where: { id },
      });

      if (!existingCoach) {
        return ApiResponseUtil.notFound('Coach not found');
      }

      // 删除教练
      await this.prisma.coach.delete({
        where: { id },
      });

      return ApiResponseUtil.success(null, 'Coach deleted successfully');
    } catch (error) {
      console.error('Delete coach error:', error);
      return ApiResponseUtil.error('Failed to delete coach');
    }
  }

  // 查询审批中的教练
  async findPendingCoaches() {
    try {
      const pendingCoaches = await this.prisma.coach.findMany({
        where: {
          approvalStatus: ApprovalStatus.PENDING,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              avatar: true,
              nickname: true,
            },
          },
        },
      });
      return ApiResponseUtil.success(
        pendingCoaches,
        'Pending coaches retrieved successfully',
      );
    } catch (error) {
      console.error('Find pending coaches error:', error);
      return ApiResponseUtil.error('Failed to retrieve pending coaches');
    }
  }

  // 审批教练
  async approveCoach(id: number, approverId: number) {
    try {
      const coach = await this.prisma.coach.findUnique({
        where: { id },
      });

      if (!coach) {
        return ApiResponseUtil.notFound('Coach not found');
      }

      if (coach.approvalStatus !== ApprovalStatus.PENDING) {
        return ApiResponseUtil.error('Coach is not in pending status', 500);
      }

      const updatedCoach = await this.prisma.coach.update({
        where: { id },
        data: {
          approvalStatus: ApprovalStatus.APPROVED,
          approvedAt: new Date(),
          approvedBy: approverId,
        },
      });

      return ApiResponseUtil.success(
        updatedCoach,
        'Coach approved successfully',
      );
    } catch (error) {
      console.error('Approve coach error:', error);
      return ApiResponseUtil.error('Failed to approve coach');
    }
  }

  // 拒绝教练申请
  async rejectCoach(id: number, approverId: number, reason: string) {
    try {
      const coach = await this.prisma.coach.findUnique({
        where: { id },
      });

      if (!coach) {
        return ApiResponseUtil.notFound('Coach not found');
      }

      if (coach.approvalStatus !== ApprovalStatus.PENDING) {
        return ApiResponseUtil.error('Coach is not in pending status', 500);
      }

      const updatedCoach = await this.prisma.coach.update({
        where: { id },
        data: {
          approvalStatus: ApprovalStatus.REJECTED,
          approvedBy: approverId,
          rejectionReason: reason,
        },
      });

      return ApiResponseUtil.success(
        updatedCoach,
        'Coach application rejected',
      );
    } catch (error) {
      console.error('Reject coach error:', error);
      return ApiResponseUtil.error('Failed to reject coach application');
    }
  }

  // 根据用户ID查找教练
  async findByUserId(userId: number) {
    try {
      const coach = await this.prisma.coach.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              avatar: true,
              nickname: true,
            },
          },
          resort: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!coach) {
        return ApiResponseUtil.notFound('Coach not found');
      }

      return ApiResponseUtil.success(coach, 'Coach retrieved successfully');
    } catch (error) {
      console.error('Find coach by user ID error:', error);
      return ApiResponseUtil.error('Failed to retrieve coach');
    }
  }

  // 根据unionId查找教练
  async getCoachByUnionId(unionId: string) {
    console.log(unionId, '......unionId.....');
    const user = await this.prisma.user.findUnique({
      where: { unionId },
    });

    // if (!user) {
    //   user = await this.prisma.user.create({
    //     data: {
    //       unionId,
    //     },
    //   });
    //   // return ApiResponseUtil.notFound('User not found');
    // }

    // if (user.roles.includes(UserRole.COACH)) {
    const coach = await this.prisma.coach.findUnique({
      where: { userId: user.id },
    });

    return ApiResponseUtil.success(
      {
        user,
        coach,
      },
      'Coach retrieved successfully',
    );
    // }

    return ApiResponseUtil.success(user, 'User retrieved successfully');
  }

  // async apply(applyCoachDto: {
  //   unionId: string;
  //   bio: string;
  //   certifications: string;
  //   lessons: string[];
  //   experience: string;
  //   level: string;
  //   mobile: string;
  //   name: string;
  //   specialty: string;
  //   hourlyRate: number;
  // }) {
  //   let user = await this.prisma.user.findUnique({
  //     where: { unionId: applyCoachDto.unionId },
  //   });

  //   if (!user) {
  //     user = await this.prisma.user.create({
  //       data: {
  //         unionId: applyCoachDto.unionId,
  //         mobile: applyCoachDto.mobile,
  //         name: applyCoachDto.name,
  //       },
  //     });
  //   }

  //   const coach = await this.prisma.coach.create({
  //     data: {
  //       user: {
  //         connect: { id: user.id },
  //       },
  //       resort: {
  //         connect: { id: applyCoachDto.resortId },
  //       },
  //       bio: applyCoachDto.bio,
  //       certifications: applyCoachDto.certifications,
  //       experienceYears: parseInt(applyCoachDto.experience),
  //       coachLevel: applyCoachDto.level as CoachLevel,
  //       specialties: applyCoachDto.specialty,
  //       hourlyRate: 0,
  //       // specialty: applyCoachDto.specialty,
  //       // teachingStyle: applyCoachDto.teachingStyle,
  //     },
  //   });

  //   return ApiResponseUtil.success(applyCoachDto, 'Apply coach successfully');
  // }

  // async getCoachByUnionId(unionId: string) {
  //   const coach = await this.prisma.coach.findUnique({
  //     where: { unionId },
  //   });
  //   return ApiResponseUtil.success(coach, 'Coach retrieved successfully');
  // }
}
