import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Plus, Settings, ExternalLink, Repeat, Zap, LayoutGrid } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — Mabar',
  description: 'Kelola project antrian streaming kamu',
}

// Define type for project with profile
interface ProjectWithProfile {
  id: string
  owner_id: string
  name: string
  slug: string
  game_name: string
  is_repeatable: boolean
  has_fast_track: boolean
  is_active: boolean
  created_at: string
  profiles: {
    full_name: string | null
  } | null
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch projects user owns with owner profile
  const { data: ownedProjects } = await (supabase
    .from('projects') as any)
    .select('*, profiles:owner_id(full_name)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch projects where user is a moderator with owner profile
  const { data: moderatedMemberships, error: moderatedError } = await (supabase
    .from('project_members') as any)
    .select('projects(*, profiles:owner_id(full_name))')
    .eq('user_id', user.id)
    .neq('role', 'owner')

  const moderatedProjects = moderatedMemberships
    ?.map((m: any) => m.projects as unknown as ProjectWithProfile)
    .filter((p: any): p is ProjectWithProfile => !!p) || []

  const error = moderatedError

  // Merge and deduplicate
  const allProjects = [...((ownedProjects as unknown as ProjectWithProfile[]) || []), ...moderatedProjects]
  const uniqueProjectsMap = new Map<string, ProjectWithProfile>()
  allProjects.forEach((p: ProjectWithProfile) => uniqueProjectsMap.set(p.id, p))

  const uniqueProjects = Array.from(uniqueProjectsMap.values())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Project Saya</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola antrian open mabar kamu</p>
          </div>
          <Button asChild className="h-11">
            <Link href="/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Buat Project Baru
            </Link>
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl mb-6">
            <p className="text-sm text-red-600 font-medium">Error: {error.message}</p>
          </div>
        )}

        {/* Empty State */}
        {(!uniqueProjects || uniqueProjects.length === 0) && !error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center mb-6">
              <LayoutGrid className="h-10 w-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Belum Ada Project</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md">
              Buat project pertama kamu untuk mulai mengelola antrian atau bergabung sebagai moderator
            </p>
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/projects/new">
                <Plus className="mr-2 h-5 w-5" />
                Buat Project Pertama
              </Link>
            </Button>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {uniqueProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Card Header with gradient accent */}
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />

                <div className="p-6">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {project.name}
                        </h3>
                        {project.owner_id !== user.id && (
                          <span className="shrink-0 scale-75 origin-left px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold rounded-md uppercase text-[10px]">Moderator</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-0.5 font-medium">{project.game_name}</p>
                      <p className="text-[11px] text-slate-400 font-medium italic">
                        Oleh {project.profiles?.full_name || 'Streamer'}
                      </p>
                    </div>
                    <span className={`ml-3 px-2.5 py-1 text-xs font-semibold rounded-full ${project.is_active
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}>
                      {project.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.is_repeatable && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800">
                        <Repeat className="h-3 w-3" />
                        Repeatable
                      </span>
                    )}
                    {project.has_fast_track && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-100 dark:border-amber-800">
                        <Zap className="h-3 w-3" />
                        Fast Track
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-4">
                    <Button className="flex-1" asChild>
                      <Link href={`/projects/${project.id}`}>
                        Kelola Antrian
                      </Link>
                    </Button>
                    {project.owner_id === user.id && (
                      <Button variant="outline" size="icon" asChild title="Pengaturan Project">
                        <Link href={`/projects/${project.id}/settings`}>
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* Public URL */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href={`/p/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 font-mono transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      /p/{project.slug}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
