import { useState, type FormEvent } from 'react'
import { Dialog } from '@/components/ui/Dialog/Dialog'
import { Input } from '@/components/ui/Input/Input'
import { Button } from '@/components/ui/Button/Button'
import { Badge } from '@/components/ui/Badge/Badge'
import { Tooltip } from '@/components/ui/Tooltip/Tooltip'
import { useApplicationsStore } from '@/stores/useApplicationsStore'
import type { Application, Resource } from '@/types'

interface CreateApplicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedResources: Resource[]
  onCreated: (application: Application) => void
}

export function CreateApplicationDialog({
  open,
  onOpenChange,
  selectedResources,
  onCreated,
}: CreateApplicationDialogProps) {
  const createApplication = useApplicationsStore((state) => state.createApplication)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setName('')
      setDescription('')
    }
  }

  const isValid = name.trim().length > 0 && selectedResources.length > 0

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isValid) return

    const application = createApplication({
      name,
      description,
      resourceIds: selectedResources.map((resource) => resource.id),
    })
    onOpenChange(false)
    onCreated(application)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Application"
      description={`Group ${selectedResources.length} selected resource${selectedResources.length === 1 ? '' : 's'} into a named Application.`}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="app-name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="app-name"
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Payments API"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="app-description" className="text-sm font-medium">
            Description <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            id="app-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this application for?"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Resources</span>
          <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto rounded-md border border-border bg-muted/40 p-2">
            {selectedResources.map((resource) => (
              <Tooltip
                key={resource.id}
                content={
                  <span className="flex flex-col gap-0.5">
                    <span>{resource.name}</span>
                    <span className="text-background/70">Owner: {resource.owner}</span>
                  </span>
                }
              >
                <Badge variant="outline" className="max-w-[160px] truncate px-1">
                  {resource.name}
                </Badge>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid}>
            Create Application
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
