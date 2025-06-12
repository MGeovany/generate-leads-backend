import { Controller, Get } from '@nestjs/common';
import {
  AI_TONES,
  ACCOUNT_TYPES,
  AUDIENCE_STYLES,
} from '../constants/profile-options';

@Controller('profile-options')
export class ProfileOptionsController {
  @Get()
  getOptions() {
    return {
      aiTones: AI_TONES,
      accountTypes: ACCOUNT_TYPES,
      audienceStyles: AUDIENCE_STYLES,
    };
  }
}
