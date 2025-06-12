import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

@Injectable()
export class InteractionsService {
  async saveInteraction(params: {
    userId: string;
    source: 'simulation' | 'webhook';
    type: 'dm' | 'comment' | 'reaction';
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

  async findAllByUser(userId: string) {
    return prisma.interaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        text: true,
        type: true,
        source: true,
        aiResponse: true,
        isAiGenerated: true,
        classification: true,
        createdAt: true,
      },
    });
  }
}
