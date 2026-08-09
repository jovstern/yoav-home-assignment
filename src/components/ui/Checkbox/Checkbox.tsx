import type { ComponentPropsWithoutRef } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'border-border bg-surface data-[state=checked]:border-primary data-[state=checked]:bg-primary focus-visible:ring-ring flex size-4 shrink-0 items-center justify-center rounded border focus-visible:ring-2 focus-visible:ring-offset-1',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="text-primary-foreground size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
