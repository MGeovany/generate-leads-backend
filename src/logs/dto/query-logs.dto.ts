import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryLogsDto {
  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(100)
  statusCode?: number;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
