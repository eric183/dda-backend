import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-quiz.dto';
import { PowerClass } from '@prisma/client';

export class UpdateQuestionDto extends PartialType(CreateQuizDto) {
  id: string;
  content: string;
  options: {
    id: string;
    content: string;
    optionIndex?: number;
  }[];
  optionAnswers: {
    id: string;
    content: string;
    optionAnswerIndex?: number;
  }[];
  image: string;
  type: string;
  powerClass: PowerClass;
}
