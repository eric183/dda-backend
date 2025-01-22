import { IsNotEmpty } from "class-validator";

import { IsString } from "class-validator";

export class CreateQuizResultDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  headerImage: string;
}
