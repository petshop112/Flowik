import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { buttonVariants } from './button-variants';
import type { ButtonVariantProps } from './button-variants';
import { cn } from '../../lib/utils';

type ButtonProps = React.ComponentProps<'button'> &
  ButtonVariantProps & {
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
