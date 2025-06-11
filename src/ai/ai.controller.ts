import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { InteractionsService } from 'src/interactions/interactions.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly interactionsService: InteractionsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('simulate-interaction')
  async simulate(@Body('text') text: string, @CurrentUser() user: any) {
    const result = await this.aiService.simulateResponse(text);

    const saved = await this.interactionsService.saveInteraction({
      userId: user.userId,
      source: 'simulation',
      type: 'dm',
      text,
      classification: undefined,
      aiResponse: result.response,
      isAiGenerated: result.isAiGenerated,
    });

    return {
      interactionId: saved.id,
      input: text,
      autoResponse: result.response,
      isAiGenerated: result.isAiGenerated,
    };
  }
}
