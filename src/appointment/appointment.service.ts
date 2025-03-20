import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  AppointmentStatus,
  Prisma,
  ScheduleStatus,
  CoachLevel,
} from '@prisma/client';
import { ApiResponseUtil } from 'base/utils/api-response.util';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { coachId, userId, date, startTime, endTime, notes } =
      createAppointmentDto;

    try {
      // 1. 检查教练是否存在且已获批准
      const coach = await this.prisma.coach.findUnique({
        where: { id: coachId },
        include: {
          user: true,
          resort: true,
        },
      });

      if (!coach) {
        throw new NotFoundException('Coach not found');
      }

      if (coach.approvalStatus !== 'APPROVED') {
        throw new BadRequestException('Coach is not available for booking');
      }

      // 2. 检查用户是否存在
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // 4. 解析开始和结束时间
      const appointmentDate = new Date(date);
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      // 验证时间格式
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new BadRequestException('Invalid date or time format');
      }

      // 验证时间逻辑
      if (startDateTime >= endDateTime) {
        throw new BadRequestException('End time must be after start time');
      }

      // 计算预约时长(小时)
      const durationHours =
        (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

      // 5. 检查教练在该时间段是否可用
      const overlappingSchedule = await this.prisma.coachSchedule.findFirst({
        where: {
          coach: {
            id: coachId,
          },
          date: {
            equals: new Date(appointmentDate.setHours(0, 0, 0, 0)),
          },
          startTime: { lte: endDateTime },
          endTime: { gte: startDateTime },
          // status已修正为合适的枚举值
          status: ScheduleStatus.ACTIVE,
        },
      });

      if (overlappingSchedule) {
        throw new BadRequestException(
          'Coach is not available during the requested time',
        );
      }

      // 6. 创建教练日程
      const coachSchedule = await this.prisma.coachSchedule.create({
        data: {
          coach: {
            connect: { id: coachId },
          },
          date: new Date(appointmentDate.setHours(0, 0, 0, 0)),
          startTime: startDateTime,
          endTime: endDateTime,
          // 修正为正确的枚举值
          status: ScheduleStatus.ACTIVE,
          scheduleType: 'REGULAR', // 修正字段名为scheduleType
          isAvailable: false, // 预约后设为不可用
          notes: notes || `Appointment for ${user.name || 'user #' + userId}`,
        },
      });

      // 7. 创建预约 - 正确连接关系
      const appointment = await this.prisma.appointment.create({
        data: {
          user: {
            connect: { id: userId },
          },
          schedule: {
            connect: { id: coachSchedule.id },
          },
          appointmentDate: new Date(date), // 添加appointmentDate字段
          status: AppointmentStatus.PENDING,
          startTime: startDateTime,
          endTime: endTime,
          notes: notes || '',
        },
        include: {
          user: true,
          schedule: {
            include: {
              coach: true,
            },
          },
        },
      });

      return ApiResponseUtil.success(
        appointment,
        'Appointment created successfully',
      );
    } catch (error) {
      console.error('Creating appointment error:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Unique constraint violation
          throw new BadRequestException('Schedule already booked');
        }
      }
      throw error;
    }
  }

  async findAll(userId?: number, coachId?: number, status?: AppointmentStatus) {
    try {
      // 构建查询条件
      const whereClause: Prisma.AppointmentWhereInput = {};

      if (userId) {
        whereClause.userId = userId;
      }

      if (status) {
        whereClause.status = status;
      }

      // 如果提供了教练ID，通过日程表关联查询
      if (coachId) {
        whereClause.schedule = {
          coach: {
            id: coachId,
          },
        };
      }

      const appointments = await this.prisma.appointment.findMany({
        where: whereClause,
        include: {
          user: true,
          schedule: {
            include: {
              coach: true,
            },
          },
        },
        orderBy: {
          startTime: 'asc',
        },
      });

      return ApiResponseUtil.success(
        appointments,
        'Appointments retrieved successfully',
      );
    } catch (error) {
      console.error('Finding appointments error:', error);
      throw new BadRequestException('Failed to retrieve appointments');
    }
  }

  async findOne(id: number) {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id },
        include: {
          user: true,
          schedule: {
            include: {
              coach: true,
            },
          },
        },
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      return ApiResponseUtil.success(
        appointment,
        'Appointment retrieved successfully',
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Finding appointment error:', error);
      throw new BadRequestException('Failed to retrieve appointment');
    }
  }

  async confirm(id: number) {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (appointment.status !== AppointmentStatus.PENDING) {
        throw new BadRequestException(
          'Only pending appointments can be confirmed',
        );
      }

      const updatedAppointment = await this.prisma.appointment.update({
        where: { id },
        data: {
          status: AppointmentStatus.CONFIRMED,
        },
        include: {
          user: true,
          schedule: {
            include: {
              coach: true,
            },
          },
        },
      });

      return ApiResponseUtil.success(
        updatedAppointment,
        'Appointment confirmed successfully',
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Confirming appointment error:', error);
      throw new BadRequestException('Failed to confirm appointment');
    }
  }

  async cancel(id: number, cancellationReason?: string) {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id },
        include: {
          schedule: true,
        },
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (appointment.status === AppointmentStatus.COMPLETED) {
        throw new BadRequestException(
          'Completed appointments cannot be cancelled',
        );
      }

      const updatedAppointment = await this.prisma.appointment.update({
        where: { id },
        data: {
          status: AppointmentStatus.CANCELLED,
          cancellationReason: cancellationReason || 'Cancelled by user',
        },
        include: {
          user: true,
          schedule: {
            include: {
              coach: true,
            },
          },
        },
      });

      // 释放教练日程
      if (appointment.schedule) {
        await this.prisma.coachSchedule.update({
          where: { id: appointment.schedule.id },
          data: {
            status: ScheduleStatus.CANCELLED,
            isAvailable: true, // 设置为可用
          },
        });
      }

      return ApiResponseUtil.success(
        updatedAppointment,
        'Appointment cancelled successfully',
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Cancelling appointment error:', error);
      throw new BadRequestException('Failed to cancel appointment');
    }
  }

  async complete(id: number) {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (appointment.status !== AppointmentStatus.CONFIRMED) {
        throw new BadRequestException(
          'Only confirmed appointments can be completed',
        );
      }

      const updatedAppointment = await this.prisma.appointment.update({
        where: { id },
        data: {
          status: AppointmentStatus.COMPLETED,
        },
        include: {
          user: true,
          schedule: {
            include: {
              coach: true,
            },
          },
        },
      });

      return ApiResponseUtil.success(
        updatedAppointment,
        'Appointment completed successfully',
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Completing appointment error:', error);
      throw new BadRequestException('Failed to complete appointment');
    }
  }
}
