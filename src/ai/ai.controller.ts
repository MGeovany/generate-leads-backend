import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('simulate-interaction')
  async simulate(@Body('text') text: string) {
    const result = await this.aiService.simulateResponse(text);
    return {
      input: text,
      autoResponse: result.response,
      isAiGenerated: result.isAiGenerated,
      fallbackUsed: !result.isAiGenerated
    };
  }
}
