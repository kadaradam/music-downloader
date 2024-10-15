'use client';
import ConvertNewAlert from '@/components/feature/get/ConvertNewAlert';
import { GetPageContextProvider } from '@/components/feature/get/GetPageContext';
import RenderConvertJobCard from '@/components/feature/get/RenderConvertJobCard';

export default function Page({ params }: { params: { slug: string } }) {
  const { slug: fileId } = params;

  return (
    <GetPageContextProvider>
      <RenderConvertJobCard fileId={fileId} />
      <ConvertNewAlert />
    </GetPageContextProvider>
  );
}
