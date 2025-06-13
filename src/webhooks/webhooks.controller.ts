import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InteractionsService } from 'src/interactions/interactions.service';
import { AiService } from 'src/ai/ai.service';

@UseGuards(JwtAuthGuard)
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly interactionsService: InteractionsService,
    private readonly aiService: AiService,
  ) {}

  @Post('test')
  async simulateWebhook(
    @Req() req,
    @Body()
    body: {
      text: string;
      type: 'dm' | 'comment' | 'reaction';
    },
  ) {
    const userId = req.user.userId;
    const { text, type } = body;

    const profile = req.user;

    const { response: aiResponse, isAiGenerated } =
      await this.aiService.simulateResponse(text, profile);

    const classification = await this.aiService.classify(text);

    const interaction = await this.interactionsService.saveInteraction({
      userId,
      text,
      type,
      source: 'webhook',
      aiResponse,
      isAiGenerated,
      classification,
    });

    return {
      message: 'Simulated webhook processed',
      interaction,
      classification,
    };
  }
}
