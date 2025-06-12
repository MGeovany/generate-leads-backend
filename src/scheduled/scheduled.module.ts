import { Module } from '@nestjs/common';
import { ScheduledController } from './scheduled.controller';
import { ScheduledService } from './scheduled.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledJob } from './scheduled.job';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ScheduledController],
  providers: [ScheduledService, ScheduledJob],
})
export class ScheduledModule {}
