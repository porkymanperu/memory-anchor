import type { UserGoal } from '@/lib/types';
import { deleteGoal, listGoals, upsertGoal } from '@/lib/repository';
import { useArrayKV, type Updater } from './_kvHelpers';

export function useUserGoalsKV(): readonly [
  UserGoal[],
  (next: Updater<UserGoal[]>) => void,
] {
  return useArrayKV<UserGoal>({
    queryKey: (userId) => ['user-goals', userId],
    list: listGoals,
    getId: (goal) => goal.id,
    upsertItems: async (goals) => {
      for (const goal of goals) {
        await upsertGoal(goal);
      }
    },
    removeItem: deleteGoal,
    defaultValue: [],
  });
}
