'use client';

import ChangeThemeButton from './ChangeThemeButton';
import { PersistentDataProvider } from './PersistentDataProvider';

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <PersistentDataProvider>
      <ChangeThemeButton />
      {children}
    </PersistentDataProvider>
  );
}
