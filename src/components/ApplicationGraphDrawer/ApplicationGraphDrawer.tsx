import { useMemo, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer/Drawer'
import { Button } from '@/components/ui/Button/Button'
import { ApplicationGraph } from '@/components/ApplicationGraphDrawer/ApplicationGraph.tsx'
import { MemberRow } from '@/components/ApplicationGraphDrawer/MemberRow.tsx'
import { useApplicationsStore } from '@/stores/useApplicationsStore'
import type { Application, Resource } from '@/types'

interface ApplicationGraphDrawerProps {
  application: Application | null;
  resources: Resource[];
  onOpenChange: (application: Application | null) => void;
  open: boolean;
}

export function ApplicationGraphDrawer({ application, resources, onOpenChange, open }: ApplicationGraphDrawerProps) {
  const deleteApplication = useApplicationsStore((state) => state.deleteApplication);

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [lastApplicationId, setLastApplicationId] = useState(application?.id);
  const [hoveredResourceId, setHoveredResourceId] = useState<string | null>(null);

  const handleOnOpenChange=(open: boolean) => {
    if (!open) onOpenChange(null);
  }

  if (application?.id !== lastApplicationId) {
    setLastApplicationId(application?.id)
    setConfirmingDelete(false)
    setHoveredResourceId(null)
  }

  const members = useMemo(() => {
    if (!application) return []
    const idSet = new Set(application.resourceIds)
    return resources.filter((resource) => idSet.has(resource.id))
  }, [application, resources])

  const handleDeleteClick = () => {
    if (!application) return
    if (!confirmingDelete) {
      setConfirmingDelete(true)
      return
    }
    deleteApplication(application.id)
    handleOnOpenChange(false)
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOnOpenChange}
      title={application?.name ?? ''}
      description={application?.description}
    >
      {application ? (
        <div className="flex flex-col gap-4">
          <ApplicationGraph
            application={application}
            resources={members}
            hoveredResourceId={hoveredResourceId}
            onHoverResource={setHoveredResourceId}
          />

          <div className="flex flex-col gap-1.5 border-t border-border pt-3">
            <span className="text-sm font-medium">Members</span>
            <ul className="flex flex-col gap-1.5">
              {members.map((resource) => (
                <MemberRow
                  key={resource.id}
                  resource={resource}
                  hovered={resource.id === hoveredResourceId}
                  onHoverChange={setHoveredResourceId}
                />
              ))}
            </ul>
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button
              variant="outline"
              size="sm"
              className="border-criticality-critical text-criticality-critical hover:bg-criticality-critical/10 hover:text-criticality-critical"
              onClick={handleDeleteClick}
              onBlur={() => setConfirmingDelete(false)}
            >
              <Trash2 />
              {confirmingDelete ? 'Click again to confirm' : 'Delete Application'}
            </Button>
          </div>
        </div>
      ) : null}
    </Drawer>
  )
}
