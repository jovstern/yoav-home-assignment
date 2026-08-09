import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ResourceRow } from '@/components/ResourceTable/ResourceRow.tsx'
import { COLUMN_WIDTHS } from '@/constants/resourceColumns'
import { cn } from '@/lib/utils'
import type { Resource } from '@/types'

interface ResourceTableProps {
  resources: Resource[]
  isSelected: (id: string) => boolean
  onToggle: (id: string) => void
  searchQuery: string
}

const ESTIMATED_ROW_HEIGHT = 57

export function ResourceTable({
  resources,
  isSelected,
  onToggle,
  searchQuery,
}: ResourceTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: resources.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 8,
  })

  return (
    <div role="table" className="border-border overflow-x-auto rounded-lg border">
      <div className="min-w-[640px]">
        <div ref={scrollRef} className="max-h-[600px] overflow-y-auto">
          <div role="rowgroup" className="sticky top-0 z-10">
            <div
              role="row"
              className="border-border bg-muted text-muted-foreground flex border-b text-left text-[10px] uppercase"
            >
              <div role="columnheader" className={cn('px-3 py-2.5', COLUMN_WIDTHS.checkbox)} />
              <div
                role="columnheader"
                className={cn('px-3 py-2.5 font-medium', COLUMN_WIDTHS.name)}
              >
                Name
              </div>
              <div
                role="columnheader"
                className={cn('px-3 py-2.5 font-medium', COLUMN_WIDTHS.type)}
              >
                Type
              </div>
              <div
                role="columnheader"
                className={cn('px-3 py-2.5 font-medium', COLUMN_WIDTHS.provider)}
              >
                Provider
              </div>
              <div
                role="columnheader"
                className={cn('px-3 py-2.5 font-medium', COLUMN_WIDTHS.region)}
              >
                Region
              </div>
              <div
                role="columnheader"
                className={cn('px-3 py-2.5 font-medium', COLUMN_WIDTHS.environment)}
              >
                Environment
              </div>
              <div
                role="columnheader"
                className={cn('px-3 py-2.5 font-medium', COLUMN_WIDTHS.criticality)}
              >
                Criticality
              </div>
              <div
                role="columnheader"
                className={cn('px-3 py-2.5 text-right font-medium', COLUMN_WIDTHS.openIssues)}
              >
                Open issues
              </div>
            </div>
          </div>

          <div role="rowgroup" style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const resource = resources[virtualRow.index]
              return (
                <div
                  key={resource.id}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <ResourceRow
                    resource={resource}
                    selected={isSelected(resource.id)}
                    onToggle={onToggle}
                    searchQuery={searchQuery}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
