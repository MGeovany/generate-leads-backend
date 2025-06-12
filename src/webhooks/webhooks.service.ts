import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { TestWebhookDto } from './dto/test-webhook.dto';
import { AiService } from 'src/ai/ai.service';

const prisma = new PrismaClient();

@Injectable()
export class WebhooksService {
  constructor(private readonly aiService: AiService) {}

  async processSimulatedInteraction(dto: TestWebhookDto) {
    const { userId, type, text, source = 'simulation' } = dto;

    const interaction = await prisma.interaction.create({
      data: {
        userId,
        text,
        type,
        source,
      },
    });

    const ai = await this.aiService.simulateResponse(text, {});

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
