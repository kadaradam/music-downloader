'use client';

import ChangeThemeButton from './ChangeThemeButton';

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChangeThemeButton />
      {children}
    </>
  );
}
