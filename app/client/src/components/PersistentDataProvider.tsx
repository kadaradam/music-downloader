import { ConvertJob } from '@/types/ConvertJob';
import { createContext, useContext, useEffect, useState } from 'react';

const RECENT_CONVERTS_KEY = 'recent_converts';

type PersistentDataContextType = {
  recentConverts: ConvertJob[];
  add: (convertJob: ConvertJob) => void;
  remove: (id: string) => void;
};

const AppContext = createContext<PersistentDataContextType>({
  recentConverts: [],
  add: () => {
    return null;
  },
  remove: () => {
    return null;
  },
});

export const usePersistentData = () => {
  const appContext = useContext(AppContext);

  return appContext;
};

export function PersistentDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [recentConverts, setRecentConverts] = useState<ConvertJob[]>([]);

  // Load from localStorage after component mounts on client
  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== 'undefined') {
      const storedConverts = localStorage.getItem(RECENT_CONVERTS_KEY);

      if (storedConverts) {
        try {
          setRecentConverts(JSON.parse(storedConverts));
        } catch (e) {
          console.error('Failed to parse recent converts from localStorage', e);
          localStorage.removeItem(RECENT_CONVERTS_KEY);
        }
      }
    }
  }, []);

  const add = (convertJob: ConvertJob) => {
    setRecentConverts((prev) => {
      if (typeof window === 'undefined') {
        return prev;
      }

      const itemExists = prev.find((item) => item.id === convertJob.id);
      let newConverts = prev;

      if (itemExists) {
        // Replace the existing item with the new one
        newConverts = prev.map((item) =>
          item.id === convertJob.id ? convertJob : item,
        );
      } else {
        newConverts = [convertJob, ...prev];
      }

      localStorage.setItem(RECENT_CONVERTS_KEY, JSON.stringify(newConverts));

      return newConverts;
    });
  };

  const remove = (id: string) => {
    setRecentConverts((prev) => {
      if (typeof window === 'undefined') {
        return prev;
      }

      const newConverts = prev.filter((item) => item.id !== id);
      localStorage.setItem(RECENT_CONVERTS_KEY, JSON.stringify(newConverts));

      return newConverts;
    });
  };

  // Prevent rendering until the component is mounted
  if (!isMounted) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        recentConverts,
        add,
        remove,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
