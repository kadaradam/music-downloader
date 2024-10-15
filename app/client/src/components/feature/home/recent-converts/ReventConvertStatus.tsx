import { ConvertJob } from '@/types/ConvertJob';
import { clsx } from 'clsx';

// Data will be purged after 24 hours on the server
const FILE_STALE_TIME_IN_MS = 86400000;

export default function RecentConvertStatus({ item }: { item: ConvertJob }) {
  // Data can be stale in localStorage
  const isStale = item.finishedAt
    ? Date.now() - new Date(item.finishedAt).getTime() > FILE_STALE_TIME_IN_MS
    : false;

  const statusVariants: { [key: string]: string } = {
    completed: 'text-green-700',
    failed: 'text-red-700',
    pending: 'text-gray-500',
    archived: 'text-orange-500',
  };

  const status = isStale ? 'archived' : item.status;

  return <span className={clsx('text-4xl', statusVariants[status])}>•</span>;
}
