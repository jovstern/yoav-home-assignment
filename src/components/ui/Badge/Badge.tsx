import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-transparent px-2 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-muted text-foreground',
        outline: 'border-border text-muted-foreground',
        criticalityLow: 'bg-criticality-low/10 text-criticality-low',
        criticalityMedium: 'bg-criticality-medium/10 text-criticality-medium',
        criticalityHigh: 'bg-criticality-high/10 text-criticality-high',
        criticalityCritical: 'bg-criticality-critical/10 text-criticality-critical',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
