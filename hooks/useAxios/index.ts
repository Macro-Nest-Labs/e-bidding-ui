import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface UseAxiosReturn<T> {
  response: T | null;
  error: string | null;
  loading: boolean;
}

function useAxios<T = any>(
  url: string,
  options?: AxiosRequestConfig,
): UseAxiosReturn<T> {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: AxiosResponse<T> = await axios(url, options);
        setResponse(result.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { response, error, loading };
}

export default useAxios;
