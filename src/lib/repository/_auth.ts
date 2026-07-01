import { supabase } from '@/lib/supabase';

/**
 * Returns the authenticated user's id, or throws a clear error if no session
 * is available. Use this when an insert/upsert payload needs the `user_id`
 * column populated. Reads/updates/deletes do NOT need this — they are scoped
 * by Row Level Security.
 */
export async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const user = data.user;
  if (!user) {
    throw new Error('No authenticated Supabase user. Sign in before calling this repository.');
  }
  return user.id;
}
