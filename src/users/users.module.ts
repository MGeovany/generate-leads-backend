import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfileOptionsController } from './profile.controller';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController, ProfileOptionsController],
})
export class UsersModule {}
