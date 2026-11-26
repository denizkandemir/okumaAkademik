import type {
  FinishExerciseRequest,
  FinishExerciseResponse,
  StartExerciseResponse,
} from '@/features/exercises/types';
import { api } from '@/lib/api';

/** Egzersiz oturumunun istemcisi: başlat, cevapla (QuizView `answerPath` ile), bitir. */

export function startExercise<P, D>(itemId: string) {
  return api.post<StartExerciseResponse<P, D>>(`/exercises/${encodeURIComponent(itemId)}/sessions`);
}

/** QuizView'in şık dokunuşlarını gönderdiği uç. */
export function exerciseAnswerPath(sessionId: string) {
  return `/exercise-sessions/${encodeURIComponent(sessionId)}/answers`;
}

export function finishExercise<R>(sessionId: string, body: FinishExerciseRequest<R>) {
  return api.patch<FinishExerciseResponse>(
    `/exercise-sessions/${encodeURIComponent(sessionId)}`,
    body,
  );
}
