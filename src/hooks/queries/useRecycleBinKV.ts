import type { DeletedMemoryItem } from '@/lib/types';
import {
  addToRecycleBin,
  listRecycleBin,
  removeFromRecycleBin,
} from '@/lib/repository';
import { useArrayKV, type Updater } from './_kvHelpers';

export function useRecycleBinKV(): readonly [
  DeletedMemoryItem[],
  (next: Updater<DeletedMemoryItem[]>) => void,
] {
  return useArrayKV<DeletedMemoryItem>({
    queryKey: (userId) => ['recycle-bin', userId],
    list: listRecycleBin,
    getId: (entry) => entry.item.id,
    upsertItems: async (entries) => {
      // No bulk helper available; serial upserts keep order deterministic.
      for (const entry of entries) {
        await addToRecycleBin(entry);
      }
    },
    removeItem: removeFromRecycleBin,
    defaultValue: [],
  });
}
