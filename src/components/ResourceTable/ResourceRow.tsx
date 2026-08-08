import { memo } from 'react'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge/Badge.tsx'
import { Checkbox } from '@/components/ui/Checkbox/Checkbox.tsx'
import { Tooltip } from '@/components/ui/Tooltip/Tooltip.tsx'
import { HighlightedText } from '@/components/HighlightedText/HighlightedText.tsx'
import { COLUMN_WIDTHS, NAME_COLUMN_WIDTH } from '@/constants/resourceColumns.ts'
import { criticalityBadgeVariant, providerColor } from '@/lib/display.ts'
import { cn } from '@/lib/utils.ts'
import type { Resource } from '@/types'

interface ResourceRowProps {
  resource: Resource
  selected: boolean
  onToggle: (id: string) => void
  searchQuery: string
}

export const ResourceRow = memo(function ResourceRow({ resource, selected, onToggle, searchQuery }: ResourceRowProps) {
  return (
    <div
      role="row"
      className="flex items-center border-b border-border bg-gray-50 hover:bg-amber-50 text-sm"
    >
      <div role="cell" className={cn('px-3 py-2.5', COLUMN_WIDTHS.checkbox)}>
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggle(resource.id)}
          aria-label={`Select ${resource.name}`}
        />
      </div>
      <div role="cell" className={cn('px-3 py-2.5', COLUMN_WIDTHS.name)}>
        <Tooltip
          content={
            <span className="flex flex-col gap-0.5">
              <span>{resource.name}</span>
            </span>
          }
          triggerClassName={cn('block truncate font-medium text-foreground', NAME_COLUMN_WIDTH)}
        >
          <HighlightedText text={resource.name} query={searchQuery} />
        </Tooltip>
        <div className={cn('truncate text-xs text-muted-foreground', NAME_COLUMN_WIDTH)}>{resource.owner}</div>
      </div>
      <div role="cell" className={cn('truncate px-3 py-2.5 text-muted-foreground', COLUMN_WIDTHS.type)}>
        {resource.type}
      </div>
      <div role="cell" className={cn('px-3 py-2.5', COLUMN_WIDTHS.provider)}>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: providerColor(resource.provider) }}
            aria-hidden
          />
          {resource.provider}
        </span>
      </div>
      <div role="cell" className={cn('truncate px-3 py-2.5 text-muted-foreground', COLUMN_WIDTHS.region)}>
        {resource.region}
      </div>
      <div role="cell" className={cn('px-3 py-2.5 text-muted-foreground capitalize', COLUMN_WIDTHS.environment)}>
        {resource.environment}
      </div>
      <div role="cell" className={cn('px-3 py-2.5', COLUMN_WIDTHS.criticality)}>
        <Badge variant={criticalityBadgeVariant(resource.criticality)}>{resource.criticality}</Badge>
      </div>
      <div role="cell" className={cn('px-3 py-2.5', COLUMN_WIDTHS.openIssues)}>
        {resource.openIssues > 0 ? (
          <span className="inline-flex items-center justify-end gap-1 text-foreground">
            <AlertCircle className="size-3.5 text-criticality-high" />
            {resource.openIssues}
          </span>
        ) : (
          <span className="text-muted-foreground"></span>
        )}
      </div>
    </div>
  )
})
