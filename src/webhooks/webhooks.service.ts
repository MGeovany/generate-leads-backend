import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TestWebhookDto } from './dto/test-webhook.dto';
import { AiService } from 'src/ai/ai.service';

const prisma = new PrismaClient();

@Injectable()
export class WebhooksService {
  constructor(private readonly aiService: AiService) {}

  async processSimulatedInteraction(dto: TestWebhookDto) {
    const { userId, type, text, source = 'simulation', forceAi } = dto;

    const interaction = await prisma.interaction.create({
      data: {
        userId,
        text,
        type,
        source,
      },
    });

    let ai;

    if (forceAi === true) {
      ai = await this.aiService.simulateResponse(text, {});
    } else if (forceAi === false) {
      ai = this.aiService.getFallbackResponse(text);
    } else {
      ai = await this.aiService.simulateResponse(text, {});
      if (!ai.isAiGenerated) {
        // fallback was used inside simulateResponse
      }
    }

    const updated = await prisma.interaction.update({
      where: { id: interaction.id },
      data: {
        aiResponse: ai.response,
        isAiGenerated: ai.isAiGenerated,
      },
    });

    return updated;
  }
}
