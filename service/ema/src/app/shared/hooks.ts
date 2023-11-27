'use client';

import { useState } from 'react';

export function useMutation<Req, Res>(
  fetcher: (req: Req) => Promise<Res>,
  onSuccess: (res: Res) => void,
): [boolean, Error | undefined, (arg: Req) => Promise<void>] {
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const trigger = async (arg: Req) => {
    setFetching(true);
    setError(undefined);
    try {
      const res = await fetcher(arg);
      onSuccess(res);
    } catch (e) {
      setError(e as Error);
    } finally {
      setFetching(false);
    }
  };
  return [fetching, error, trigger];
}
