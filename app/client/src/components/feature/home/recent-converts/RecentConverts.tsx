import { Card } from '@/components/ui/card';
import RecentConvertItem from './RecentConvertItem';
import { useRecentConverts } from '@/hooks/useRecentConverts';

export default function RecentConverts() {
  const { data: recentConverts } = useRecentConverts();

  if (!recentConverts) {
    return null;
  }

  return (
    <Card className="xl:absolute lg:left-9 max-h-64 w-full max-w-96">
      <h1 className="pb-2 text-xl font-bold leading-8 p-4">
        Recent Conversions
      </h1>
      <div className="overflow-auto pb-4">
        {recentConverts.map((convertJob, index) => (
          <RecentConvertItem
            key={convertJob.id}
            item={convertJob}
            isLast={index === recentConverts.length - 1}
          />
        ))}
      </div>
    </Card>
  );
}
