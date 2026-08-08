import { describe, expect, it } from 'vitest'
import { defaultFilterCriteria, filterResources } from '@/lib/filter'
import type { Resource } from '@/types'

const resources: Resource[] = [
  {
    id: 'r-1',
    name: 'payments-api-prod',
    type: 'EC2 Instance',
    provider: 'AWS',
    region: 'us-east-1',
    environment: 'production',
    criticality: 'critical',
    owner: 'payments',
    tags: ['pci'],
    openIssues: 4,
  },
  {
    id: 'r-2',
    name: 'analytics-warehouse',
    type: 'BigQuery Dataset',
    provider: 'GCP',
    region: 'us-central1',
    environment: 'production',
    criticality: 'medium',
    owner: 'data',
    tags: ['analytics'],
    openIssues: 0,
  },
  {
    id: 'r-3',
    name: 'dev-sandbox-db',
    type: 'Cosmos DB',
    provider: 'Azure',
    region: 'westeurope',
    environment: 'development',
    criticality: 'low',
    owner: 'platform',
    tags: [],
    openIssues: 0,
  },
]

describe('filterResources', () => {
  it('returns everything when criteria is default', () => {
    expect(filterResources(resources, defaultFilterCriteria)).toHaveLength(3)
  })

  it('matches search case-insensitively by name', () => {
    const result = filterResources(resources, { ...defaultFilterCriteria, search: 'PAYMENTS' })
    expect(result.map((r) => r.id)).toEqual(['r-1'])
  })

  it('only matches on name, not type or owner', () => {
    // 'platform' is r-3's owner and 'BigQuery' is r-2's type - neither
    // appears in any resource's name, so both should miss per the spec's
    // "search by name" requirement.
    expect(filterResources(resources, { ...defaultFilterCriteria, search: 'platform' })).toEqual([])
    expect(filterResources(resources, { ...defaultFilterCriteria, search: 'BigQuery' })).toEqual([])
  })

  it('filters by a single dimension (provider)', () => {
    const result = filterResources(resources, { ...defaultFilterCriteria, provider: 'GCP' })
    expect(result.map((r) => r.id)).toEqual(['r-2'])
  })

  it('combines multiple filter dimensions', () => {
    const result = filterResources(resources, {
      ...defaultFilterCriteria,
      environment: 'production',
      criticality: 'critical',
    })
    expect(result.map((r) => r.id)).toEqual(['r-1'])
  })

  it('returns an empty array when nothing matches', () => {
    const result = filterResources(resources, { ...defaultFilterCriteria, search: 'nonexistent' })
    expect(result).toEqual([])
  })
})
