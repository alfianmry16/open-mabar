import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { QueueManager } from './queue-manager'
import type { QueueEntry, Project, ProjectRole } from './_queue/types'

interface PageProps {
  params: Promise<{ projectId: string }>
}

export default async function ProjectDashboardPage({ params }: PageProps) {
  const { projectId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch project with owner info
  const { data: project, error: projectError } = await (supabase
    .from('projects') as any)
    .select('*, profiles:owner_id(*)')
    .eq('id', projectId)
    .single()

  if (projectError || !project) {
    redirect('/projects')
  }

  // Fetch queue entries with profile info
  const { data: queueEntries } = await (supabase
    .from('queue_entries') as any)
    .select('*, profiles:user_id(id, full_name, email, avatar_url)')
    .eq('project_id', projectId)
    .order('is_fast_track', { ascending: false })
    .order('joined_at', { ascending: true })

  // Fetch project roles
  const { data: projectRoles } = await (supabase
    .from('project_roles') as any)
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true })

  // Fetch project membership to check if user is owner or moderator
  const { data: membership } = await (supabase
    .from('project_members') as any)
    .select('role')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .maybeSingle()

  const isOwner = project?.owner_id === user.id
  const isModerator = !!membership
  const hasManagementAccess = isOwner || isModerator

  if (!hasManagementAccess) {
    redirect('/projects')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar logoHref="/projects" />

      <QueueManager
        project={project as unknown as Project}
        initialEntries={(queueEntries || []) as unknown as QueueEntry[]}
        projectRoles={(projectRoles || []) as unknown as ProjectRole[]}
        isOwner={isOwner}
        currentUserId={user.id}
      />
    </div>
  )
}
