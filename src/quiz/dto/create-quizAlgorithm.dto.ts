import { IsOptional } from "class-validator";

import { IsString } from "class-validator";

export class CreateQuizAlgorithmDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
