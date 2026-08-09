import { useCallback, useMemo, useState } from 'react'

export function useSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const clear = useCallback(() => setSelectedIds(new Set()), [])

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds])

  const selectedArray = useMemo(() => Array.from(selectedIds), [selectedIds])

  return {
    selectedIds,
    selectedArray,
    toggle,
    clear,
    isSelected,
    size: selectedIds.size,
  }
}
