import { ConvertJob } from '@/types/ConvertJob';
import { createContext, useContext, useState } from 'react';

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
  const [recentConverts, setRecentConverts] = useState<ConvertJob[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const recentConverts = localStorage.getItem(RECENT_CONVERTS_KEY);

    if (!recentConverts) {
      return [];
    }

    try {
      return JSON.parse(recentConverts);
    } catch (e) {
      console.error('Failed to parse recent converts from localStorage', e);
      localStorage.removeItem(RECENT_CONVERTS_KEY);
      return [];
    }
  });

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
