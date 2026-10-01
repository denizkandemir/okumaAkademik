/**
 * Testler veritabanını her seferinde temizler. Yanlışlıkla geliştirme veritabanının silinmemesi
 * için yalnızca adında "test" geçen ve DATABASE_URL'den farklı bir veritabanına izin verilir.
 */
export function getTestDatabaseUrl(): string {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error('TEST_DATABASE_URL tanımlı değil (bkz. server/.env.example)');
  }
  const databaseName = new URL(url).pathname.slice(1);
  if (!databaseName.includes('test') || url === process.env.DATABASE_URL) {
    throw new Error(
      `TEST_DATABASE_URL ayrı bir test veritabanını göstermeli (şu an: "${databaseName}")`,
    );
  }
  return url;
}
