import { Module } from '@nestjs/common';
import { BlastsService } from './blasts.service';
import { BlastsController } from './blasts.controller';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [BlastsService],
  controllers: [BlastsController],
})
export class BlastsModule {}
