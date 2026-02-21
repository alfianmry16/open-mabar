import { createClient } from '@/lib/supabase/server'

/**
 * Check if the current user is the owner of a project
 */
export async function isProjectOwner(projectId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data, error } = await (supabase
    .from('projects') as any)
    .select('owner_id')
    .eq('id', projectId)
    .single()

  if (error || !data) return false

  return data.owner_id === user.id
}

/**
 * Check if the current user is a moderator (or owner) of a project
 */
export async function isProjectModerator(projectId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await (supabase
    .from('project_members') as any)
    .select('role')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .single()

  return !!data // Has any role (owner or moderator)
}

/**
 * Get the user's role in a project
 */
export async function getUserProjectRole(
  projectId: string
): Promise<'owner' | 'moderator' | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await (supabase
    .from('project_members') as any)
    .select('role')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null

  return data.role as 'owner' | 'moderator' | null
}
