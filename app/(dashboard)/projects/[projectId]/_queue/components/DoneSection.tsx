'use client'

import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Trash2,
} from 'lucide-react'
import { getPlayerName, getTimeAgo } from '../helpers'
import { useQueueStore, useDoneEntries } from '../store'

export function DoneSection() {
  const { project, removeEntry, isOwner } = useQueueStore()
  const doneEntries = useDoneEntries()

  if (doneEntries.length === 0 || !project) return null

  return (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3">
        <CheckCircle2 className="h-4 w-4" />
        Selesai ({doneEntries.length})
      </h2>
      <div className="space-y-2">
        {doneEntries.map((entry) => (
          <div
            key={entry.id}
            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 opacity-60"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{getPlayerName(entry)}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    {entry.game_id && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                        ID: {entry.game_id}
                      </span>
                    )}
                    {project.is_repeatable && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500">
                        {entry.games_played} Game Selesai
                      </span>
                    )}
                    {entry.completed_at && (
                      <span className="text-[10px] text-slate-400 font-medium">Selesai {getTimeAgo(entry.completed_at)}</span>
                    )}
                  </div>
                </div>
              </div>
              {isOwner && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeEntry(entry.id)}
                  className="text-xs h-8 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
