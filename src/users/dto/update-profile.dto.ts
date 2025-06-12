import { IsOptional, IsIn, IsString } from 'class-validator';
import {
  AI_TONES,
  ACCOUNT_TYPES,
  AUDIENCE_STYLES,
} from '../../constants/profile-options';

export class UpdateProfileDto {
  @IsOptional()
  @IsIn(AI_TONES)
  aiTone?: (typeof AI_TONES)[number];

  @IsOptional()
  @IsIn(ACCOUNT_TYPES)
  accountType?: (typeof ACCOUNT_TYPES)[number];

  @IsOptional()
  @IsString()
  customAccountType?: string;

  @IsOptional()
  @IsIn(AUDIENCE_STYLES)
  audienceStyle?: (typeof AUDIENCE_STYLES)[number];
}
