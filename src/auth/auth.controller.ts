import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req) {
    const { profile, accessToken } = req.user;

    const pagesResponse = await axios.get(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`,
    );

    const pages = pagesResponse.data.data;

    const firstPage = pages[0];

    if (!firstPage) {
      throw new Error('No se encontraron páginas conectadas a esta cuenta');
    }

    const pageAccessToken = firstPage.access_token;
    const pageId = firstPage.id;

    const igResponse = await axios.get(
      `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`,
    );

    const igUserId = igResponse.data.instagram_business_account?.id;

    if (!igUserId) {
      throw new Error(
        'La página no tiene una cuenta de Instagram Business conectada',
      );
    }

    const user = await this.usersService.findOrCreate(profile, accessToken, {
      pageId,
      pageAccessToken,
      igUserId,
    });

    const token = this.jwtService.sign({
      sub: user.id,
      name: user.name,
    });

    return {
      message: 'Authenticated',
      token,
      user,
    };
  }
}
