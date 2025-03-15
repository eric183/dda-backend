import { PartialType } from '@nestjs/swagger';
import { CreateCoachDto } from './create-coach.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApprovalStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCoachDto extends PartialType(CreateCoachDto) {
  @ApiProperty({ 
    description: '审批状态', 
    enum: ApprovalStatus,
    example: 'APPROVED',
    required: false
  })
  @IsEnum(ApprovalStatus)
  @IsOptional()
  approvalStatus?: ApprovalStatus;
  
  @ApiProperty({ 
    description: '拒绝原因', 
    example: '证件不完整',
    required: false 
  })
  @IsOptional()
  rejectionReason?: string;
}
