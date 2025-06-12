import { IsDateString, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduledDto {
  @IsIn(['dm', 'comment'])
  type: 'dm' | 'comment';

  @IsString()
  @IsNotEmpty()
  targetId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDateString()
  scheduledAt: string; // ISO (ej: "2025-06-12T20:00:00Z")
}
