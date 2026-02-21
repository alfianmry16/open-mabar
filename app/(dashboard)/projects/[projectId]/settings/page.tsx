import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { ProjectSettings } from './project-settings'

interface PageProps {
  params: Promise<{ projectId: string }>
}

export default async function SettingsPage({ params }: PageProps) {
  const { projectId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await (supabase
    .from('projects') as any)
    .select('*')
    .eq('id', projectId)
    .single()

  if (!project) {
    redirect('/projects')
  }

  const isOwner = project.owner_id === user.id

  // STRICT ACCESS: Only owner can access settings.
  // Moderators are redirected back to the project dashboard.
  if (!isOwner) {
    redirect(`/projects/${projectId}`)
  }

  const { data: roles } = await (supabase
    .from('project_roles') as any)
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true })

  // Fetch project members
  const { data: members } = await (supabase
    .from('project_members') as any)
    .select('*, profiles:user_id(*)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  // Fetch invite links (only if owner, or if moderator has permission)
  const { data: inviteLinks } = await (supabase
    .from('invite_links') as any)
    .select('*')
    .eq('project_id', projectId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar logoHref="/projects" />

      <ProjectSettings
        project={project as any} // Temporary until component props are updated
        initialRoles={(roles || []) as any}
        initialMembers={(members || []) as any}
        initialInviteLinks={(inviteLinks || []) as any}
      />
    </div>
  )
}
