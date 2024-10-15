import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export default function FailedConvertAlert() {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Failed to convert</AlertTitle>
      <AlertDescription>
        An error occurred while converting the video.
      </AlertDescription>
    </Alert>
  );
}
