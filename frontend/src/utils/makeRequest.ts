import type { MakeRequestFunction } from '../types/api';

export const makeRequest: MakeRequestFunction = async (url, options) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error in the request');
  }

  return response.json();
};
