import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { QueueManager } from '../../../(dashboard)/projects/[projectId]/queue-manager'
import type { QueueEntry, Project, ProjectRole } from '../../../(dashboard)/projects/[projectId]/_queue/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PublicQueuePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch project by slug with owner info
  const { data: project, error: projectError } = await (supabase
    .from('projects') as any)
    .select('*, profiles:owner_id(*)')
    .eq('slug', slug)
    .single()

  if (projectError || !project) {
    notFound()
  }

  // Fetch queue entries with profile info
  const { data: queueEntries } = await (supabase
    .from('queue_entries') as any)
    .select('*, profiles:user_id(id, full_name, email, avatar_url)')
    .eq('project_id', project.id)
    .order('is_fast_track', { ascending: false })
    .order('joined_at', { ascending: true })

  // Fetch project roles
  const { data: projectRoles } = await (supabase
    .from('project_roles') as any)
    .select('*')
    .eq('project_id', project.id)
    .order('display_order', { ascending: true })

  // Check if current user is owner or moderator
  const { data: { user } } = await supabase.auth.getUser()

  const isOwner = user?.id === project.owner_id

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar hideAuth={true} />

      <QueueManager
        project={project as unknown as Project}
        initialEntries={(queueEntries || []) as unknown as QueueEntry[]}
        projectRoles={(projectRoles || []) as unknown as ProjectRole[]}
        isOwner={isOwner}
        isPublicView={true}
      />
    </div>
  )
}
