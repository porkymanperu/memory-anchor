import type { UserProgress } from '@/lib/types';
import { getUserProgress, upsertUserProgress } from '@/lib/repository';
import { useSingletonKV, type Updater } from './_kvHelpers';

/**
 * Note: per the repository's Option 1 contract, calling the setter does NOT
 * persist `userProgress.sessions`. New sessions must be written through
 * `insertSession()` from '@/lib/repository' so the relational table is
 * authoritative. The setter still updates the local cached `sessions` array
 * for an instant UI response.
 */
export function useUserProgressKV(
  defaultValue: UserProgress,
): readonly [UserProgress, (next: Updater<UserProgress>) => void] {
  return useSingletonKV<UserProgress>({
    queryKey: (userId) => ['user-progress', userId],
    fetch: getUserProgress,
    write: upsertUserProgress,
    defaultValue,
  });
}
