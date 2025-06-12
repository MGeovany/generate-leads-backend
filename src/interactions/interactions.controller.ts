import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';

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
}
