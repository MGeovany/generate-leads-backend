import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';
import { Response } from 'express';

const prisma = new PrismaClient();
@UseGuards(AuthGuard('jwt'))
@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Get()
  async getAll(@CurrentUser() user: any) {
    return this.interactionsService.findAllByUser(user.userId);
  }

  @Get('stats')
  async getStats(
    @CurrentUser() user: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.interactionsService.getUserStats(user.userId, fromDate, toDate);
  }

  @Get('export')
  async exportInteractions(
    @Req() req,
    @Res() res: Response,
    @Query('format') format: string = 'json',
  ) {
    const userId = req.user.userId;

    const interactions = await prisma.interaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        createdAt: true,
        text: true,
        aiResponse: true,
        type: true,
        source: true,
        isAiGenerated: true,
      },
    });

    if (format === 'csv') {
      const parser = new Parser({
        fields: [
          'createdAt',
          'text',
          'aiResponse',
          'type',
          'source',
          'isAiGenerated',
        ],
      });

      const csv = parser.parse(interactions);
      res.header('Content-Type', 'text/csv');
      res.attachment('interactions.csv');
      return res.send(csv);
    }

    res.header('Content-Type', 'application/json');
    return res.send({ data: interactions });
  }
}
