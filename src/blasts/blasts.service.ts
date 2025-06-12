import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { QueueService } from 'src/queue/queue.service';

const prisma = new PrismaClient();

@Injectable()
export class BlastsService {
  constructor(private readonly queueService: QueueService) {}

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
      include: { targets: true },
    });

    // Enqueue messages
    for (const target of blast.targets) {
      await this.queueService.enqueueBlast({
        targetId: target.id,
        message,
      });
    }

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

  async getBlastStatus(blastId: string, userId: string) {
    return prisma.blast.findFirst({
      where: { id: blastId, userId },
      include: {
        targets: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            interaction: {
              select: {
                id: true,
                text: true,
                type: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
  }
}
