import type { Criticality, Provider } from '@/types'

const CRITICALITY_BADGE_VARIANT: Record<Criticality, string> = {
  low: 'criticalityLow',
  medium: 'criticalityMedium',
  high: 'criticalityHigh',
  critical: 'criticalityCritical',
}

export function criticalityBadgeVariant(criticality: Criticality) {
  return CRITICALITY_BADGE_VARIANT[criticality] as
    | 'criticalityLow'
    | 'criticalityMedium'
    | 'criticalityHigh'
    | 'criticalityCritical'
}

const PROVIDER_COLOR: Record<Provider, string> = {
  AWS: 'var(--color-provider-aws)',
  GCP: 'var(--color-provider-gcp)',
  Azure: 'var(--color-provider-azure)',
}

export function providerColor(provider: Provider) {
  return PROVIDER_COLOR[provider]
}

const CRITICALITY_COLOR: Record<Criticality, string> = {
  low: 'var(--color-criticality-low)',
  medium: 'var(--color-criticality-medium)',
  high: 'var(--color-criticality-high)',
  critical: 'var(--color-criticality-critical)',
}

export function criticalityColor(criticality: Criticality) {
  return CRITICALITY_COLOR[criticality]
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
