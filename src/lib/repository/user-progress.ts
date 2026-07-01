import { supabase } from '@/lib/supabase';
import type { ItemHistory, UserProgress } from '@/lib/types';
import { requireUserId } from './_auth';
import { listSessions } from './practice-sessions';

interface UserProgressRow {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_practice_date: string | null;
  total_sessions: number;
  total_questions_answered: number;
  total_correct_answers: number;
  difficult_items: string[];
  favorite_items: string[];
  custom_items: string[];
  item_history: Record<string, ItemHistory> | null;
}

function rowToProgress(
  row: UserProgressRow,
  sessions: UserProgress['sessions'],
): UserProgress {
  return {
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    lastPracticeDate: row.last_practice_date ?? '',
    totalSessions: row.total_sessions,
    totalQuestionsAnswered: row.total_questions_answered,
    totalCorrectAnswers: row.total_correct_answers,
    difficultItems: row.difficult_items ?? [],
    favoriteItems: row.favorite_items ?? [],
    customItems: row.custom_items ?? [],
    sessions,
    itemHistory: row.item_history ?? undefined,
  };
}

/**
 * Fetches the scalar progress row and the sessions list, then assembles them
 * into the existing `UserProgress` shape so callers do not need to change.
 * Returns null when the user has no progress row yet.
 */
export async function getUserProgress(): Promise<UserProgress | null> {
  const [progressResult, sessions] = await Promise.all([
    supabase.from('user_progress').select('*').maybeSingle(),
    listSessions(),
  ]);

  if (progressResult.error) throw progressResult.error;
  const row = progressResult.data as UserProgressRow | null;
  if (!row) return null;
  return rowToProgress(row, sessions);
}

/**
 * Writes only the scalar fields of `UserProgress` to the `user_progress`
 * table. The `sessions` array is intentionally ignored — callers must use
 * `insertSession()` from './practice-sessions' to persist new sessions.
 */
export async function upsertUserProgress(progress: UserProgress): Promise<void> {
  const userId = await requireUserId();
  const payload = {
    user_id: userId,
    current_streak: progress.currentStreak,
    longest_streak: progress.longestStreak,
    last_practice_date: progress.lastPracticeDate || null,
    total_sessions: progress.totalSessions,
    total_questions_answered: progress.totalQuestionsAnswered,
    total_correct_answers: progress.totalCorrectAnswers,
    difficult_items: progress.difficultItems,
    favorite_items: progress.favoriteItems,
    custom_items: progress.customItems,
    item_history: progress.itemHistory ?? {},
  };
  const { data, error } = await supabase
    .from('user_progress')
    // user_progress has exactly one row per user, keyed by user_id, so the
    // upsert must conflict on that column instead of the default PK.
    .upsert(payload, { onConflict: 'user_id' })
    .select();
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[user-progress] upsertUserProgress', {
      userId,
      returnedRows: data?.length ?? 0,
      error,
    });
  }
  if (error) throw error;
}
