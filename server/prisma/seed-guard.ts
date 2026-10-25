/** Örnek ve demo kullanıcıların kendiliğinden oluşturulduğu yerel veritabanı adresleri. */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

/**
 * Seed örnek ve demo kullanıcıları oluşturup şifrelerini sıfırlayabilir mi? Yalnızca yerel
 * veritabanında ya da `SEED_DEMO=1` verildiyse: paylaşılan bir veritabanında aynı kullanıcı adlı
 * gerçek hesaplar ezilmesin.
 */
export function sampleUsersAllowed(
  databaseUrl: string,
  env: Record<string, string | undefined>,
): boolean {
  if (env.SEED_DEMO === '1') return true;
  try {
    // IPv6 adresi köşeli parantezle gelir: [::1]
    const host = new URL(databaseUrl).hostname.replace(/^\[|\]$/g, '');
    return LOCAL_HOSTS.has(host);
  } catch {
    return false;
  }
}
