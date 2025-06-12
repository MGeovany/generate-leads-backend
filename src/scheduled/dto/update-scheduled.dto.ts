import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateScheduledDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
