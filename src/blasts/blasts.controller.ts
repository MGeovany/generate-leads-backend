import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { BlastsService } from './blasts.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('blasts')
export class BlastsController {
  constructor(private readonly blastsService: BlastsService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body('message') message: string) {
    return this.blastsService.createBlast(user.userId, message);
  }

  @Get()
  async getAll(@CurrentUser() user: any) {
    return this.blastsService.getBlasts(user.userId);
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: string, @CurrentUser() user: any) {
    return this.blastsService.getBlastStatus(id, user.userId);
  }
}
