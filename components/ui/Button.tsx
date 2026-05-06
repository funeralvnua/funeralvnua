import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-45 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-[--color-primary] text-[--color-bg] hover:bg-[--color-primary-700]',
        accent: 'bg-[--color-accent] text-[--color-bg] hover:bg-[--color-accent-700]',
        outline:
          'border border-[--color-accent]/60 text-[--color-accent] bg-transparent hover:bg-[--color-accent-100] hover:border-[--color-accent]',
        ghost: 'text-[--color-accent] hover:bg-[--color-accent-100]',
        emergency: 'bg-[--color-emergency] text-white hover:opacity-90',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-base',
        lg: 'h-12 px-6 text-base md:text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);

Button.displayName = 'Button';

export { buttonVariants };
