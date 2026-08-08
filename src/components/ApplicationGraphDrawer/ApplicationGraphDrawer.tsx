import { useEffect, useMemo, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer/Drawer'
import { Tooltip } from '@/components/ui/Tooltip/Tooltip'
import { Button } from '@/components/ui/Button/Button'
import { ApplicationGraph } from '@/components/ApplicationGraphDrawer/ApplicationGraph.tsx'
import { Badge } from '@/components/ui/Badge/Badge'
import { useApplicationsStore } from '@/stores/useApplicationsStore'
import { criticalityBadgeVariant } from '@/lib/display'
import type { Application, Resource } from '@/types'

interface ApplicationGraphDrawerProps {
  application: Application | null
  resources: Resource[]
  onOpenChange: (open: boolean) => void
}

export function ApplicationGraphDrawer({ application, resources, onOpenChange }: ApplicationGraphDrawerProps) {
  const deleteApplication = useApplicationsStore((state) => state.deleteApplication)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    setConfirmingDelete(false)
  }, [application?.id])

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
    onOpenChange(false)
  }

  return (
    <Drawer
      open={application !== null}
      onOpenChange={onOpenChange}
      title={application?.name ?? ''}
      description={application?.description}
    >
      {application ? (
        <div className="flex flex-col gap-4">
          <ApplicationGraph application={application} resources={members} />

          <div className="flex flex-col gap-1.5 border-t border-border pt-3">
            <span className="text-sm font-medium">Members</span>
            <ul className="flex flex-col gap-1.5">
              {members.map((resource) => (
                <li key={resource.id} className="flex items-center justify-between gap-2 text-sm">
                  <Tooltip
                    content={
                      <span className="flex flex-col gap-0.5">
                        <span>{resource.name}</span>
                        <span className="text-background/70">{resource.owner}</span>
                      </span>
                    }
                    triggerClassName="block truncate"
                  >
                    {resource.name}
                  </Tooltip>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                    {resource.type}
                    <Badge variant={criticalityBadgeVariant(resource.criticality)}>
                      {resource.criticality}
                    </Badge>
                  </span>
                </li>
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
