import type { Criticality, Environment, Provider, Resource } from '@/types'

export interface ResourceFilterCriteria {
  search: string
  provider: Provider | 'all'
  environment: Environment | 'all'
  criticality: Criticality | 'all'
}

export const defaultFilterCriteria: ResourceFilterCriteria = {
  search: '',
  provider: 'all',
  environment: 'all',
  criticality: 'all',
}

/**
 * Search spans name, type, and owner (a superset of the "search by name"
 * requirement) since matching only on name felt too narrow for a resource
 * inventory a real engineer would search by owning team or resource kind.
 */
export function filterResources(
  resources: Resource[],
  criteria: ResourceFilterCriteria,
): Resource[] {
  const query = criteria.search.trim().toLowerCase()

  return resources.filter((resource) => {
    if (criteria.provider !== 'all' && resource.provider !== criteria.provider) return false
    if (criteria.environment !== 'all' && resource.environment !== criteria.environment) return false
    if (criteria.criticality !== 'all' && resource.criticality !== criteria.criticality) return false

    if (query.length === 0) return true;

    return (
      resource.name.toLowerCase().includes(query) ||
      resource.type.toLowerCase().includes(query) ||
      resource.owner.toLowerCase().includes(query)
    )
  })
}
