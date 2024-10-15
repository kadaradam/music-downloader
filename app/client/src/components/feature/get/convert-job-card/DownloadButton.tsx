import { Button } from '@/components/ui/button';
import { ConvertJob } from '@/types/ConvertJob';

export default function DownloadButton({
  item: { fileId, status },
}: {
  item: ConvertJob;
}) {
  const isPending = status === 'pending';

  const handleDownload = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/convert/${fileId}/download`;
  };

  return (
    <Button
      onClick={handleDownload}
      className="w-full"
      disabled={isPending}
      isLoading={isPending}
    >
      Download
    </Button>
  );
}
