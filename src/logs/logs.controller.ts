import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { QueryLogsDto } from './dto/query-logs.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('logs')
@UseGuards(JwtAuthGuard)
@Roles('ADMIN')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getLogs(@Query() query: QueryLogsDto) {
    return this.logsService.getLogs(query);
  }
}
