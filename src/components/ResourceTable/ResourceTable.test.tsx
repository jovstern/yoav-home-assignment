import { Profiler, type ProfilerOnRenderCallback } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'
import { ResourceTable } from '@/components/ResourceTable/ResourceTable'
import type { Resource } from '@/types'

function makeResources(count: number): Resource[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `resource-${index}`,
    name: `resource-${index}`,
    type: 'EC2 Instance',
    provider: 'AWS',
    region: 'us-east-1',
    environment: 'production',
    criticality: 'low',
    owner: 'ops',
    tags: [],
    openIssues: 0,
  }))
}

// jsdom reports 0 for every element's layout box. Left unmocked, the
// virtualizer would see a zero-height viewport and render nothing at all -
// not a meaningful test of "windowed, not full-list" rendering. A realistic
// viewport size here lets the assertions below exercise real windowing.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: 600,
  })
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: 800,
  })
})

function renderTable(resources: Resource[]) {
  const durations: number[] = []
  const onRender: ProfilerOnRenderCallback = (_id, _phase, actualDuration) => {
    durations.push(actualDuration)
  }

  render(
    <Profiler id="ResourceTable" onRender={onRender}>
      <ResourceTable
        resources={resources}
        isSelected={() => false}
        onToggle={() => {}}
        searchQuery=""
      />
    </Profiler>,
  )

  return { durations }
}

describe('ResourceTable efficiency', () => {
  it('keeps the rendered row count flat as the dataset grows (virtualization)', () => {
    renderTable(makeResources(1000))
    const rowsAt1000 = screen.getAllByRole('row').length
    cleanup()

    renderTable(makeResources(5000))
    const rowsAt5000 = screen.getAllByRole('row').length

    // A 5x larger dataset should not mount 5x more rows - only the
    // scrolled-into-view window (plus overscan) should ever be in the DOM.
    // If virtualization ever regresses to rendering the full list, this
    // count would grow in lockstep with the dataset instead of staying flat.
    expect(rowsAt5000).toBe(rowsAt1000)
    expect(rowsAt5000).toBeLessThan(50)
  })

  it('flags an exceptionally slow render (not a tight perf budget)', () => {
    const { durations } = renderTable(makeResources(1000))

    console.info('[efficiency] ResourceTable(1000 resources) render durations (ms):', durations)

    // A generous upper bound, not a strict perf budget - render timing
    // varies by machine/CI. This is a smoke test for something going
    // dramatically wrong, e.g. an accidental full pass over the dataset on
    // every render instead of only the windowed rows.
    expect(Math.max(...durations)).toBeLessThan(200)
  })
})
