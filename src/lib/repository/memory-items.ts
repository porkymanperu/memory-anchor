import { supabase } from '@/lib/supabase';
import type {
  CategoryId,
  MemoryAssociation,
  MemoryItem,
} from '@/lib/types';
import { requireUserId } from './_auth';

interface MemoryItemRow {
  id: string;
  user_id: string;
  category_id: string;
  question: string;
  questions: string[] | null;
  answer: string;
  answer_type: 'single' | 'multiple' | null;
  valid_answers: string[] | null;
  hints: [string, string];
  association: MemoryAssociation | null;
  image_url: string | null;
  answer_image_url: string | null;
  related_items: string[] | null;
  is_custom: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  tags: string[] | null;
}

type MemoryItemInsert = Omit<MemoryItemRow, 'user_id'> & { user_id: string };

function rowToMemoryItem(row: MemoryItemRow): MemoryItem {
  return {
    id: row.id,
    categoryId: row.category_id as CategoryId,
    question: row.question,
    questions: row.questions ?? undefined,
    answer: row.answer,
    answerType: row.answer_type ?? undefined,
    validAnswers: row.valid_answers ?? undefined,
    hints: row.hints,
    association: row.association ?? undefined,
    imageUrl: row.image_url ?? undefined,
    answerImageUrl: row.answer_image_url ?? undefined,
    relatedItems: row.related_items ?? undefined,
    isCustom: row.is_custom,
    difficulty: row.difficulty ?? undefined,
    tags: row.tags ?? undefined,
  };
}

function memoryItemToInsert(item: MemoryItem, userId: string): MemoryItemInsert {
  return {
    id: item.id,
    user_id: userId,
    category_id: item.categoryId,
    question: item.question,
    questions: item.questions ?? null,
    answer: item.answer,
    answer_type: item.answerType ?? null,
    valid_answers: item.validAnswers ?? null,
    hints: item.hints,
    association: item.association ?? null,
    image_url: item.imageUrl ?? null,
    answer_image_url: item.answerImageUrl ?? null,
    related_items: item.relatedItems ?? null,
    is_custom: item.isCustom,
    difficulty: item.difficulty ?? null,
    tags: item.tags ?? null,
  };
}

export async function listMemoryItems(): Promise<MemoryItem[]> {
  const { data, error } = await supabase
    .from('memory_items')
    .select('*')
    .order('id');
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[memory-items] listMemoryItems', {
      rows: data?.length ?? 0,
      error,
    });
  }
  if (error) throw error;
  return (data as MemoryItemRow[] | null)?.map(rowToMemoryItem) ?? [];
}

export async function upsertMemoryItem(item: MemoryItem): Promise<void> {
  const userId = await requireUserId();
  const payload = memoryItemToInsert(item, userId);
  const { data, error } = await supabase
    .from('memory_items')
    .upsert(payload)
    .select();
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[memory-items] upsertMemoryItem', {
      id: item.id,
      userId,
      returnedRows: data?.length ?? 0,
      error,
    });
  }
  if (error) throw error;
}

export async function bulkUpsertMemoryItems(items: MemoryItem[]): Promise<void> {
  if (items.length === 0) return;
  const userId = await requireUserId();
  const payload = items.map((item) => memoryItemToInsert(item, userId));
  const { data, error } = await supabase
    .from('memory_items')
    .upsert(payload)
    .select();
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[memory-items] bulkUpsertMemoryItems', {
      sent: items.length,
      userId,
      returnedRows: data?.length ?? 0,
      error,
    });
  }
  if (error) throw error;
}

export async function deleteMemoryItem(id: string): Promise<void> {
  const { error } = await supabase.from('memory_items').delete().eq('id', id);
  if (error) throw error;
}
