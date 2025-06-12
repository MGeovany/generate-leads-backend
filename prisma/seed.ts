import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { id: 'admin-id' },
    update: {},
    create: {
      id: 'admin-id',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
      facebookId: '', // or provide a valid value
      accessToken: '', // or provide a valid value
      pageId: '', // or provide a valid value
      pageAccessToken: '', // or provide a valid value
      igUserId: '', // or provide a valid value
    },
  });

  console.log('✅ Seeded admin user:');
  console.log({
    email: admin.email,
    password: 'admin123',
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
