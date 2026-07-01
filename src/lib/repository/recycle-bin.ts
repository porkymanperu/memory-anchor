import { supabase } from '@/lib/supabase';
import type { DeletedMemoryItem, MemoryItem } from '@/lib/types';
import { requireUserId } from './_auth';

interface RecycleBinRow {
  id: string;
  user_id: string;
  item: MemoryItem;
  deleted_at: string;
}

function rowToDeletedItem(row: RecycleBinRow): DeletedMemoryItem {
  return {
    item: row.item,
    deletedAt: row.deleted_at,
  };
}

export async function listRecycleBin(): Promise<DeletedMemoryItem[]> {
  const { data, error } = await supabase
    .from('recycle_bin_items')
    .select('*')
    .order('deleted_at', { ascending: false });
  if (error) throw error;
  return (data as RecycleBinRow[] | null)?.map(rowToDeletedItem) ?? [];
}

export async function addToRecycleBin(entry: DeletedMemoryItem): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase.from('recycle_bin_items').upsert({
    id: entry.item.id,
    user_id: userId,
    item: entry.item,
    deleted_at: entry.deletedAt,
  });
  if (error) throw error;
}

export async function removeFromRecycleBin(id: string): Promise<void> {
  const { error } = await supabase
    .from('recycle_bin_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
