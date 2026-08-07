import { ApplicationCard } from '@/components/ApplicationsList/ApplicationCard.tsx'
import type { Application, Resource } from '@/types'

interface ApplicationsListProps {
  applications: Application[]
  resourcesById: Map<string, Resource>
  onSelect: (application: Application) => void
}

export function ApplicationsList({ applications, resourcesById, onSelect }: ApplicationsListProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {applications.map((application) => {
        const members = application.resourceIds
          .map((id) => resourcesById.get(id))
          .filter((resource): resource is Resource => Boolean(resource))

        return (
          <ApplicationCard
            key={application.id}
            application={application}
            members={members}
            onSelect={onSelect}
          />
        )
      })}
    </div>
  )
}
