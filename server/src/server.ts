import { buildApp } from './app.js';
import { loadConfig } from './config.js';
import { createPrismaClient } from './db.js';

const config = loadConfig();
const prisma = createPrismaClient(config.DATABASE_URL);
const app = await buildApp({ config, prisma });

const shutdown = async (signal: string) => {
  app.log.info(`${signal} alındı, sunucu kapatılıyor`);
  await app.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

try {
  await app.listen({ host: config.HOST, port: config.PORT });
} catch (error) {
  app.log.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
