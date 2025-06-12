import { Controller, Get, UseGuards } from '@nestjs/common';
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
  async getRecentInteractions() {
    const interactions = await prisma.interaction.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { message: 'Recent interactions', data: interactions };
  }
}
