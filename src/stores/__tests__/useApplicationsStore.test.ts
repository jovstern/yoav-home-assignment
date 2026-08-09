import { beforeEach, describe, expect, it } from 'vitest'
import { useApplicationsStore } from '@/stores/useApplicationsStore'

describe('useApplicationsStore', () => {
  beforeEach(() => {
    useApplicationsStore.setState({ applications: [] })
    localStorage.clear()
  })

  it('creates an application with a unique id and the given resourceIds', () => {
    const app = useApplicationsStore.getState().createApplication({
      name: 'Payments API',
      description: 'Core payment flow',
      resourceIds: ['r-1', 'r-2'],
    })

    expect(app.id).toBeTruthy()
    expect(app.name).toBe('Payments API')
    expect(app.resourceIds).toEqual(['r-1', 'r-2'])
    expect(useApplicationsStore.getState().applications).toHaveLength(1)
  })

  it('prepends new applications and keeps ids unique', () => {
    const first = useApplicationsStore
      .getState()
      .createApplication({ name: 'A', resourceIds: ['r-1'] })
    const second = useApplicationsStore
      .getState()
      .createApplication({ name: 'B', resourceIds: ['r-2'] })

    expect(first.id).not.toBe(second.id)
    expect(useApplicationsStore.getState().applications.map((a) => a.id)).toEqual([
      second.id,
      first.id,
    ])
  })

  it('throws instead of creating an application with an empty or whitespace-only name', () => {
    expect(() =>
      useApplicationsStore.getState().createApplication({ name: '', resourceIds: ['r-1'] }),
    ).toThrow()
    expect(() =>
      useApplicationsStore.getState().createApplication({ name: '   ', resourceIds: ['r-1'] }),
    ).toThrow()
    expect(useApplicationsStore.getState().applications).toHaveLength(0)
  })

  it('deletes an application by id, leaving the others untouched', () => {
    const first = useApplicationsStore
      .getState()
      .createApplication({ name: 'A', resourceIds: ['r-1'] })
    const second = useApplicationsStore
      .getState()
      .createApplication({ name: 'B', resourceIds: ['r-2'] })

    useApplicationsStore.getState().deleteApplication(first.id)

    expect(useApplicationsStore.getState().applications.map((a) => a.id)).toEqual([second.id])
  })

  it('falls back to an empty list when persisted storage is corrupted', async () => {
    localStorage.setItem('gambit-applications', '{not valid json')
    await useApplicationsStore.persist.rehydrate()
    expect(useApplicationsStore.getState().applications).toEqual([])
  })
})
