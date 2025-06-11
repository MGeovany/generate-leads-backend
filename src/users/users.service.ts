import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async findOrCreate(profile, accessToken: string) {
    const existing = await prisma.user.findUnique({
      where: { facebookId: profile.id },
    });

    if (existing) return existing;

    return await prisma.user.create({
      data: {
        facebookId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        accessToken,
      },
    });
  }
}
