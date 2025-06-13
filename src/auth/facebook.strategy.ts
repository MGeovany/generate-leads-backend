import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { env } from 'src/config/env';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: env.FB_CLIENT_ID,
      clientSecret: env.FB_CLIENT_SECRET,
      callbackURL: env.FB_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'emails'],
      /* scope: [
        'email',
        'pages_show_list',
        'pages_manage_metadata',
        'pages_messaging',
        'instagram_basic',
        'instagram_manage_comments',
        'instagram_manage_messages',
      ], */
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    return {
      profile,
      accessToken,
    };
  }
}
