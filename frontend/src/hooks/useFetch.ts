
import { useState, useEffect } from "react";

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error a la petición');
        const json =await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);
  return { data, loading, error }
}
