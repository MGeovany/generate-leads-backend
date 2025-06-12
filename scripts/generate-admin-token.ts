import { config } from 'dotenv';
import { sign } from 'jsonwebtoken';

config();

const token = sign(
  {
    sub: 'admin-id',
    name: 'Admin User',
    role: 'ADMIN',
  },
  process.env.JWT_SECRET as string,
  { expiresIn: '7d' },
);

console.log('\n✅ JWT for admin-id:\n');
console.log(token);
