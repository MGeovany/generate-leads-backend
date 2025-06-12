import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TriggersService } from './triggers.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('triggers')
export class TriggersController {
  constructor(private readonly triggersService: TriggersService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.triggersService.findAll(user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.triggersService.findOne(id, user.userId);
  }

  @Post()
  async create(@Body() body: any, @CurrentUser() user: any) {
    return this.triggersService.create(user.userId, body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    await this.triggersService.update(id, user.userId, body);
    return { success: true };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.triggersService.delete(id, user.userId);
    return { success: true };
  }
}
