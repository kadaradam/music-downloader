import { Card } from '@/components/ui/card';
import FailedConvertAlert from './FailedConvertAlert';
import ColoredStatus from '../../_general/ColoredStatus';
import { ConvertJob } from '@/types/ConvertJob';
import PlayableThumbnail from './PlayableThumbnail';
import RestoreButton from './RestoreButton';
import DownloadButton from './DownloadButton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ConvertJobCard({ item }: { item: ConvertJob }) {
  const status = item.status;
  const isPending = status === 'pending';
  const isFailed = status === 'failed';
  const isArchived = status === 'archived';
  const isCompleted = status === 'completed';

  const renderActionButton = () => {
    if (isFailed) {
      return <FailedConvertAlert />;
    }

    if (isArchived) {
      return <RestoreButton fileId={item.fileId} />;
    }

    if (isCompleted) {
      return <DownloadButton item={item} />;
    }

    if (isPending) {
      return (
        <div className="flex justify-center">
          <LoadingSpinner width={36} height={36} />
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="p-7 min-w-96 max-w-2xl">
      <div className="flex justify-between items-center gap-5 pb-6">
        <PlayableThumbnail item={item} />
        <h1 className="pb-6 text-2xl font-bold leading-8 break-words">
          {item.title}
        </h1>
      </div>
      <p className="text-lg">
        Status: <ColoredStatus status={status} />
      </p>
      <p className="text-lg">Type: {item.type}</p>
      <p className="text-lg">Source: YouTube</p>
      <div className="pt-6">{renderActionButton()}</div>
    </Card>
  );
}
