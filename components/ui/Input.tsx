import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'h-12 w-full rounded-md border bg-[--color-surface] px-4 text-base text-[--color-ink] placeholder:text-[--color-ink-muted] transition-colors focus:border-[--color-primary] focus:shadow-sm focus-visible:outline-none disabled:opacity-50',
          error
            ? 'border-[--color-danger] focus:border-[--color-danger]'
            : 'border-[--color-border]',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
