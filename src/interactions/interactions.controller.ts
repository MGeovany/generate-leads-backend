import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
