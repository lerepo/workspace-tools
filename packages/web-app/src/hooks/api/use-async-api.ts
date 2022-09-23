// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

export type Status = 'idle' | 'pending' | 'success' | 'error';

export const useAsyncApi = (
  url: string,
  options?: AxiosRequestConfig,
  immediate = true
): {
  execute: () => Promise<void>;
  status: Status;
  data: unknown;
  error: unknown;
} => {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState<unknown | null>(null);

  // The execute function wraps axios and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, unless url or options change.
  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const res = await axios(url, options);
      setData(res.data);
      setStatus('success');
      return;
    } catch (err) {
      setError(err);
      setStatus('error');
    }
  }, [options, url]);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
};
