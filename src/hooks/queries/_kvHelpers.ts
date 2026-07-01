import { useCallback, useMemo } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCurrentUserId } from './_useCurrentUserId';

export type Updater<T> = T | ((prev: T) => T);

// Shared stable reference for empty-array defaults so that components which
// destructure an array-shaped KV value while the query is still loading don't
// receive a fresh `[]` on every render (which would invalidate downstream
// `useMemo` / `useEffect` deps and trigger unnecessary work or render loops).
const EMPTY_ARRAY: readonly never[] = Object.freeze([]) as readonly never[];

interface ArrayKVConfig<T> {
  queryKey: (userId: string | null) => QueryKey;
  list: () => Promise<T[]>;
  getId: (item: T) => string;
  upsertItems: (items: T[]) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  defaultValue: T[];
}

/**
 * Backs an array-shaped `useKV<T[]>` call site with TanStack Query.
 *
 * The setter computes a diff between the previous cached array and the new
 * array (by `getId`) and dispatches the minimal upserts + deletes through the
 * provided repository helpers. Optimistic update: the cache is updated
 * immediately and rolled back if the mutation fails.
 *
 * The diff is computed in `setValue` (BEFORE `onMutate` runs) so the
 * mutationFn receives a fully resolved plan. Doing the diff inside
 * `mutationFn` would read the cache *after* `onMutate` overwrote it with the
 * optimistic value, making every diff empty and silently skipping every write.
 */
export function useArrayKV<T>(
  config: ArrayKVConfig<T>,
): readonly [T[], (next: Updater<T[]>) => void] {
  const userId = useCurrentUserId();
  const queryClient = useQueryClient();
  const key = useMemo(() => config.queryKey(userId), [config, userId]);

  const query = useQuery<T[]>({
    queryKey: key,
    queryFn: config.list,
    enabled: !!userId,
    initialData: undefined,
  });

  interface MutationVars {
    next: T[];
    toUpsert: T[];
    toDelete: string[];
  }

  const mutation = useMutation<void, Error, MutationVars, { previous: T[] | undefined }>({
    mutationFn: async ({ toUpsert, toDelete }) => {
      if (toUpsert.length > 0) await config.upsertItems(toUpsert);
      await Promise.all(toDelete.map((id) => config.removeItem(id)));
    },
    onMutate: async ({ next }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<T[]>(key);
      queryClient.setQueryData<T[]>(key, next);
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData<T[]>(key, ctx.previous);
      }
      // eslint-disable-next-line no-console
      console.error('[useArrayKV] mutation failed', { key, error: err });
      const message = err instanceof Error ? err.message : 'Could not save changes.';
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  const value: T[] =
    query.data ??
    (config.defaultValue.length === 0
      ? (EMPTY_ARRAY as unknown as T[])
      : config.defaultValue);

  const setValue = useCallback(
    (next: Updater<T[]>) => {
      const resolved =
        typeof next === 'function'
          ? (next as (prev: T[]) => T[])(value)
          : next;

      // Compute the upsert/delete plan against the CURRENT cache, before the
      // optimistic update replaces it.
      const previous = queryClient.getQueryData<T[]>(key) ?? value;
      const prevIds = new Set(previous.map(config.getId));
      const nextIds = new Set(resolved.map(config.getId));

      const toUpsert = resolved.filter((item) => {
        const id = config.getId(item);
        if (!prevIds.has(id)) return true;
        const before = previous.find((p) => config.getId(p) === id);
        return JSON.stringify(before) !== JSON.stringify(item);
      });
      const toDelete = previous
        .map(config.getId)
        .filter((id) => !nextIds.has(id));

      mutation.mutate({ next: resolved, toUpsert, toDelete });
    },
    [mutation, value, queryClient, key, config],
  );

  return [value, setValue] as const;
}

interface SingletonKVConfig<T> {
  queryKey: (userId: string | null) => QueryKey;
  fetch: () => Promise<T | null>;
  write: (value: T) => Promise<void>;
  defaultValue: T;
}

/**
 * Backs a singleton-shaped `useKV<T>` call site with TanStack Query.
 * `defaultValue` is returned both while loading and when the row is null.
 */
export function useSingletonKV<T>(
  config: SingletonKVConfig<T>,
): readonly [T, (next: Updater<T>) => void] {
  const userId = useCurrentUserId();
  const queryClient = useQueryClient();
  const key = useMemo(() => config.queryKey(userId), [config, userId]);

  const query = useQuery<T | null>({
    queryKey: key,
    queryFn: config.fetch,
    enabled: !!userId,
  });

  const mutation = useMutation<void, Error, T, { previous: T | null | undefined }>({
    mutationFn: (nextValue) => config.write(nextValue),
    onMutate: async (nextValue) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<T | null>(key);
      queryClient.setQueryData<T | null>(key, nextValue);
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData<T | null>(key, ctx.previous);
      }
      // eslint-disable-next-line no-console
      console.error('[useSingletonKV] mutation failed', { key, error: err });
      const message = err instanceof Error ? err.message : 'Could not save changes.';
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  const value: T = query.data ?? config.defaultValue;

  const setValue = useCallback(
    (next: Updater<T>) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(value) : next;
      mutation.mutate(resolved);
    },
    [mutation, value],
  );

  return [value, setValue] as const;
}
