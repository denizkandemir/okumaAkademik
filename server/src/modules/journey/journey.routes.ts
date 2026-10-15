import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { LessonKind } from '../../generated/prisma/enums.js';
import { API_CITY_IDS, CITY_NAMES, cityNo, fromApiCity, toApiCity } from '../../lib/city.js';
import { Errors } from '../../lib/errors.js';
import {
  achievementsFor,
  bestStreakFrom,
  cityLevelRange,
  MAX_LEVEL,
  streakFrom,
  weekFrom,
} from '../../lib/journey.js';
import { startOfDayInTimeZone } from '../../lib/time.js';
import { parse } from '../../lib/validation.js';
import { requireAuth } from '../../plugins/auth.js';
import { citiesOf, loadJourneyState, loadReadingDates, lokumBalance } from './journey-state.js';

const journeyQuerySchema = z.object({
  city: z.enum(API_CITY_IDS, { error: 'Böyle bir şehir yok.' }).optional(),
});

export async function journeyRoutes(app: FastifyInstance) {
  const { prisma } = app;

  app.addHook('preHandler', app.authenticate);

  /** Ana sayfa: bir şehrin ders yolu (varsayılan: kullanıcının şu anki şehri) ve üst bilgiler. */
  app.get('/me/journey', async (request) => {
    const { user } = requireAuth(request);
    const query = parse(journeyQuerySchema, request.query);

    const [state, dates, lokum] = await Promise.all([
      loadJourneyState(prisma, user.id),
      loadReadingDates(prisma, user.id),
      lokumBalance(prisma, user.id),
    ]);

    const city = query.city ? fromApiCity(query.city) : state.currentCity;
    const cities = citiesOf(state);
    const selected = cities.find((entry) => entry.city === city);
    if (!selected || selected.status === 'locked') throw Errors.cityLocked(CITY_NAMES[city]);

    const cityLessons = state.lessons.filter((lesson) => lesson.city === city);
    const streak = streakFrom(dates, new Date());

    return {
      level: state.level,
      maxLevel: MAX_LEVEL,
      finished: state.finished,
      currentCity: toApiCity(state.currentCity),
      city: {
        id: selected.id,
        no: cityNo(city),
        ...cityLevelRange(city),
        lessonsDone: selected.lessonsDone,
        lessonsTotal: cityLessons.length,
      },
      lessons: cityLessons.map((lesson) => ({
        id: lesson.id,
        position: lesson.position,
        kind: lesson.kind === LessonKind.CHEST ? 'chest' : 'story',
        title: lesson.title,
        status: lesson.status,
        stars: lesson.bestStars,
      })),
      cities: cities.map(({ id, status, lessonsDone }) => ({ id, status, lessonsDone })),
      stats: { lokum, ...streak },
    };
  });

  /** Profil, rozetler ve hatırlatıcılar için özet. */
  app.get('/me/stats', async (request) => {
    const { user } = requireAuth(request);
    const now = new Date();

    const [state, dates, lokum, today, total, lastSession] = await Promise.all([
      loadJourneyState(prisma, user.id),
      loadReadingDates(prisma, user.id),
      lokumBalance(prisma, user.id),
      prisma.readingSession.aggregate({
        where: { userId: user.id, startedAt: { gte: startOfDayInTimeZone(now) } },
        _sum: { durationSeconds: true },
      }),
      prisma.readingSession.aggregate({
        where: { userId: user.id },
        _sum: { durationSeconds: true },
      }),
      prisma.readingSession.findFirst({
        where: { userId: user.id },
        orderBy: { startedAt: 'desc' },
        select: { startedAt: true, endedAt: true },
      }),
    ]);

    const done = state.lessons.filter((lesson) => lesson.status === 'done');
    const storiesDone = done.filter((lesson) => lesson.kind === LessonKind.STORY).length;
    const bestStreak = bestStreakFrom(dates);

    return {
      level: state.level,
      lokum,
      ...streakFrom(dates, now),
      bestStreak,
      todayMinutes: Math.floor((today._sum.durationSeconds ?? 0) / 60),
      dailyGoalMinutes: user.dailyGoalMinutes,
      storiesDone,
      minutesTotal: Math.floor((total._sum.durationSeconds ?? 0) / 60),
      week: weekFrom(dates, now),
      cities: citiesOf(state).map(({ id, status }) => ({ id, status })),
      achievements: achievementsFor({
        storiesDone,
        bestStreak,
        threeStarLessons: done.filter((lesson) => lesson.bestStars === 3).length,
        completedLessons: state.completedCount,
      }),
      lastReadAt: lastSession ? (lastSession.endedAt ?? lastSession.startedAt).toISOString() : null,
      finished: state.finished,
    };
  });
}
