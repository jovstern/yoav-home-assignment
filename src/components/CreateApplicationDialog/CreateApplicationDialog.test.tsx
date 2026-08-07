import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateApplicationDialog } from '@/components/CreateApplicationDialog/CreateApplicationDialog'
import { useApplicationsStore } from '@/stores/useApplicationsStore'
import type { Resource } from '@/types'

const selectedResources: Resource[] = [
  {
    id: 'r-1',
    name: 'payments-api-prod',
    type: 'EC2 Instance',
    provider: 'AWS',
    region: 'us-east-1',
    environment: 'production',
    criticality: 'critical',
    owner: 'payments',
    tags: [],
    openIssues: 4,
  },
  {
    id: 'r-2',
    name: 'payments-db-replica',
    type: 'RDS PostgreSQL',
    provider: 'AWS',
    region: 'us-east-1',
    environment: 'production',
    criticality: 'critical',
    owner: 'payments',
    tags: [],
    openIssues: 1,
  },
]

describe('CreateApplicationDialog', () => {
  beforeEach(() => {
    useApplicationsStore.setState({ applications: [] })
  })

  it('disables submit until a name is entered', async () => {
    const user = userEvent.setup()
    render(
      <CreateApplicationDialog
        open
        onOpenChange={() => {}}
        selectedResources={selectedResources}
        onCreated={() => {}}
      />,
    )

    expect(screen.getByRole('button', { name: /create application/i })).toBeDisabled()

    await user.type(screen.getByLabelText(/name/i), 'Payments API')

    expect(screen.getByRole('button', { name: /create application/i })).toBeEnabled()
  })

  it('disables submit when there is no selection, even with a name', () => {
    render(
      <CreateApplicationDialog
        open
        onOpenChange={() => {}}
        selectedResources={[]}
        onCreated={() => {}}
      />,
    )

    expect(screen.getByRole('button', { name: /create application/i })).toBeDisabled()
  })

  it('creates the application with the selected resourceIds on submit', async () => {
    const user = userEvent.setup()
    const onCreated = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <CreateApplicationDialog
        open
        onOpenChange={onOpenChange}
        selectedResources={selectedResources}
        onCreated={onCreated}
      />,
    )

    await user.type(screen.getByLabelText(/name/i), 'Payments API')
    await user.click(screen.getByRole('button', { name: /create application/i }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onCreated).toHaveBeenCalledTimes(1)

    const created = onCreated.mock.calls[0][0]
    expect(created.name).toBe('Payments API')
    expect(created.resourceIds).toEqual(['r-1', 'r-2'])
    expect(useApplicationsStore.getState().applications).toHaveLength(1)
  })
})
