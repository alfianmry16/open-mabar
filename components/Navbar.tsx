import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Gamepad2, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProfileDropdown } from './ProfileDropdown'
import { ThemeToggle } from './ThemeToggle'

interface NavbarProps {
  logoHref?: string
  showDashboardLink?: boolean
  hideAuth?: boolean
}

export async function Navbar({
  logoHref = '/',
  showDashboardLink = true,
  hideAuth = false
}: NavbarProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let displayName = ''
  let isSuperAdmin = false

  if (user) {
    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('full_name')
      .eq('id', user.id)
      .single()

    displayName = profile?.full_name || user.email?.split('@')[0] || 'Streamer'

    // Check superadmin status via RPC (bypasses RLS)
    const { data: adminCheck } = await supabase.rpc('check_is_superadmin' as any)
    isSuperAdmin = adminCheck === true
  }

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={logoHref} className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Mabar</span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {showDashboardLink && (
                <>
                  {isSuperAdmin && (
                    <Button variant="ghost" size="sm" asChild className="hidden sm:flex gap-1.5">
                      <Link href="/superadmin">
                        <Shield className="h-3.5 w-3.5" />
                        Admin Panel
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                    <Link href="/projects">Project</Link>
                  </Button>
                </>
              )}
              <ThemeToggle />
              <ProfileDropdown
                displayName={displayName}
                email={user.email}
              />
            </>
          ) : (
            <>
              <ThemeToggle />
              {!hideAuth && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                    <Link href="/login">Masuk</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Daftar</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
