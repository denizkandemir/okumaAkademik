import 'dotenv/config';

import { createPrismaClient } from '../src/db.js';
import { hashPassword } from '../src/modules/auth/password.js';
import { seedTexts } from './seed-data.js';

/** Geliştirme için test kullanıcısı. Üretimde seed çalıştırılmamalı. */
const TEST_USER = { username: 'deneme', password: '1234', name: 'Deneme', grade: 3 };

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL tanımlı değil');
if (process.env.NODE_ENV === 'production') throw new Error('Seed üretimde çalıştırılamaz');

const prisma = createPrismaClient(databaseUrl);

try {
  for (const text of seedTexts) {
    const { id, ...data } = text;
    await prisma.text.upsert({ where: { id }, create: text, update: data });
  }

  const passwordHash = await hashPassword(TEST_USER.password);
  await prisma.user.upsert({
    where: { username: TEST_USER.username },
    create: {
      username: TEST_USER.username,
      passwordHash,
      name: TEST_USER.name,
      grade: TEST_USER.grade,
    },
    update: { passwordHash, name: TEST_USER.name, grade: TEST_USER.grade },
  });

  console.log(
    `Seed tamam: ${seedTexts.length} metin, test kullanıcısı "${TEST_USER.username}" / "${TEST_USER.password}"`,
  );
} finally {
  await prisma.$disconnect();
}
