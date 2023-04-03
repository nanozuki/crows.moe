'use client';

import { useEffect, useState } from 'react';

export function useMutation<Arg, Res>(
  fetcher: (arg: Arg) => Promise<Res>,
  onSuccess: (res: Res) => void
): [boolean, Error | undefined, (arg: Arg) => Promise<void>] {
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const trigger = async (arg: Arg) => {
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

export function useQuery<Arg, Res>(
  fetcher: (arg: Arg) => Promise<Res>,
  arg: Arg
): [Res | undefined, boolean, Error | undefined] {
  const [data, setData] = useState<Res | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  useEffect(() => {
    async function doQuery() {
      setLoading(true);
      try {
        const res = await fetcher(arg);
        setData(res);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }
    doQuery();
  }, [fetcher, arg]);
  return [data, loading, error];
}
