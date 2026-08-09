import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="border-border flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
      <Icon className="text-muted-foreground size-8" />
      <p className="text-foreground text-sm font-medium">{title}</p>
      <p className="text-muted-foreground max-w-xs text-sm">{description}</p>
    </div>
  )
}
