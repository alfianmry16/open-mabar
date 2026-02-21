'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { QueueManagerProps } from './_queue/types'
import { useQueueStore, usePlayingEntries, useWaitingEntries, useDoneEntries } from './_queue/store'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Clock, CheckCircle2 } from 'lucide-react'

// Components
import { QueueHeader } from './_queue/components/QueueHeader'
import { QueueStats } from './_queue/components/QueueStats'
import { PlayingSection } from './_queue/components/PlayingSection'
import { WaitingSection } from './_queue/components/WaitingSection'
import { DoneSection } from './_queue/components/DoneSection'
import { Sidebar } from './_queue/components/Sidebar'

export function QueueManager({
  project,
  initialEntries,
  projectRoles,
  isOwner,
  isPublicView = false,
}: QueueManagerProps) {
  const { init } = useQueueStore()
  const playingCount = usePlayingEntries().length
  const waitingCount = useWaitingEntries().length
  const doneCount = useDoneEntries().length

  // Initialize store + realtime subscription
  useEffect(() => {
    init(project, initialEntries, projectRoles, isOwner)

    const supabase = createClient()

    // 1. Queue entries subscription
    const entriesChannel = supabase
      .channel(`queue-${project.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue_entries',
          filter: `project_id=eq.${project.id}`,
        },
        async () => {
          await useQueueStore.getState().refetchEntries()
        }
      )
      .subscribe()

    // 2. Project settings subscription
    const projectChannel = supabase
      .channel(`project-${project.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${project.id}`,
        },
        async () => {
          await useQueueStore.getState().refetchProject()
        }
      )
      .subscribe()

    // 3. Roles subscription
    const rolesChannel = supabase
      .channel(`roles-${project.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_roles',
          filter: `project_id=eq.${project.id}`,
        },
        async () => {
          await useQueueStore.getState().refetchRoles()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(entriesChannel)
      supabase.removeChannel(projectChannel)
      supabase.removeChannel(rolesChannel)
    }
  }, [project, initialEntries, projectRoles, isOwner, init])

  return (
    <div className="container mx-auto px-4 py-6 max-w-full overflow-x-hidden">
      <QueueHeader isOwner={isOwner} isPublicView={isPublicView} />
      <QueueStats />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: Queue List */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <Tabs defaultValue="waiting" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide bg-slate-200/50 dark:bg-slate-800/50 p-1 mb-6">
              <TabsTrigger value="playing" className="flex items-center gap-2 px-4 py-2">
                <Play className="h-3.5 w-3.5" />
                <span>Bermain</span>
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {playingCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="waiting" className="flex items-center gap-2 px-4 py-2">
                <Clock className="h-3.5 w-3.5" />
                <span>Antrian</span>
                <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {waitingCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="done" className="flex items-center gap-2 px-4 py-2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Selesai</span>
                <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {doneCount}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="playing" className="mt-0 focus-visible:ring-0">
              <PlayingSection />
            </TabsContent>
            <TabsContent value="waiting" className="mt-0 focus-visible:ring-0">
              <WaitingSection />
            </TabsContent>
            <TabsContent value="done" className="mt-0 focus-visible:ring-0">
              <DoneSection />
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT: Sidebar */}
        <Sidebar />
      </div>
    </div>
  )
}
