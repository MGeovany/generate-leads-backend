import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

@Injectable()
export class BlastsService {
  async createBlast(userId: string, message: string) {
    const scheduledAt = new Date(); // for now, immediate
    const interactions = await prisma.interaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // last 24h
        },
      },
      select: { id: true },
    });

    const blast = await prisma.blast.create({
      data: {
        userId,
        message,
        scheduledAt,
        targets: {
          create: interactions.map((i) => ({
            interactionId: i.id,
            status: 'pending',
          })),
        },
      },
    });

    return blast;
  }

  async getBlasts(userId: string) {
    return prisma.blast.findMany({
      where: { userId },
      include: {
        targets: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
