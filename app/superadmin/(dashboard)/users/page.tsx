import { requireSuperAdmin, getRecentUsers } from '@/lib/superadmin/server'
import {
  Users,
  Mail,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Pengguna | Super Admin',
}

export default async function SuperAdminUsersPage() {
  await requireSuperAdmin()

  // Fetch all users (using a large limit)
  const users = await getRecentUsers(500)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Pengguna</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Daftar semua pengguna terdaftar ({users.length} total)</p>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800/60 shadow-none">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" />
            Semua Pengguna
          </CardTitle>
          <CardDescription className="text-slate-400">
            Menampilkan {users.length} pengguna terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3 px-4">#</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3 px-4">Pengguna</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3 px-4">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3 px-4">Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-500 font-mono">{index + 1}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {user.full_name || '-'}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">{user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(user.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-sm text-slate-500">
                      Belum ada pengguna terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
