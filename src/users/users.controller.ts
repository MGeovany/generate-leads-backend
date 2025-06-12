import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UsersService } from './users.service';

@UseGuards(AuthGuard('jwt'))
@Controller('me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getMe(@CurrentUser() user: any) {
    return this.usersService.getMe(user.userId);
  }

  @Get()
  getProfile(@CurrentUser() user: any) {
    return this.usersService.getMe(user.userId);
  }

  @Patch()
  updateAiTone(@Body('aiTone') aiTone: string, @CurrentUser() user: any) {
    return this.usersService.updateTone(user.userId, aiTone);
  }
}
