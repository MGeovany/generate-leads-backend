import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

@Injectable()
export class InteractionsService {
  async saveInteraction(params: {
    userId: string;
    source: 'simulation' | 'webhook';
    type: 'dm' | 'comment' | 'mention';
    text: string;
    classification?: string;
    aiResponse?: string;
    isAiGenerated?: boolean;
  }) {
    return prisma.interaction.create({
      data: {
        ...params,
      },
    });
  }
}
