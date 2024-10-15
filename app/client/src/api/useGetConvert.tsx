import { axiosService } from '@/services/axios';
import { ConvertJob } from '@/types/ConvertJob';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

export function useGetConvert(fileId: string) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ConvertJob | null>(null);
  const [status, setStatus] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    (async () => {
      try {
        const response = await axiosService.get(`/convert/${fileId}`, {
          signal,
        });

        const status = response.status;

        setStatus(status);

        if (status === 200) {
          setData(response.data);
          setLoading(false);
        } else {
          console.error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setStatus(error.status || 0);
        }

        if (!axios.isCancel(error)) {
          console.error(error);
        }
      }
    })();

    return () => {
      // Cancel the request when the component unmounts
      controller.abort();
    };
  }, [fileId]);

  return { loading, data, status };
}
