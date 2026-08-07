import type { ReactNode } from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function Drawer({ open, onOpenChange, title, description, children, className }: DrawerProps) {
  return (
    <DrawerPrimitive.Root open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-[1px]" />
        <DrawerPrimitive.Content
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col overflow-x-hidden overflow-y-auto border-l border-border bg-surface shadow-xl outline-none',
            className,
          )}
        >
          <div className="flex items-start justify-between gap-2 p-5 pb-0">
            <div className="min-w-0">
              <DrawerPrimitive.Title className="truncate text-base font-semibold text-foreground">
                {title}
              </DrawerPrimitive.Title>
              {description ? (
                <DrawerPrimitive.Description className="mt-1 text-sm text-muted-foreground">
                  {description}
                </DrawerPrimitive.Description>
              ) : (
                <DrawerPrimitive.Description className="sr-only">{title}</DrawerPrimitive.Description>
              )}
            </div>
            <DrawerPrimitive.Close
              aria-label="Close"
              className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </DrawerPrimitive.Close>
          </div>

          <div className="flex-1 p-5">{children}</div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  )
}
