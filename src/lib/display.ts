import type { Criticality, Provider } from '@/types'

const CRITICALITY_BADGE_VARIANT: Record<Criticality, string> = {
  low: 'criticalityLow',
  medium: 'criticalityMedium',
  high: 'criticalityHigh',
  critical: 'criticalityCritical',
}

export function criticalityBadgeVariant(criticality: Criticality) {
  return CRITICALITY_BADGE_VARIANT[criticality] as
    'criticalityLow' | 'criticalityMedium' | 'criticalityHigh' | 'criticalityCritical'
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

export interface TextSegment {
  text: string
  matched: boolean
}

export function splitByMatch(text: string, query: string): TextSegment[] {
  const trimmed = query.trim()
  if (!trimmed) return [{ text, matched: false }]

  const index = text.toLowerCase().indexOf(trimmed.toLowerCase())
  if (index === -1) return [{ text, matched: false }]

  const segments: TextSegment[] = []
  if (index > 0) segments.push({ text: text.slice(0, index), matched: false })
  segments.push({ text: text.slice(index, index + trimmed.length), matched: true })
  if (index + trimmed.length < text.length) {
    segments.push({ text: text.slice(index + trimmed.length), matched: false })
  }
  return segments
}
