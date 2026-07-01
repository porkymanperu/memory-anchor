import type { StoredCategory } from '@/lib/types';
import {
  deleteCustomCategory,
  listCustomCategories,
  upsertCustomCategory,
} from '@/lib/repository';
import { useArrayKV, type Updater } from './_kvHelpers';

export function useCustomCategoriesKV(): readonly [
  StoredCategory[],
  (next: Updater<StoredCategory[]>) => void,
] {
  return useArrayKV<StoredCategory>({
    queryKey: (userId) => ['custom-categories', userId],
    list: listCustomCategories,
    getId: (cat) => cat.id,
    upsertItems: async (cats) => {
      for (const cat of cats) {
        await upsertCustomCategory(cat);
      }
    },
    removeItem: deleteCustomCategory,
    defaultValue: [],
  });
}
