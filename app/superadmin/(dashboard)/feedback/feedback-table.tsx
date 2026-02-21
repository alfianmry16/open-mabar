'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Star, ThumbsUp, Bug, Lightbulb, User, Calendar, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { FeedbackEntry } from '@/lib/superadmin/types'
import { toggleFeedbackFeatured } from '@/lib/superadmin/actions'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface FeedbackTableProps {
  initialFeedbacks: FeedbackEntry[]
}

export function FeedbackTable({ initialFeedbacks }: FeedbackTableProps) {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks)
  const [filter, setFilter] = useState<'all' | 'testimoni' | 'saran' | 'bug'>('all')
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const filteredFeedbacks = feedbacks.filter(f =>
    filter === 'all' ? true : f.category === filter
  )

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    setIsUpdating(id)
    try {
      const success = await toggleFeedbackFeatured(id, !currentStatus)
      if (success) {
        setFeedbacks(prev => prev.map(f =>
          f.id === id ? { ...f, is_featured: !currentStatus } : f
        ))
        toast.success(currentStatus ? 'Dihapus dari featured' : 'Ditandai sebagai featured')
      }
    } catch (err) {
      console.error('Error toggling featured:', err)
      toast.error('Gagal memperbarui status featured')
    } finally {
      setIsUpdating(null)
    }
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'testimoni': return <ThumbsUp className="h-4 w-4 text-emerald-500" />
      case 'bug': return <Bug className="h-4 w-4 text-red-500" />
      default: return <Lightbulb className="h-4 w-4 text-amber-500" />
    }
  }

  const categories = [
    { id: 'all', label: 'Semua', icon: <Star className="h-4 w-4" /> },
    { id: 'testimoni', label: 'Testimoni', icon: <ThumbsUp className="h-4 w-4" /> },
    { id: 'saran', label: 'Saran', icon: <Lightbulb className="h-4 w-4" /> },
    { id: 'bug', label: 'Bug', icon: <Bug className="h-4 w-4" /> },
  ]

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border shadow-sm",
              filter === cat.id
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
            )}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Tidak ada feedback di kategori ini</h3>
            <p className="text-slate-400">Coba filter kategori yang lain</p>
          </div>
        ) : (
          filteredFeedbacks.map((fb) => (
            <Card key={fb.id} className={cn(
              "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all",
              fb.is_featured && "ring-2 ring-emerald-500 dark:ring-emerald-500/50"
            )}>
              <div className="flex flex-col md:flex-row">
                {/* User Info Sidebar on Card */}
                <div className="md:w-64 bg-slate-50 dark:bg-slate-800/50 p-6 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-600">
                      {fb.avatar_url ? (
                        <Image src={fb.avatar_url} alt={fb.full_name || ''} width={40} height={40} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{fb.full_name || 'Tanpa Nama'}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{fb.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(fb.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1 min-h-[14px]">
                      {fb.rating ? (
                        [1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={cn("h-3 w-3", fb.rating! >= s ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700")} />
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">Tanpa rating</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
                        {getCategoryIcon(fb.category)}
                        <span className="text-slate-700 dark:text-slate-300">{fb.category}</span>
                      </div>

                      {/* Featured Toggle for Testimonials */}
                      {fb.category === 'testimoni' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFeatured(fb.id, fb.is_featured)}
                          disabled={isUpdating === fb.id}
                          className={cn(
                            "h-8 px-3 text-[10px] font-bold uppercase tracking-widest gap-2 rounded-full transition-all",
                            fb.is_featured
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          )}
                        >
                          {fb.is_featured ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <Circle className="h-3.5 w-3.5" />
                          )}
                          {fb.is_featured ? 'Featured' : 'Mark Featured'}
                        </Button>
                      )}
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">
                      {fb.message}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
