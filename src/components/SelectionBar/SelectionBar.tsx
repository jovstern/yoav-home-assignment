import { Layers, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { Tooltip } from '@/components/ui/Tooltip/Tooltip'

interface SelectionBarProps {
  count: number
  onClear: () => void
  onCreateApplication: () => void
}

export function SelectionBar({ count, onClear, onCreateApplication }: SelectionBarProps) {
  if (count === 0) return null

  return (
    <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-lg">
      <span className="flex items-center gap-2 text-sm font-medium">
        <Layers className="size-4 text-primary" />
        {count} resource{count === 1 ? '' : 's'} selected
      </span>
      <div className="flex items-center gap-2">
        <Tooltip content="Clear selection">
          <Button variant="outline" size="icon" className="size-9" onClick={onClear} aria-label="Clear selection">
            <Trash2 />
          </Button>
        </Tooltip>
        <Button size="sm" onClick={onCreateApplication}>
          Create Application
        </Button>
      </div>
    </div>
  )
}
