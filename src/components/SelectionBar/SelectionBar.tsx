import { Layers } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'

interface SelectionBarProps {
  count: number
  onClear: () => void
  onCreateApplication: () => void
}

export function SelectionBar({ count, onClear, onCreateApplication }: SelectionBarProps) {
  if (count === 0) return null

  return (
    <div className="border-border bg-surface sticky bottom-4 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 shadow-lg">
      <span className="flex items-center gap-2 text-sm font-medium">
        <Layers className="text-primary size-4" />
        {count} resource{count === 1 ? '' : 's'} selected
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onClear}>
          Cancel
        </Button>
        <Button size="sm" onClick={onCreateApplication}>
          Create Application
        </Button>
      </div>
    </div>
  )
}
