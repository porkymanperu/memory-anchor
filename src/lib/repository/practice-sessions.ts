import { supabase } from '@/lib/supabase';
import type {
  CategoryId,
  PracticeSession,
  SessionQuestion,
} from '@/lib/types';
import { requireUserId } from './_auth';

interface PracticeSessionRow {
  id: string;
  user_id: string;
  date: string;
  category_ids: string[];
  difficulty: 'easy' | 'medium' | 'hard' | null;
  questions_asked: number;
  questions_correct: number;
  hints_used: number;
  average_time: number;
  total_time_seconds: number | null;
  items_reviewed: string[];
  questions: SessionQuestion[] | null;
}

function rowToSession(row: PracticeSessionRow): PracticeSession {
  return {
    id: row.id,
    date: row.date,
    categoryIds: row.category_ids as CategoryId[],
    difficulty: row.difficulty ?? undefined,
    questionsAsked: row.questions_asked,
    questionsCorrect: row.questions_correct,
    hintsUsed: row.hints_used,
    averageTime: row.average_time,
    totalTimeSeconds: row.total_time_seconds ?? undefined,
    itemsReviewed: row.items_reviewed,
    questions: row.questions ?? undefined,
  };
}

export async function listSessions(): Promise<PracticeSession[]> {
  const { data, error } = await supabase
    .from('practice_sessions')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return (data as PracticeSessionRow[] | null)?.map(rowToSession) ?? [];
}

export async function insertSession(session: PracticeSession): Promise<void> {
  const userId = await requireUserId();
  const payload = {
    id: session.id,
    user_id: userId,
    date: session.date,
    category_ids: session.categoryIds,
    difficulty: session.difficulty ?? null,
    questions_asked: session.questionsAsked,
    questions_correct: session.questionsCorrect,
    hints_used: session.hintsUsed,
    average_time: session.averageTime,
    total_time_seconds: session.totalTimeSeconds ?? null,
    items_reviewed: session.itemsReviewed,
    questions: session.questions ?? null,
  };
  const { data, error } = await supabase
    .from('practice_sessions')
    .insert(payload)
    .select();
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[practice-sessions] insertSession', {
      id: session.id,
      userId,
      returnedRows: data?.length ?? 0,
      error,
    });
  }
  if (error) throw error;
}

export async function deleteSession(id: string): Promise<void> {
  const { error } = await supabase.from('practice_sessions').delete().eq('id', id);
  if (error) throw error;
}
