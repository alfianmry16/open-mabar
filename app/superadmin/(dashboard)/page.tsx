import { getAdminStats, getRecentUsers, getUserGrowth } from '@/lib/superadmin/server'
import {
  Users,
  UserPlus,
  FolderKanban,
  Activity,
  Clock,
  Play,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Dashboard | Super Admin',
}

export default async function SuperAdminDashboardPage() {
  const [stats, recentUsers, userGrowth] = await Promise.all([
    getAdminStats(),
    getRecentUsers(10),
    getUserGrowth(),
  ])

  const maxGrowth = Math.max(...userGrowth.map((g) => g.user_count), 1)

  const statCards = [
    {
      label: 'Total Pengguna',
      value: stats.total_users,
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-500/20',
      iconColor: 'text-indigo-400',
    },
    {
      label: 'Pengguna Baru (7 Hari)',
      value: stats.new_users_7d,
      icon: UserPlus,
      color: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Total Proyek',
      value: stats.total_projects,
      icon: FolderKanban,
      color: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
    },
    {
      label: 'Proyek Aktif',
      value: stats.active_projects,
      icon: Activity,
      color: 'from-cyan-500 to-cyan-600',
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400',
    },
  ]

  const queueCards = [
    {
      label: 'Menunggu',
      value: stats.queues_waiting,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Bermain',
      value: stats.queues_playing,
      icon: Play,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Selesai',
      value: stats.queues_done,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Ringkasan statistik platform Mabar</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/60 p-5 hover:border-slate-300 dark:hover:border-slate-700/80 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{card.value.toLocaleString()}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
            {/* Gradient accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
          </div>
        ))}
      </div>

      {/* Queue Status + User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue Status */}
        <Card className="bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800/60 shadow-none">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400" />
              Status Antrian
            </CardTitle>
            <CardDescription className="text-slate-400">
              Total: {stats.total_queues.toLocaleString()} entri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {queueCards.map((q) => (
              <div key={q.label} className={`flex items-center justify-between p-3 rounded-lg ${q.bg}`}>
                <div className="flex items-center gap-3">
                  <q.icon className={`h-4 w-4 ${q.color}`} />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{q.label}</span>
                </div>
                <span className={`text-lg font-bold ${q.color}`}>{q.value.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800/60 shadow-none">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Pertumbuhan Pengguna
            </CardTitle>
            <CardDescription className="text-slate-400">
              Registrasi bulanan (12 bulan terakhir)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {userGrowth.map((item) => {
                const height = maxGrowth > 0 ? (item.user_count / maxGrowth) * 100 : 0
                const monthLabel = item.month.split('-')[1]
                const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
                const displayMonth = monthNames[parseInt(monthLabel)] || monthLabel

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-medium">{item.user_count}</span>
                    <div className="w-full flex items-end" style={{ height: '140px' }}>
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 hover:from-indigo-500 hover:to-indigo-300 transition-colors min-h-[4px]"
                        style={{ height: `${Math.max(height, 3)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{displayMonth}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card className="bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800/60 shadow-none">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-indigo-400" />
            Pengguna Terbaru
          </CardTitle>
          <CardDescription className="text-slate-400">
            10 pengguna terdaftar terakhir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3 px-4">Pengguna</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3 px-4">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3 px-4">Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {user.full_name || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{user.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-sm text-slate-500">
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
