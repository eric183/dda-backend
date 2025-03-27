import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class UpdateQuizCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  image?: string;


  @IsArray()
  @IsOptional()
  quizzes?: { id?: string; name: string; categoryId: string }[];

  @IsString()
  @IsOptional()
  algorithmId?: string;

  @IsString()
  @IsOptional()
  quizResultId?: string;

  @IsString()
  @IsOptional()
  quizBeginnerId?: string;

  @IsString()
  @IsOptional()
  moreLink?: string;
}
