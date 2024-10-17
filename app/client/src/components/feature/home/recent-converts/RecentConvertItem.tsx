import { Separator } from '@/components/ui/separator';
import { ConvertJob } from '@/types/ConvertJob';
import RecentConvertStatus from './ReventConvertStatus';
import { prettyDate } from '@/lib/utils';
import Link from 'next/link';

export default function RecentConvertItem({
  item,
  isLast,
}: {
  item: ConvertJob;
  isLast: boolean;
}) {
  return (
    <Link href={`/get/${item.fileId}`}>
      <div className="flex flex-row items-center gap-2 hover:bg-muted/50 px-4">
        <p className="text-base truncate max-w-64">{item.title} </p>
        <span className="text-xs">{prettyDate(new Date(item.createdAt))}</span>
        <RecentConvertStatus item={item} />
      </div>
      {!isLast ? (
        <div className="px-4">
          <Separator className="my-1" />{' '}
        </div>
      ) : null}
    </Link>
  );
}
