import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
