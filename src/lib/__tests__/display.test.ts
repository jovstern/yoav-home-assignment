import { describe, expect, it } from 'vitest'
import { splitByMatch } from '@/lib/display'

describe('splitByMatch', () => {
  it('returns the whole text unmatched when the query is empty', () => {
    expect(splitByMatch('payments-api-prod', '')).toEqual([{ text: 'payments-api-prod', matched: false }])
  })

  it('returns the whole text unmatched when there is no match', () => {
    expect(splitByMatch('payments-api-prod', 'xyz')).toEqual([{ text: 'payments-api-prod', matched: false }])
  })

  it('splits around a match in the middle, preserving original casing', () => {
    expect(splitByMatch('payments-api-prod', 'API')).toEqual([
      { text: 'payments-', matched: false },
      { text: 'api', matched: true },
      { text: '-prod', matched: false },
    ])
  })

  it('omits the leading/trailing segment when the match is at an edge', () => {
    expect(splitByMatch('payments-api-prod', 'payments')).toEqual([
      { text: 'payments', matched: true },
      { text: '-api-prod', matched: false },
    ])
    expect(splitByMatch('payments-api-prod', 'prod')).toEqual([
      { text: 'payments-api-', matched: false },
      { text: 'prod', matched: true },
    ])
  })
})
