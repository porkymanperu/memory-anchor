import { supabase } from '@/lib/supabase';
import { requireUserId } from './_auth';

interface UserMetaRow {
  user_id: string;
  data_version: string;
}

export async function getDataVersion(): Promise<string | null> {
  const { data, error } = await supabase
    .from('user_meta')
    .select('data_version')
    .maybeSingle();
  if (error) throw error;
  return (data as Pick<UserMetaRow, 'data_version'> | null)?.data_version ?? null;
}

export async function setDataVersion(version: string): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase.from('user_meta').upsert({
    user_id: userId,
    data_version: version,
  });
  if (error) throw error;
}
