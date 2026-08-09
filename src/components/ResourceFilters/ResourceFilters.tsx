import { useEffect, useState } from 'react'
import { Search, Trash2, X } from 'lucide-react'
import { Input } from '@/components/ui/Input/Input'
import { Select, SelectItem } from '@/components/ui/Select/Select'
import { Button } from '@/components/ui/Button/Button'
import { Tooltip } from '@/components/ui/Tooltip/Tooltip'
import { defaultFilterCriteria, type ResourceFilterCriteria } from '@/lib/filter'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { cn } from '@/lib/utils'
import type { Criticality, Environment, Provider } from '@/types'

const PROVIDERS: Provider[] = ['AWS', 'GCP', 'Azure']
const ENVIRONMENTS: Environment[] = ['production', 'staging', 'development']
const CRITICALITIES: Criticality[] = ['low', 'medium', 'high', 'critical']

interface ResourceFiltersProps {
  criteria: ResourceFilterCriteria
  onChange: (criteria: ResourceFilterCriteria) => void
  resultCount: number
  totalCount: number
}

export function ResourceFilters({
  criteria,
  onChange,
  resultCount,
  totalCount,
}: ResourceFiltersProps) {
  const [searchInput, setSearchInput] = useState(criteria.search)
  const debouncedSearch = useDebouncedValue(searchInput, 200)

  useEffect(() => {
    if (debouncedSearch !== criteria.search) {
      onChange({ ...criteria, search: debouncedSearch })
    }
  }, [debouncedSearch])

  const hasActiveFilters =
    criteria.search !== '' ||
    criteria.provider !== 'all' ||
    criteria.environment !== 'all' ||
    criteria.criticality !== 'all'

  const clearAll = () => {
    setSearchInput('')
    onChange(defaultFilterCriteria)
  }

  const clearSearch = () => {
    setSearchInput('')
    onChange({ ...criteria, search: '' })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative shrink-0 sm:w-64">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name…"
            aria-label="Search resources by name"
            className={cn('pl-8', searchInput && 'pr-8')}
          />
          {searchInput ? (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="flex grow flex-row gap-2">
          <Select
            aria-label="Filter by provider"
            value={criteria.provider}
            onValueChange={(value) =>
              onChange({ ...criteria, provider: value as ResourceFilterCriteria['provider'] })
            }
          >
            <SelectItem value="all">All providers</SelectItem>
            {PROVIDERS.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </Select>

          <Select
            aria-label="Filter by environment"
            value={criteria.environment}
            onValueChange={(value) =>
              onChange({
                ...criteria,
                environment: value as ResourceFilterCriteria['environment'],
              })
            }
          >
            <SelectItem value="all">All environments</SelectItem>
            {ENVIRONMENTS.map((environment) => (
              <SelectItem key={environment} value={environment}>
                {environment}
              </SelectItem>
            ))}
          </Select>

          <Select
            aria-label="Filter by criticality"
            value={criteria.criticality}
            onValueChange={(value) =>
              onChange({
                ...criteria,
                criticality: value as ResourceFilterCriteria['criticality'],
              })
            }
          >
            <SelectItem value="all">All criticalities</SelectItem>
            {CRITICALITIES.map((criticality) => (
              <SelectItem key={criticality} value={criticality}>
                {criticality}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Tooltip content="Clear all filters">
          <Button
            variant="outline"
            size="icon"
            className="size-9"
            onClick={clearAll}
            disabled={!hasActiveFilters}
            aria-label="Clear all filters"
          >
            <Trash2 />
          </Button>
        </Tooltip>
      </div>

      <p className="shrink-0 text-sm text-gray-700">
        {resultCount} of {totalCount} resource{resultCount === 1 ? '' : 's'}
      </p>
    </div>
  )
}
