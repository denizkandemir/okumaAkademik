import type { PrismaClient } from '../../db.js';
import type { Prisma } from '../../generated/prisma/client.js';
import type { GradeBand } from '../../generated/prisma/enums.js';
import { measureText } from '../../lib/readability.js';
import { readingMetricValues } from '../../lib/reading-metrics.js';

type Db = PrismaClient | Prisma.TransactionClient;

type WriteInput = {
  readingSessionId: string;
  gradeBand: GradeBand;
  /** Ders okumasında soru sonuçları; kitaplık okumasında yok. */
  questions?: { total: number; firstTryCorrect: number };
  /**
   * `true`: satır varsa dokunulmaz (okuma bitince; sonradan gelen ders tamamlaması sorularla
   * birlikte yazar ve onun üstüne yazılmamalı). `false`: satır yeniden yazılır (ders tamamlama).
   */
  onlyIfMissing: boolean;
};

/** Okuma kaydının metni ve süresiyle reading_metrics satırını yazar. */
export async function writeReadingMetric(db: Db, input: WriteInput): Promise<void> {
  const session = await db.readingSession.findUniqueOrThrow({
    where: { id: input.readingSessionId },
    select: {
      durationSeconds: true,
      text: { select: { wordCount: true, paragraphs: true } },
    },
  });
  // Ölçüleri seed'de hesaplanmamış bir metinde kelime sayısı burada hesaplanır.
  const wordCount = session.text.wordCount ?? measureText(session.text.paragraphs).wordCount;
  if (wordCount === 0) return;

  const values = readingMetricValues({
    gradeBand: input.gradeBand,
    wordCount,
    durationSeconds: session.durationSeconds,
    questions: input.questions,
  });
  await db.readingMetric.upsert({
    where: { readingSessionId: input.readingSessionId },
    create: { readingSessionId: input.readingSessionId, ...values },
    update: input.onlyIfMissing ? {} : values,
  });
}
