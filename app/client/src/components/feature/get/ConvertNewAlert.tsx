import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ReloadIcon, LightningBoltIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function ConvertNewAlert() {
  return (
    <Alert className="absolute w-auto bottom-0 right-0 m-8 bg-background-secondary">
      <AlertDescription className="flex items-center">
        Convert Another Video?
        <LightningBoltIcon className="h-3 w-3 ml-2 text-yellow-500" />
        <Button variant="outline" size="icon" className="ml-4" asChild>
          <Link href="/">
            <ReloadIcon className="h-4 w-4" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
