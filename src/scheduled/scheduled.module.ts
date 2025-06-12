import { Module } from '@nestjs/common';
import { ScheduledController } from './scheduled.controller';
import { ScheduledService } from './scheduled.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledJob } from './scheduled.job';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ScheduleModule.forRoot(), NotificationsModule],
  controllers: [ScheduledController],
  providers: [ScheduledService, ScheduledJob],
})
export class ScheduledModule {}
