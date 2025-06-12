import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  BadRequestException,
  Delete,
  Param,
  NotFoundException,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateScheduledDto } from './dto/create-scheduled.dto';
import { ScheduledService } from './scheduled.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateScheduledDto } from './dto/update-scheduled.dto';

@Controller('scheduled')
@UseGuards(JwtAuthGuard)
export class ScheduledController {
  constructor(private scheduledService: ScheduledService) {}

  @Post()
  async scheduleMessage(@Body() body: CreateScheduledDto, @Req() req) {
    if (!req.user?.userId) {
      throw new BadRequestException('Missing user ID in token');
    }

    const scheduled = await this.scheduledService.scheduleMessage({
      ...body,
      userId: req.user.userId,
      scheduledAt: new Date(body.scheduledAt),
    });

    return {
      message: 'Message scheduled successfully',
      data: scheduled,
    };
  }

  @Get()
  async getMyScheduledMessages(@Req() req, @Query('all') all: string) {
    if (!req.user?.userId)
      throw new BadRequestException('Missing user ID in token');

    const showAll = all === 'true';
    const list = await this.scheduledService.getUserScheduledMessages(
      req.user.userId,
      showAll,
    );
    return { message: 'Scheduled messages retrieved', data: list };
  }

  @Delete(':id')
  async cancelScheduledMessage(@Param('id') id: string, @Req() req) {
    if (!req.user?.userId)
      throw new BadRequestException('Missing user ID in token');

    const result = await this.scheduledService.cancelMessage(
      id,
      req.user.userId,
    );
    if (!result)
      throw new NotFoundException(
        'Scheduled message not found or unauthorized',
      );

    return { message: 'Scheduled message canceled', data: result };
  }

  @Patch(':id')
  async updateScheduledMessage(
    @Param('id') id: string,
    @Body() body: UpdateScheduledDto,
    @Req() req,
  ) {
    if (!req.user?.userId)
      throw new BadRequestException('Missing user ID in token');

    const updated = await this.scheduledService.updateMessage(
      id,
      req.user.userId,
      {
        message: body.message,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
      },
    );

    if (!updated)
      throw new NotFoundException(
        'Scheduled message not found or cannot be updated',
      );

    return { message: 'Scheduled message updated', data: updated };
  }
}
