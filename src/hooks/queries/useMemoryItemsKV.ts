import type { MemoryItem } from '@/lib/types';
import {
  bulkUpsertMemoryItems,
  deleteMemoryItem,
  listMemoryItems,
} from '@/lib/repository';
import { useArrayKV, type Updater } from './_kvHelpers';

export function useMemoryItemsKV(
  defaultValue: MemoryItem[],
): readonly [MemoryItem[], (next: Updater<MemoryItem[]>) => void] {
  return useArrayKV<MemoryItem>({
    queryKey: (userId) => ['memory-items', userId],
    list: listMemoryItems,
    getId: (item) => item.id,
    upsertItems: bulkUpsertMemoryItems,
    removeItem: deleteMemoryItem,
    defaultValue,
  });
}
