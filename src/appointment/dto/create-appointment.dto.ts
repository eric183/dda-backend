import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    description: '教练ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  coachId: number;

  @ApiProperty({
    description: '用户ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: '课程ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  courseId: number;

  @ApiProperty({
    description: '预约日期 (YYYY-MM-DD)',
    example: '2023-05-15',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: '开始时间 (HH:MM)',
    example: '10:00',
  })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({
    description: '结束时间 (HH:MM)',
    example: '11:00',
  })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({
    description: '参与人数',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  participants?: number;

  @ApiProperty({
    description: '备注',
    example: '有特殊需求，请提前准备',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
