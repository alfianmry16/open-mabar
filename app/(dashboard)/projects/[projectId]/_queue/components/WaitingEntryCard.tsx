'use client'

import { Button } from '@/components/ui/button'
import {
  Play,
  Trash2,
  Zap,
  Repeat,
  Copy,
  Check,
  Tag,
} from 'lucide-react'
import type { QueueEntry, Project, ProjectRole } from '../types'
import { getPlayerName, getTimeAgo, getRoleName, getRoleColor } from '../helpers'
import { useQueueStore } from '../store'

interface WaitingEntryCardProps {
  entry: QueueEntry
  index: number
  project: Project
  projectRoles: ProjectRole[]
}

export function WaitingEntryCard({ entry, index, project, projectRoles }: WaitingEntryCardProps) {
  const { updateStatus, removeEntry, copyGameId, copiedGameId, toggleFastTrack, isOwner } = useQueueStore()

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0 w-full">
        <div className="flex items-center gap-3 min-w-0 w-full">
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">#{index + 1}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-none">{getPlayerName(entry)}</p>
              <div className="flex flex-wrap gap-1">
                {(entry.role_ids || []).map((rid) => {
                  const name = getRoleName(rid, projectRoles)
                  if (!name) return null
                  const color = getRoleColor(rid, projectRoles)
                  return (
                    <span key={rid} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded border shrink-0 ${color.bg} ${color.text} ${color.border}`}>
                      <Tag className="h-2 w-2" /> {name}
                    </span>
                  )
                })}
                {entry.is_fast_track && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-700 rounded shrink-0">
                    <Zap className="h-2 w-2" /> VIP
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap min-w-0 mt-1">
              {entry.game_id && (
                <button
                  type="button"
                  onClick={() => copyGameId(entry.game_id!)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800 font-mono text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all cursor-pointer truncate max-w-[130px]"
                  title="Klik untuk salin ID"
                >
                  <span className="text-[9px] uppercase opacity-60">ID:</span>
                  {entry.game_id}
                  {copiedGameId === entry.game_id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 opacity-40" />}
                </button>
              )}
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">• {getTimeAgo(entry.joined_at)}</span>
              {project.is_repeatable && (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800 text-[11px] font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                  <Repeat className="h-3 w-3" />
                  {entry.games_played} / {entry.games_requested} Game
                </div>
              )}
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center gap-1.5 sm:shrink-0 justify-end pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800 w-full sm:w-auto">
            {project.has_fast_track && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleFastTrack(entry.id, entry.is_fast_track)}
                className={`text-[10px] sm:text-xs h-8 sm:h-9 flex-1 sm:flex-none px-2 ${entry.is_fast_track ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}
                title={entry.is_fast_track ? 'Hapus VIP' : 'Upgrade ke VIP'}
              >
                <Zap className="h-3 w-3 sm:mr-1" />
                <span className="ml-1 sm:hidden">VIP</span>
              </Button>
            )}
            <Button size="sm" onClick={() => updateStatus(entry.id, 'playing')} className="text-[10px] sm:text-xs h-8 sm:h-9 px-3 flex-1 sm:flex-none">
              <Play className="h-3 w-3 mr-1" /> Main
            </Button>
            <Button size="sm" variant="ghost" onClick={() => removeEntry(entry.id)} className="text-[10px] sm:text-xs h-8 sm:h-9 w-8 sm:w-9 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
