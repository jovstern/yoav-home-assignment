import { Boxes, ChevronRight } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip/Tooltip.tsx'
import { providerColor } from '@/lib/display.ts'
import type { Application, Resource } from '@/types'

interface ApplicationCardProps {
  application: Application
  members: Resource[]
  onSelect: (application: Application) => void
}

export function ApplicationCard({ application, members, onSelect }: ApplicationCardProps) {
  const providers = Array.from(new Set(members.map((resource) => resource.provider)))

  return (
    <button
      onClick={() => onSelect(application)}
      className="group flex h-36 flex-col items-start gap-2 overflow-hidden rounded-lg border border-border bg-surface p-4 text-left transition-shadow hover:shadow-md"
    >
      <div className="flex w-full items-start justify-between gap-2">
        <Tooltip content={application.name} triggerClassName="block truncate font-medium text-foreground">
          {application.name}
        </Tooltip>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>

      {application.description ? (
        <p className="line-clamp-2 text-sm text-muted-foreground">{application.description}</p>
      ) : null}

      <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Boxes className="size-3.5" />
          {members.length} resource{members.length === 1 ? '' : 's'}
        </span>
        <span className="flex items-center gap-1">
          {providers.map((provider) => (
            <span
              key={provider}
              className="size-2 rounded-full"
              style={{ backgroundColor: providerColor(provider) }}
              title={provider}
            />
          ))}
        </span>
      </div>
    </button>
  )
}
