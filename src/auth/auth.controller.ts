import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    // Redirige a Facebook login
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req) {
    return {
      message: 'Authenticated',
      user: req.user,
    };
  }
}
