import type { ReactNode } from 'react';

export function Main({ children }: { children: ReactNode }) {
  return (
    <main className='mx-auto flex w-full max-w-350 flex-1 flex-col gap-3 p-6'>{children}</main>
  );
}
