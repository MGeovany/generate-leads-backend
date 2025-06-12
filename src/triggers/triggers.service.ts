import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

@Injectable()
export class TriggersService {
  async findAll(userId: string) {
    return prisma.trigger.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return prisma.trigger.findFirst({
      where: { id, userId },
    });
  }

  async create(userId: string, data: any) {
    return prisma.trigger.create({
      data: { ...data, userId },
    });
  }

  async update(id: string, userId: string, data: any) {
    return prisma.trigger.updateMany({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string) {
    return prisma.trigger.deleteMany({
      where: { id, userId },
    });
  }
}
