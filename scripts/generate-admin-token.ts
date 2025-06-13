import { config } from 'dotenv';
import { sign } from 'jsonwebtoken';
import { env } from 'src/config/env';

config();

const token = sign(
  {
    sub: 'admin-id',
    name: 'Admin User',
    role: 'ADMIN',
  },
  env.JWT_SECRET as string,
  { expiresIn: '7d' },
);

console.log('\n✅ JWT for admin-id:\n');
console.log(token);
