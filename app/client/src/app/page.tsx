'use client';
import { Card } from '@/components/ui/card';
import PostConvertForm from '@/components/feature/home/PostConvertForm';
import RecentConverts from '@/components/feature/home/recent-converts/RecentConverts';

export default function Home() {
  return (
    <>
      <Card className="p-7 min-w-96">
        <h1 className="pb-6 text-2xl font-bold leading-8">
          YouTube to MP3 Converter
        </h1>
        <div className="w-full max-w-sm items-center">
          <PostConvertForm />
        </div>
      </Card>
      <RecentConverts />
    </>
  );
}
