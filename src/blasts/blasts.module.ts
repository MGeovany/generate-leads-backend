import { Module } from '@nestjs/common';
import { BlastsService } from './blasts.service';
import { BlastsController } from './blasts.controller';

@Module({
  providers: [BlastsService],
  controllers: [BlastsController]
})
export class BlastsModule {}
