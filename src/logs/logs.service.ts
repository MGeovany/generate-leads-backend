import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '../../generated/prisma';
import { QueryLogsDto } from './dto/query-logs.dto';

const prisma = new PrismaClient();

@Injectable()
export class LogsService {
  async getLogs(filters: QueryLogsDto) {
    const where: Prisma.RequestLogWhereInput = {};

    if (filters.path) where.path = { contains: filters.path };
    if (filters.statusCode) {
      const statusCode =
        typeof filters.statusCode === 'string'
          ? parseInt(filters.statusCode, 10)
          : filters.statusCode;
      where.statusCode = statusCode;
    }
    if (filters.userId) where.userId = filters.userId;

    const limit =
      typeof filters.limit === 'string'
        ? parseInt(filters.limit, 10)
        : (filters.limit ?? 50);
    const offset =
      typeof filters.offset === 'string'
        ? parseInt(filters.offset, 10)
        : (filters.offset ?? 0);

    const logs = await prisma.requestLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return logs;
  }
}
