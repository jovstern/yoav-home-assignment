import { Tooltip } from '@/components/ui/Tooltip/Tooltip'
import { Badge } from '@/components/ui/Badge/Badge'
import { criticalityBadgeVariant } from '@/lib/display'
import { cn } from '@/lib/utils'
import type { Resource } from '@/types'

interface MemberRowProps {
  resource: Resource
  hovered: boolean
  onHoverChange: (resourceId: string | null) => void
}

export function MemberRow({ resource, hovered, onHoverChange }: MemberRowProps) {
  return (
    <li
      className={cn(
        '-mx-1.5 flex items-center justify-between gap-2 rounded-md px-1.5 py-0.5 text-sm transition-colors',
        hovered && 'bg-muted',
      )}
      onMouseEnter={() => onHoverChange(resource.id)}
      onMouseLeave={() => onHoverChange(null)}
    >
      <Tooltip
        content={
          <span className="flex flex-col gap-0.5">
            <span>{resource.name}</span>
            <span className="text-background/70">Owner: {resource.owner}</span>
          </span>
        }
        triggerClassName="block truncate"
      >
        {resource.name}
      </Tooltip>
      <span className="text-muted-foreground flex shrink-0 items-center gap-2 text-xs">
        {resource.type}
        <Badge variant={criticalityBadgeVariant(resource.criticality)}>
          {resource.criticality}
        </Badge>
      </span>
    </li>
  )
}
