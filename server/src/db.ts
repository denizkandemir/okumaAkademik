import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './generated/prisma/client.js';

export type { PrismaClient };

export function createPrismaClient(databaseUrl: string): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: databaseUrl,
    // Prisma'nın pg adapter'ı tarihleri saat dilimi belirtmeden UTC olarak yazar ve okurken
    // timestamptz ofsetini yok sayar; bu yüzden bağlantı oturumu UTC olmalıdır. Aksi halde
    // (ör. veritabanı varsayılanı Europe/Istanbul ise) tüm zamanlar saatlerce kayar.
    options: '-c TimeZone=UTC',
  });
  return new PrismaClient({ adapter });
}
