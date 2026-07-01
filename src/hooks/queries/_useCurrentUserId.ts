import { useEffect, useState } from 'react';
import { getCurrentUser, onAuthChange } from '@/lib/auth';

/**
 * Tracks the currently authenticated Supabase user id, or null when signed out.
 * Used as part of every query key so caches are scoped per-user and refetch
 * when the user changes.
 */
export function useCurrentUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getCurrentUser()
      .then((user) => {
        if (!cancelled) setUserId(user?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) setUserId(null);
      });

    const unsubscribe = onAuthChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return userId;
}
