'use client'

import {
  Users,
  Clock,
  Play,
  CheckCircle2,
} from 'lucide-react'
import { useQueueStore, useWaitingEntries, usePlayingEntries, useDoneEntries } from '../store'

export function QueueStats() {
  const entries = useQueueStore((s) => s.entries)
  const waitingEntries = useWaitingEntries()
  const playingEntries = usePlayingEntries()
  const doneEntries = useDoneEntries()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
          <Users className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Total</span>
        </div>
        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{entries.length}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-800 p-2.5 sm:p-4">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
          <Clock className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Menunggu</span>
        </div>
        <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{waitingEntries.length}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-800 p-2.5 sm:p-4">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
          <Play className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Bermain</span>
        </div>
        <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{playingEntries.length}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 p-2.5 sm:p-4">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Selesai</span>
        </div>
        <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{doneEntries.length}</p>
      </div>
    </div>
  )
}
