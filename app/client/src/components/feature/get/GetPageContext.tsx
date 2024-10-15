import { ConvertJob } from '@/types/ConvertJob';
import { createContext, useContext, useState } from 'react';

type PageContextType = {
  convertJob: ConvertJob | null;
  setConvertJob: React.Dispatch<ConvertJob>;
};

const AppContext = createContext<PageContextType>({
  convertJob: null,
  setConvertJob: () => {
    return null;
  },
});

export const useGetPageContext = () => {
  const appContext = useContext(AppContext);

  return appContext;
};

export function GetPageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [convertJob, setConvertJob] = useState<ConvertJob | null>(null);

  return (
    <AppContext.Provider
      value={{
        convertJob,
        setConvertJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
