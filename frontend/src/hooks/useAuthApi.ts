import { useState } from 'react';

export function useAuthApi(token: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async <T = unknown>(
    url: string,
    options: globalThis.RequestInit = {}
  ): Promise<T> => {
    if (!token) {
      throw new Error('No token found, access denied.');
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!res.ok) {
        let errorMessage = `Error ${res.status}`;

        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = res.statusText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      if (options.method === 'DELETE') {
        const text = await res.text();
        return (text ? JSON.parse(text) : {}) as T;
      }

      const json = await res.json();
      return json;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { makeRequest, loading, error };
}
