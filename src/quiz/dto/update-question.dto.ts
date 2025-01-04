import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-quiz.dto';

export class UpdateQuestionDto extends PartialType(CreateQuizDto) {
  id: string;
  content: string;
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
