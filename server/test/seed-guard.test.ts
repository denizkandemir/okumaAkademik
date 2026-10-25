import { describe, expect, it } from 'vitest';

import { sampleUsersAllowed } from '../prisma/seed-guard.js';

describe('sampleUsersAllowed', () => {
  it('yerel veritabanında örnek kullanıcılara izin verir', () => {
    for (const host of ['localhost', '127.0.0.1', '[::1]']) {
      expect(sampleUsersAllowed(`postgresql://okumatik:okumatik@${host}:5432/okumatik`, {})).toBe(
        true,
      );
    }
  });

  it('uzak veritabanında yalnızca SEED_DEMO=1 ile izin verir', () => {
    const remote = 'postgresql://okumatik:okumatik@db.example.com:5432/okumatik';
    expect(sampleUsersAllowed(remote, {})).toBe(false);
    expect(sampleUsersAllowed(remote, { SEED_DEMO: '0' })).toBe(false);
    expect(sampleUsersAllowed(remote, { SEED_DEMO: '1' })).toBe(true);
  });

  it('adres çözülemezse izin vermez', () => {
    expect(sampleUsersAllowed('bozuk adres', {})).toBe(false);
  });
});
