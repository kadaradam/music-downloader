import { ConvertJobStatus } from '@/types/ConvertJob';

export default function ColoredStatus({
  status,
}: {
  status: ConvertJobStatus;
}) {
  const statusVariants: { [key: string]: string } = {
    completed: 'text-green-700',
    failed: 'text-red-700',
    pending: 'text-gray-500',
    archived: 'text-orange-500',
  };

  return <span className={statusVariants[status]}>{status}</span>;
}
