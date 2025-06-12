import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { InteractionsService } from 'src/interactions/interactions.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TriggersService } from 'src/triggers/triggers.service';
import { UsersService } from 'src/users/users.service';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly interactionsService: InteractionsService,
    private readonly triggersService: TriggersService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('simulate-interaction')
  async simulate(
    @Body('text') text: string,
    @Body('type') type: 'dm' | 'comment' | 'reaction',
    @CurrentUser() user: any,
  ) {
    const trigger = await this.triggersService.matchTrigger(
      user.userId,
      type,
      text,
    );

    let response = 'No se encontró una regla activa.';
    let isAiGenerated = false;

    if (trigger) {
      if (trigger.responseType === 'static') {
        response = trigger.responseText || 'Respuesta estática no definida.';
      } else {
        const userProfile = await this.usersService.getMe(user.userId);
        const result = await this.aiService.simulateResponse(text, userProfile);

        response = result.response;
        isAiGenerated = result.isAiGenerated;
      }
    }

    const saved = await this.interactionsService.saveInteraction({
      userId: user.userId,
      source: 'simulation',
      type,
      text,
      aiResponse: response,
      isAiGenerated,
      classification: trigger ? `match:${trigger.keyword}` : 'no_match',
    });

    return {
      interactionId: saved.id,
      input: text,
      matchedTrigger: trigger?.keyword || null,
      autoResponse: response,
      isAiGenerated,
    };
  }
}
