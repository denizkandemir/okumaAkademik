import { describe, expect, it } from 'vitest';

import { createPrismaClient } from '../src/db.js';
import { bearer, registerUser, useTestContext } from './helpers.js';
import { getTestDatabaseUrl } from './test-db.js';

/** Veritabanının SQL araçlarından okunabilirliği: açıklamalar ve rapor görünümleri. */
const ctx = useTestContext();

const TABLES = ['users', 'auth_sessions', 'texts', 'reading_sessions'];
const VIEWS = ['v_user_summary', 'v_daily_reading', 'v_reading_history'];

describe('saat dilimi', () => {
  it('veritabanının varsayılan saat dilimi UTC olmasa da zamanlar kaymaz', async () => {
    const databaseName = new URL(getTestDatabaseUrl()).pathname.slice(1);
    await ctx.prisma.$executeRawUnsafe(
      `ALTER DATABASE "${databaseName}" SET timezone TO 'Europe/Istanbul'`,
    );
    // Ayar yalnızca yeni bağlantılarda geçerli olur.
    const client = createPrismaClient(getTestDatabaseUrl());
    try {
      const [row] = await client.$queryRaw<{ timezone: string; now: Date }[]>`
        SELECT current_setting('TimeZone') AS timezone, now() AS now`;
      expect(row?.timezone).toBe('UTC');
      expect(Math.abs((row?.now.getTime() ?? 0) - Date.now())).toBeLessThan(5000);
    } finally {
      await client.$disconnect();
      await ctx.prisma.$executeRawUnsafe(`ALTER DATABASE "${databaseName}" RESET timezone`);
    }
  });
});

describe('veritabanı şeması', () => {
  it('her tablo ve kolonun açıklaması (COMMENT) vardır', async () => {
    const missing = await ctx.prisma.$queryRaw<{ name: string }[]>`
      SELECT c.relname AS name
      FROM pg_class c
      WHERE c.relname = ANY(${TABLES}) AND obj_description(c.oid, 'pg_class') IS NULL
      UNION ALL
      SELECT table_name || '.' || column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = ANY(${TABLES})
        AND col_description(format('%I', table_name)::regclass, ordinal_position) IS NULL`;
    expect(missing).toEqual([]);
  });

  it("görünümlerde şifre veya token hash'i yoktur", async () => {
    const columns = await ctx.prisma.$queryRaw<{ table_name: string; column_name: string }[]>`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ANY(${VIEWS})`;

    expect(new Set(columns.map((column) => column.table_name))).toEqual(new Set(VIEWS));
    expect(columns.filter((column) => /hash|token|password/i.test(column.column_name))).toEqual([]);
  });

  it('görünümler okuma verisini özetler', async () => {
    const { token } = await registerUser(ctx.app, { username: 'ayse' });
    const start = await ctx.app.inject({
      method: 'POST',
      url: '/reading-sessions',
      headers: bearer(token),
      payload: { textId: 'kayip-anahtar' },
    });
    const { id } = start.json<{ id: string }>();
    await ctx.prisma.readingSession.update({
      where: { id },
      data: { startedAt: new Date(Date.now() - 10 * 60 * 1000) },
    });
    await ctx.app.inject({
      method: 'PATCH',
      url: `/reading-sessions/${id}`,
      headers: bearer(token),
      payload: { progress: 0.5, durationSeconds: 330, completed: false },
    });

    const [summary] = await ctx.prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT username, total_reading_minutes::float AS minutes, completed_text_count::int AS completed
      FROM v_user_summary`;
    expect(summary).toEqual({ username: 'ayse', minutes: 5.5, completed: 0 });

    const [daily] = await ctx.prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT username, read_minutes, daily_goal_minutes, goal_reached FROM v_daily_reading`;
    expect(daily).toEqual({
      username: 'ayse',
      read_minutes: 5,
      daily_goal_minutes: 10,
      goal_reached: false,
    });

    const [history] = await ctx.prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT text_title, level_name, progress_percent, completed FROM v_reading_history`;
    expect(history).toEqual({
      text_title: 'Kayıp Anahtar',
      level_name: 'Orta',
      progress_percent: 50,
      completed: false,
    });
  });
});
