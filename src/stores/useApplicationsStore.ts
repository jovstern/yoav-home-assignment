import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Application } from '@/types'

interface ApplicationsState {
  applications: Application[]
  createApplication: (input: {
    name: string
    description?: string
    resourceIds: string[]
  }) => Application
  deleteApplication: (id: string) => void
}

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set, get) => ({
      applications: [],

      createApplication: (input) => {
        const name = input.name.trim()
        if (!name) {
          throw new Error('createApplication: name must not be empty')
        }

        const application: Application = {
          id: crypto.randomUUID(),
          name,
          description: input.description?.trim() || undefined,
          resourceIds: input.resourceIds,
          createdAt: Date.now(),
        }
        set({ applications: [application, ...get().applications] })

        return application
      },
      deleteApplication: (id) => {
        set({ applications: get().applications.filter((application) => application.id !== id) })
      },
    }),
    {
      name: 'gambit-applications',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ applications: state.applications }),
    },
  ),
)
