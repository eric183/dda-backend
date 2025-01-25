import { PowerClass, QuizType } from '@prisma/client';
import { IsArray, IsNumber } from 'class-validator';

import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsNotEmpty()
  options: {
    id: string;
    content: string;
    optionIndex: number;
  }[];

  @IsArray()
  @IsNotEmpty()
  optionAnswers: {
    id: string;
    content: string;
    optionAnswerIndex: number;
  }[];

  @IsString()
  @IsOptional()
  image: string;

  @IsNumber()
  questionIndex: number;

  @IsString()
  @IsOptional()
  typeClass: string;

  @IsString()
  @IsOptional()
  type: QuizType; // 单选题还是多选题

  @IsString()
  @IsOptional()
  powerClass: PowerClass;
}
