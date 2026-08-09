import { useMemo, useState } from 'react'
import { Boxes, Database } from 'lucide-react'
import { resources } from '@/data/resources'
import { defaultFilterCriteria, filterResources, type ResourceFilterCriteria } from '@/lib/filter'
import { useSelection } from '@/hooks/useSelection'
import { useApplicationsStore } from '@/stores/useApplicationsStore'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/Tabs/Tabs'
import { ResourceFilters } from '@/components/ResourceFilters/ResourceFilters'
import { ResourceTable } from '@/components/ResourceTable/ResourceTable'
import { SelectionBar } from '@/components/SelectionBar/SelectionBar'
import { CreateApplicationDialog } from '@/components/CreateApplicationDialog/CreateApplicationDialog'
import { ApplicationsList } from '@/components/ApplicationsList/ApplicationsList'
import { ApplicationGraphDrawer } from '@/components/ApplicationGraphDrawer/ApplicationGraphDrawer'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import type { Application } from '@/types'

type Tab = 'resources' | 'applications'

export default function App() {
  const [tab, setTab] = useState<Tab>('resources')
  const [criteria, setCriteria] = useState<ResourceFilterCriteria>(defaultFilterCriteria)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null)

  const { selectedIds, size, isSelected, toggle, clear } = useSelection()
  const applications = useApplicationsStore((state) => state.applications)

  const filteredResources = useMemo(() => filterResources(resources, criteria), [criteria])
  const selectedResources = useMemo(
    () => resources.filter((resource) => selectedIds.has(resource.id)),
    [selectedIds],
  )
  const resourcesById = useMemo(() => new Map(resources.map((resource) => [resource.id, resource])), [])

  const handleCreated = (application: Application) => {
    clear()
    setTab('applications')
    setViewingApplication(application)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-4 sm:px-6">
      <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>

        <header className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-700">Gambit Frontend Take-Home</h1>
            <p className="text-sm text-gray-700">
              Browse resources, group a selection into an Application, and visualize it.
            </p>
          </div>

          <TabsList>
            <TabsTab value="resources" >
              <Database className="size-4" />
              Resources
              <span className="text-xs ">{resources.length}</span>
            </TabsTab>
            <TabsTab value="applications" >
              <Boxes className="size-4" />
              Applications
              <span className="text-xs ">{applications.length}</span>
            </TabsTab>
          </TabsList>
        </header>

        <TabsPanel value="resources" className="mt-6">
          <section className="flex flex-col gap-4">
            <ResourceFilters
              criteria={criteria}
              onChange={setCriteria}
              resultCount={filteredResources.length}
              totalCount={resources.length}
            />

            {filteredResources.length > 0 ? (
              <ResourceTable
                resources={filteredResources}
                isSelected={isSelected}
                onToggle={toggle}
                searchQuery={criteria.search}
              />
            ) : (
              <EmptyState
                icon={Database}
                title="No resources match your filters"
                description="Try clearing a filter or searching a different term."
              />
            )}

            <SelectionBar
              count={size}
              onClear={clear}
              onCreateApplication={() => setCreateDialogOpen(true)}
            />
          </section>
        </TabsPanel>

        <TabsPanel value="applications" className="mt-6">
          <section>
            {applications.length > 0 ? (
              <ApplicationsList
                applications={applications}
                resourcesById={resourcesById}
                onSelect={setViewingApplication}
              />
            ) : (
              <EmptyState
                icon={Boxes}
                title="No Applications yet"
                description="Select resources on the Resources tab and group them into your first Application."
              />
            )}
          </section>
        </TabsPanel>
      </Tabs>

      <CreateApplicationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        selectedResources={selectedResources}
        onCreated={handleCreated}
      />

      <ApplicationGraphDrawer
          open={viewingApplication !== null}
        application={viewingApplication}
        resources={resources}
        onOpenChange={setViewingApplication}
      />
    </div>
  )
}
