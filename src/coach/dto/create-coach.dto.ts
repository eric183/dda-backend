import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  Min,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApprovalStatus, CoachLevel } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateCoachDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsInt()
  @IsOptional()
  userId: number;

  @ApiProperty({ description: '微信unionId', example: '1234567890' })
  @IsString()
  @IsOptional()
  unionId: string;

  @ApiProperty({
    description: '个人简介',
    example: '专业滑雪教练，有5年教学经验',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  bio: string;

  @ApiProperty({ description: '姓名', example: '张三' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '手机号', example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({
    description: '专长领域（JSON数组）',
    example: '["高山滑雪", "单板滑雪", "越野滑雪"]',
  })
  @IsString()
  @IsNotEmpty()
  specialties: string;

  @ApiProperty({ description: '教学经验年限', example: 5 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  experienceYears: number;

  @ApiProperty({
    description: '证书（JSON数组）',
    example:
      '[{"name": "国际滑雪教练认证", "issuer": "国际滑雪联合会", "year": 2020}]',
    required: false,
  })
  @IsString()
  @IsOptional()
  certifications?: string;

  @ApiProperty({ description: '每小时收费', example: 300 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  hourlyRate: number;

  @ApiProperty({
    description: '可用时间（JSON结构）',
    example:
      '{"weekdays": ["Monday", "Wednesday", "Friday"], "hours": {"start": "09:00", "end": "17:00"}}',
    required: false,
  })
  @IsString()
  @IsOptional()
  availability?: string;

  @ApiProperty({ description: '是否在职', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: '教练等级',
    enum: CoachLevel,
    example: 'INTERMEDIATE',
  })
  @IsEnum(CoachLevel)
  @IsNotEmpty()
  coachLevel: CoachLevel;

  @ApiProperty({
    description: '会说的语言（JSON数组）',
    example: '["中文", "英语", "日语"]',
    required: false,
  })
  @IsString()
  @IsOptional()
  languagesSpoken?: string;

  @ApiProperty({
    description: '身份证明文档（JSON数组）',
    example: '[{"type": "身份证", "url": "https://example.com/id.jpg"}]',
    required: false,
  })
  @IsString()
  @IsOptional()
  identityDocuments?: string;

  @ApiProperty({
    description: '资格证明文档（JSON数组）',
    example: '[{"type": "教练证", "url": "https://example.com/cert.jpg"}]',
    required: false,
  })
  @IsString()
  @IsOptional()
  qualificationDocuments?: string;

  @ApiProperty({ description: '所属滑雪场ID', example: 1, required: false })
  @IsInt()
  @IsOptional()
  resortId?: number;
}
