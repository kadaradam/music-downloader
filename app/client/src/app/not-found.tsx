import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Card className="p-7 min-w-64">
      <div className="flex flex-col">
        <h2 className="text-xl mb-4">Oops! Not Found</h2>
        <p>The audio&apos;s on mute... 🔇</p>

        <Button asChild size="sm" className="mt-4">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </Card>
  );
}
