import { axiosService } from '@/services/axios';
import { ConvertJob } from '@/types/ConvertJob';
import axios from 'axios';
import { useState, useEffect } from 'react';

type MutateProps = {
  onSuccess: (result: ConvertJob) => void;
};

export function usePostNewConvert() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ConvertJob | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const mutate = async (url: string, { onSuccess }: MutateProps) => {
    const controller = new AbortController();
    setAbortController(controller);
    const signal = controller.signal;

    setIsLoading(true);

    try {
      const response = await axiosService.post(
        '/convert/youtube',
        { url },
        {
          headers: { 'Content-Type': 'application/json' },
          signal,
        },
      );

      if (response.status === 200) {
        const result = response.data as ConvertJob;
        setData(result);
        onSuccess(result);
      } else {
        console.error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      abortController?.abort(); // Cancel the request if component unmounts
    };
  }, [abortController]);

  return { isLoading, data, mutate };
}
