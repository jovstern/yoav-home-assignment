import type { ComponentPropsWithoutRef } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

function TabsList({ className, ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('border-border flex w-fit items-center border-b', className)}
      {...props}
    />
  )
}

function TabsTab({ className, ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'text-muted-foreground hover:text-primary data-[state=active]:border-primary data-[state=active]:text-primary flex items-center gap-1.5 rounded-t-md border-b-2 border-transparent px-3 py-2.5 text-sm font-medium transition-colors outline-none',
        className,
      )}
      {...props}
    />
  )
}

const TabsPanel = TabsPrimitive.Content

export { Tabs, TabsList, TabsTab, TabsPanel }
