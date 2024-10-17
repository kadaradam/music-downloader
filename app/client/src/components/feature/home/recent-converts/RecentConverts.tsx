import { usePersistentData } from '@/components/PersistentDataProvider';
import { Card } from '@/components/ui/card';
import RecentConvertItem from './RecentConvertItem';

export default function RecentConverts() {
  const { recentConverts: data } = usePersistentData();

  /* 
    Filter out created at 5 seconds ago, to avoid 
    displaying the new conversion, before navigating to the get page
   */
  const recentConverts = data.filter(
    (convertJob) =>
      Date.now() - new Date(convertJob.createdAt).getTime() > 5000,
  );

  if (!recentConverts.length) {
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
