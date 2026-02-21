import { getAllFeedback } from '@/lib/superadmin/server'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, ThumbsUp, Bug, Lightbulb } from 'lucide-react'
import { FeedbackTable } from './feedback-table'

export const metadata = {
  title: 'Feedback Pengguna | Super Admin',
}

export default async function SuperAdminFeedbackPage() {
  const feedbacks = await getAllFeedback()

  const stats = {
    total: feedbacks.length,
    averageRating: feedbacks.filter(f => f.rating !== null).length > 0
      ? (feedbacks.filter(f => f.rating !== null).reduce((acc, f) => acc + (f.rating || 0), 0) / feedbacks.filter(f => f.rating !== null).length).toFixed(1)
      : '0.0',
    categories: {
      saran: feedbacks.filter(f => f.category === 'saran').length,
      testimoni: feedbacks.filter(f => f.category === 'testimoni').length,
      bug: feedbacks.filter(f => f.category === 'bug').length,
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Feedback Pengguna</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola dan tinjau masukan dari para pengguna</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-bold tracking-wider">Total Feedback</CardDescription>
            <CardTitle className="text-3xl text-slate-900 dark:text-white">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-bold tracking-wider">Rata-rata Rating</CardDescription>
            <div className="flex items-center gap-2">
              <CardTitle className="text-3xl text-slate-900 dark:text-white">{stats.averageRating}</CardTitle>
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            </div>
          </CardHeader>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-bold tracking-wider">Sebaran Kategori</CardDescription>
            <div className="flex items-center gap-6 mt-1">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stats.categories.testimoni} Testimoni</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stats.categories.saran} Saran</span>
              </div>
              <div className="flex items-center gap-2">
                <Bug className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stats.categories.bug} Bug</span>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <FeedbackTable initialFeedbacks={feedbacks} />
    </div>
  )
}
