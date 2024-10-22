import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { usePostNewConvert } from '@/api/usePostConvert';
import { validYouTubeUrlPattern } from '@/lib/utils';
import { useRecentConverts } from '@/hooks/useRecentConverts';

const urlInputPattern = validYouTubeUrlPattern.toString().slice(1, -1);

export default function PostConvertForm() {
  const router = useRouter();
  const { isLoading, mutate: submit } = usePostNewConvert();
  const { add: addPersistentData } = useRecentConverts();

  async function onSubmit(formData: FormData) {
    const url = formData.get('url') as string;

    submit(url, {
      onSuccess: (convertJob) => {
        router.push(`/get/${convertJob.fileId}`);
        addPersistentData(convertJob);
      },
    });
  }

  return (
    <form action={onSubmit}>
      <Label htmlFor="url" className="pb-1">
        YouTube Video URL
      </Label>
      <Input
        id="url"
        name="url"
        className="w-full"
        placeholder="Enter YouTube Video URL"
        required
        pattern={urlInputPattern}
      />
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          isLoading={isLoading}
        >
          Start Generation
        </Button>
      </div>
    </form>
  );
}
