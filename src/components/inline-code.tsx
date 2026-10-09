import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function InlineCode({ className, ...props }: ComponentProps<'code'>) {
  return (
    <code className={cn('rounded bg-muted px-1 py-0.5 font-mono text-xs', className)} {...props} />
  );
}
