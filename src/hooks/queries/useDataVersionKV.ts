import { getDataVersion, setDataVersion } from '@/lib/repository';
import { useSingletonKV, type Updater } from './_kvHelpers';

export function useDataVersionKV(
  defaultValue: string,
): readonly [string, (next: Updater<string>) => void] {
  return useSingletonKV<string>({
    queryKey: (userId) => ['data-version', userId],
    fetch: getDataVersion,
    write: setDataVersion,
    defaultValue,
  });
}
