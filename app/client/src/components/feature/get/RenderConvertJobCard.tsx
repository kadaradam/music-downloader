'use client';
import { useSubscribeWsFileEvents } from '@/api/useSubscribeWsFileEvents';
import { useGetConvert } from '@/api/useGetConvert';
import { Skeleton } from '@/components/ui/skeleton';
import ConvertJobCard from './convert-job-card/ConvertJobCard';
import { useGetPageContext } from './GetPageContext';
import { useEffect } from 'react';
import NotFound from '@/app/not-found';
import { usePersistentData } from '@/components/PersistentDataProvider';

export default function RenderConvertJobCard({ fileId }: { fileId: string }) {
  const { convertJob, setConvertJob } = useGetPageContext();
  const { loading, data: result, status: resultStatus } = useGetConvert(fileId);
  const { add: addPersistentData } = usePersistentData();
  const status = convertJob?.status;
  const isPending = status === 'pending';

  const { close } = useSubscribeWsFileEvents({
    fileId,
    enabled: isPending,
    onMessage: (event) => {
      // Listen for only completed or failed events
      if (!event.status || event.status === 'pending') {
        return;
      }

      setConvertJob(event);
      addPersistentData(event);

      close();
    },
  });

  useEffect(() => {
    if (result) {
      setConvertJob(result);
    }
  }, [result, setConvertJob]);

  if (resultStatus === 404) {
    return <NotFound />;
  }

  if (loading || !convertJob) {
    return <Skeleton className="rounded-xl min-w-96 max-w-2xl h-[256px]" />;
  }

  return <ConvertJobCard item={convertJob} />;
}
