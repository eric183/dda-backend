import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-quiz.dto';

export class UpdateQuizDto extends PartialType(CreateQuizDto) {
  id: string;
  quiz: string;
  options: {
    id: string;
    content: string;
  }[];
  optionAnswers: {
    id: string;
    content: string;
  }[];
  image: string;
}
