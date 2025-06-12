import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class TestWebhookDto {
  @IsString()
  userId: string;

  @IsIn(['dm', 'comment', 'reaction'])
  type: 'dm' | 'comment' | 'reaction';

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsBoolean()
  forceAi?: boolean;
}
