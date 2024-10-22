import { usePostRestoreConvert } from '@/api/usePostRestoreConvert';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { InfoCircledIcon, ReloadIcon } from '@radix-ui/react-icons';
import { useGetPageContext } from '../GetPageContext';
import { useRecentConverts } from '@/hooks/useRecentConverts';

export default function RestoreButton({ fileId }: { fileId: string }) {
  const { setConvertJob } = useGetPageContext();
  const { isLoading, mutate: submit } = usePostRestoreConvert();
  const { add: addPersistentData } = useRecentConverts();

  const handleRestore = () => {
    submit(fileId, {
      onSuccess: (convertJob) => {
        setConvertJob(convertJob);
        addPersistentData(convertJob);
      },
    });
  };

  return (
    <>
      <Alert variant="warning" className="mb-6">
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>File Archived</AlertTitle>
        <AlertDescription>
          Your file was archived. Click the button below to restore it.
        </AlertDescription>
      </Alert>
      <Button
        onClick={handleRestore}
        disabled={isLoading}
        isLoading={isLoading}
        className="w-full"
        variant="outline"
      >
        <ReloadIcon className="h-4 w-4 mr-2" />
        Restore File
      </Button>
    </>
  );
}
