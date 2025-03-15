import { ApprovalStatus, CoachLevel } from '@prisma/client';

export class Coach {
  id: number;
  userId: number;
  bio: string;
  specialties: string; // JSON数组
  experienceYears: number;
  certifications?: string; // JSON数组
  hourlyRate: number;
  availability?: string; // JSON结构
  isActive: boolean;
  coachLevel: CoachLevel;
  languagesSpoken?: string; // JSON数组
  rating: number;
  
  // 审批状态相关
  approvalStatus: ApprovalStatus;
  approvedAt?: Date;
  approvedBy?: number;
  rejectionReason?: string;
  
  // 身份验证和资质文档
  identityDocuments?: string; // JSON数组
  qualificationDocuments?: string; // JSON数组
  
  // 教练门店信息
  resortId?: number;
  
  // 时间戳
  createdAt: Date;
  updatedAt: Date;
}
