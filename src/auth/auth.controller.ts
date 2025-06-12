import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    // Redirige a Facebook login
  }

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req) {
    const { profile, accessToken } = req.user;
    const user = await this.usersService.findOrCreate(profile, accessToken);

    const token = this.jwtService.sign({
      sub: user.id,
      name: user.name,
      role: user.role,
    });

    return {
      message: 'Authenticated',
      token,
      user,
    };
  }
}
