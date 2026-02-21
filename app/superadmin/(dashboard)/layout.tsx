import { requireSuperAdmin } from '@/lib/superadmin/server'
import Link from 'next/link'
import { Shield, LayoutDashboard, Users, LogOut, FolderKanban, MessageSquare } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const navItems = [
  { href: '/superadmin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/superadmin/users', label: 'Pengguna', icon: Users },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/superadmin/feedback', label: 'Feedback', icon: MessageSquare },
]

export default async function SuperAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await requireSuperAdmin()

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900/70 border-r border-slate-200 dark:border-slate-800/80 flex flex-col fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800/80">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-600/20 rounded-lg">
            <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Super Admin</h1>
            <p className="text-[10px] text-slate-500 font-medium">Mabar Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
            >
              <item.icon className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Theme toggle + User info & Signout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          {/* Theme Toggle */}
          <ThemeToggle variant="full" />

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {(profile.full_name || profile.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{profile.full_name || 'Admin'}</p>
              <p className="text-[11px] text-slate-500 truncate">{profile.email}</p>
            </div>
          </div>
          <form action="/superadmin/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
