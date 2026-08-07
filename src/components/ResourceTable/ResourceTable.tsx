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
}

const ESTIMATED_ROW_HEIGHT = 57

export function ResourceTable({ resources, isSelected, onToggle }: ResourceTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: resources.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 8,
  })

  return (
    <div role="table" className="overflow-x-auto rounded-lg border border-border">
      <div className="min-w-[640px]">
        {/*
         * Virtualized with @tanstack/react-virtual: today's seed dataset is
         * only ~15 rows, so this buys nothing yet — it's wired up ahead of
         * need. If this ever backs a real cloud inventory (thousands of
         * resources from a paginated/streamed API), only the rows actually
         * scrolled into view get mounted, so the DOM and render cost stay
         * flat instead of growing with the dataset.
         *
         * The header row lives inside this same scrollable element (sticky,
         * not a sibling above it) so it's always exactly as wide as the
         * rows — a header outside the scroll container ends up narrower
         * than the rows by the scrollbar's width whenever it's visible,
         * which throws off column alignment.
         */}
        <div ref={scrollRef} role="rowgroup" className="max-h-[600px] overflow-y-auto">
          <div
            role="row"
            className="sticky top-0 z-10 flex border-b border-border bg-muted text-left text-[10px] text-muted-foreground uppercase"
          >
            <div role="columnheader" className={cn('px-3 py-2.5', COLUMN_WIDTHS.checkbox)} />
            <div role="columnheader" className={cn('px-3 py-2.5 font-medium', COLUMN_WIDTHS.name)}>
              Name
            </div>
            <div role="columnheader" className={cn('px-3 py-2.5 font-medium', COLUMN_WIDTHS.type)}>
              Type
            </div>
            <div role="columnheader" className={cn('px-3 py-2.5 font-medium', COLUMN_WIDTHS.provider)}>
              Provider
            </div>
            <div role="columnheader" className={cn('px-3 py-2.5 font-medium', COLUMN_WIDTHS.region)}>
              Region
            </div>
            <div role="columnheader" className={cn('px-3 py-2.5 font-medium', COLUMN_WIDTHS.environment)}>
              Environment
            </div>
            <div role="columnheader" className={cn('px-3 py-2.5 font-medium', COLUMN_WIDTHS.criticality)}>
              Criticality
            </div>
            <div role="columnheader" className={cn('px-3 py-2.5 text-right font-medium', COLUMN_WIDTHS.openIssues)}>
              Open issues
            </div>
          </div>

          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
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
                  <ResourceRow resource={resource} selected={isSelected(resource.id)} onToggle={onToggle} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
