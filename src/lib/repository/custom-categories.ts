import { supabase } from '@/lib/supabase';
import type { CategoryGroup, StoredCategory } from '@/lib/types';
import { requireUserId } from './_auth';

interface CustomCategoryRow {
  id: string;
  user_id: string;
  name: string;
  group_name: CategoryGroup;
  icon: string;
  color: string;
}

function rowToCategory(row: CustomCategoryRow): StoredCategory {
  return {
    id: row.id,
    name: row.name,
    group: row.group_name,
    icon: row.icon,
    color: row.color,
  };
}

export async function listCustomCategories(): Promise<StoredCategory[]> {
  const { data, error } = await supabase
    .from('custom_categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return (data as CustomCategoryRow[] | null)?.map(rowToCategory) ?? [];
}

export async function upsertCustomCategory(category: StoredCategory): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase.from('custom_categories').upsert({
    id: category.id,
    user_id: userId,
    name: category.name,
    group_name: category.group,
    icon: category.icon,
    color: category.color,
  });
  if (error) throw error;
}

export async function deleteCustomCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('custom_categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
