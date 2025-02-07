import { PartialType } from '@nestjs/swagger';
import { CreatePersonalDto } from './create-personal.dto';

export class UpdatePersonalDto extends PartialType(CreatePersonalDto) {
  id: string;
  personalCategory: string;
  personalAvatar: string;
  personalAnalyze: string;
  personalColor: string;
  personalPower: string;
  description: string;
}
