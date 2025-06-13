import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

const prisma = new PrismaClient();

@Controller('admin')
@UseGuards(JwtAuthGuard)
@Roles('ADMIN')
export class AdminController {
  @Get('users')
  async getAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { message: 'All users', data: users };
  }

  @Get('triggers')
  async getAllTriggers() {
    const triggers = await prisma.trigger.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return { message: 'All triggers', data: triggers };
  }

  @Get('interactions')
  async getRecentInteractions(
    @Query('type') type: string,
    @Query('source') source: string,
    @Query('aiOnly') aiOnly: string,
    @Query('limit') limit = '50',
  ) {
    const where: any = {};
    if (type) where.type = type;
    if (source) where.source = source;
    if (aiOnly === 'true') where.isAiGenerated = true;

    const interactions = await prisma.interaction.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
    });

    return { message: 'Filtered interactions', data: interactions };
  }

  @Get('metrics')
  async getAdminMetrics() {
    const [totalUsers, totalTriggers, totalInteractions] = await Promise.all([
      prisma.user.count(),
      prisma.trigger.count(),
      prisma.interaction.count(),
    ]);

    const byType = await prisma.interaction.groupBy({
      by: ['type'],
      _count: true,
    });

    const bySource = await prisma.interaction.groupBy({
      by: ['source'],
      _count: true,
    });

    const byAi = await prisma.interaction.groupBy({
      by: ['isAiGenerated'],
      _count: true,
    });

    return {
      message: 'Admin metrics',
      data: {
        totalUsers,
        totalTriggers,
        totalInteractions,
        interactionsByType: Object.fromEntries(
          byType.map((t) => [t.type, t._count]),
        ),
        interactionsBySource: Object.fromEntries(
          bySource.map((s) => [s.source, s._count]),
        ),
        interactionsAiVsStatic: {
          ai: byAi.find((x) => x.isAiGenerated)?._count ?? 0,
          static: byAi.find((x) => !x.isAiGenerated)?._count ?? 0,
        },
      },
    };
  }
}
