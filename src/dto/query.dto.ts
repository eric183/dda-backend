import { IsNumber, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // 添加这个
  @Transform(({ value }) => {
    console.log(value, 'value');
    return value || 1;
  })
  page: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) // 添加这个
  @Transform(({ value }) => value || 10)
  pageSize: number;

  @Transform(({ value }) => value || 'createdAt')
  @IsOptional()
  sortBy: string;

  @Transform(({ value }) => value || 'DESC')
  @IsOptional()
  sortOrder: string;

  @Transform(({ value }) => value || '')
  @IsOptional()
  search: string;

  @Transform(({ value }) => value || {})
  @IsOptional()
  filters: any;

  // constructor(partial: Partial<QueryDto>) {
  //   Object.assign(this, partial);
  // }
}
