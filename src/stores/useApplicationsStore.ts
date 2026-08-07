import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Application } from '@/types'

export interface CreateApplicationInput {
  name: string
  description?: string
  resourceIds: string[]
}

interface ApplicationsState {
  applications: Application[]
  createApplication: (input: CreateApplicationInput) => Application
  deleteApplication: (id: string) => void
}

/**
 * localStorage is untrusted (another tab/extension could write malformed
 * JSON into our key), so we validate before handing the raw string to
 * zustand's JSON storage — a parse failure falls back to an empty list
 * instead of throwing during store hydration.
 */
const safeLocalStorage = {
  getItem: (name: string): string | null => {
    try {
      const raw = localStorage.getItem(name)
      if (raw == null) return null
      JSON.parse(raw)
      return raw
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value)
    } catch {
      // storage unavailable/quota exceeded — app still works in-memory
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name)
    } catch {
      // ignore
    }
  },
}

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set, get) => ({
      applications: [],
      createApplication: (input) => {
        const application: Application = {
          id: crypto.randomUUID(),
          name: input.name.trim(),
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
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ applications: state.applications }),
    },
  ),
)
