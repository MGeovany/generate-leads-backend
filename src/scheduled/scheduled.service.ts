import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from 'src/notifications/notifications.service';

const prisma = new PrismaClient();

@Injectable()
export class ScheduledService {
  constructor(private notificationService: NotificationService) {}

  async scheduleMessage(data: {
    userId: string;
    type: 'dm' | 'comment' | 'reaction';
    targetId: string;
    message: string;
    scheduledAt: Date;
  }) {
    return prisma.scheduledMessage.create({
      data,
    });
  }

  async getPendingMessages() {
    return prisma.scheduledMessage.findMany({
      where: {
        status: 'pending',
        scheduledAt: {
          lte: new Date(),
        },
      },
    });
  }

  async markAsSent(id: string) {
    return prisma.scheduledMessage.update({
      where: { id },
      data: { status: 'sent' },
    });
  }

  async markAsFailed(id: string) {
    return prisma.scheduledMessage.update({
      where: { id },
      data: { status: 'failed' },
    });
  }

  async getUserScheduledMessages(userId: string, all = false) {
    return prisma.scheduledMessage.findMany({
      where: {
        userId,
        ...(all ? {} : { status: { in: ['pending'] } }),
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async cancelMessage(id: string, userId: string) {
    const message = await prisma.scheduledMessage.findUnique({
      where: { id },
    });

    if (!message || message.userId !== userId || message.status !== 'pending') {
      return null;
    }

    await this.notificationService.notifyUser(
      userId,
      `Your scheduled message "${message.message}" was canceled.`,
    );

    return prisma.scheduledMessage.update({
      where: { id },
      data: { status: 'canceled' },
    });
  }

  async updateMessage(
    id: string,
    userId: string,
    updates: { message?: string; scheduledAt?: Date },
  ) {
    const msg = await prisma.scheduledMessage.findUnique({
      where: { id },
    });

    if (!msg || msg.userId !== userId || msg.status !== 'pending') {
      return null;
    }

    await this.notificationService.notifyUser(
      userId,
      `Your scheduled message "${msg.message}" was updated.`,
    );

    return prisma.scheduledMessage.update({
      where: { id },
      data: {
        ...(updates.message && { message: updates.message }),
        ...(updates.scheduledAt && { scheduledAt: updates.scheduledAt }),
      },
    });
  }
}
