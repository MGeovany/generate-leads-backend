import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async findOrCreate(
    profile,
    accessToken: string,
    extraData?: {
      pageId: string;
      pageAccessToken: string;
      igUserId: string;
    },
  ) {
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
        pageId: extraData?.pageId || '',
        pageAccessToken: extraData?.pageAccessToken || '',
        igUserId: extraData?.igUserId || '',
      },
    });
  }

  async getMe(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        pageId: true,
        igUserId: true,
        createdAt: true,
        aiTone: true,
        accountType: true,
        customAccountType: true,
        audienceStyle: true,
      },
    });
  }

  async updateTone(userId: string, aiTone: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { aiTone },
      select: { id: true, aiTone: true },
    });
  }

  async updateProfile(userId: string, data: Partial<User>) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        aiTone: true,
        accountType: true,
        customAccountType: true,
        audienceStyle: true,
      },
    });
  }
}
