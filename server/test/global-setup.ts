import 'dotenv/config';

import { execSync } from 'node:child_process';

import { getTestDatabaseUrl } from './test-db.js';

/** Test veritabanını en güncel migration'lara getirir. */
export default function setup() {
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: getTestDatabaseUrl() },
    stdio: 'inherit',
  });
}
