import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '../../generated/prisma';

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

  async getUserStats(userId: string, from?: Date, to?: Date) {
    const dateFilter: Prisma.InteractionWhereInput = {};

    if (from || to) {
      dateFilter.createdAt = {};
      if (from) (dateFilter.createdAt as any).gte = from;
      if (to) (dateFilter.createdAt as any).lte = to;
    }

    const baseWhere = {
      userId,
      ...(from || to ? dateFilter : {}),
    };

    const [total, ai, fallback, byType] = await Promise.all([
      prisma.interaction.count({ where: baseWhere }),
      prisma.interaction.count({
        where: {
          ...baseWhere,
          isAiGenerated: true,
          aiResponse: { not: null },
        },
      }),
      prisma.interaction.count({
        where: {
          ...baseWhere,
          isAiGenerated: false,
          aiResponse: { not: null },
        },
      }),
      prisma.interaction.groupBy({
        by: ['type'],
        where: baseWhere,
        _count: true,
      }),
    ]);

    const matched = ai + fallback;
    const byTypeSummary = byType.reduce(
      (acc, curr) => {
        acc[curr.type] = curr._count;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalInteractions: total,
      matchedKeywords: matched,
      noMatch: total - matched,
      aiResponses: ai,
      staticResponses: fallback,
      byType: byTypeSummary,
    };
  }
}
