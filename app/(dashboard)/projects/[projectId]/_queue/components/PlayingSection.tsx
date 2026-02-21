'use client'

import { Button } from '@/components/ui/button'
import {
  Play,
  Plus,
  CheckCircle2,
  Zap,
  Repeat,
  Gamepad2,
  Copy,
  Check,
  Tag,
  Clock,
} from 'lucide-react'
import { getPlayerName, getRoleName, getRoleColor } from '../helpers'
import { useQueueStore, usePlayingEntries } from '../store'

export function PlayingSection() {
  const playingEntries = usePlayingEntries()
  const {
    project,
    projectRoles,
    updateStatus,
    incrementGames,
    incrementMaxGames,
    copyGameId,
    copiedGameId,
    isOwner
  } = useQueueStore()

  if (playingEntries.length === 0 || !project) return null

  return (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-3">
        <Play className="h-4 w-4" />
        Sedang Bermain
      </h2>
      <div className="space-y-2">
        {playingEntries.map((entry) => (
          <div
            key={entry.id}
            className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 animate-fade-in"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
              <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                <div className="w-10 h-10 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center shrink-0">
                  <Gamepad2 className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-none">{getPlayerName(entry)}</p>
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
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-100 border border-indigo-200 font-mono text-xs font-bold text-indigo-700 hover:bg-indigo-200 transition-all cursor-pointer truncate max-w-[140px]"
                        title="Klik untuk salin ID"
                      >
                        <span className="text-[10px] uppercase opacity-60">ID:</span>
                        {entry.game_id}
                        {copiedGameId === entry.game_id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 opacity-40" />}
                      </button>
                    )}
                    {project.is_repeatable && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-600 border border-blue-700 text-xs font-black text-white shadow-sm ring-2 ring-blue-100">
                        <Repeat className="h-3 w-3" />
                        {entry.games_played} / {entry.games_requested} Game
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {isOwner && (
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 pt-3 sm:pt-0 border-t sm:border-0 border-blue-100 w-full sm:w-auto">
                  {project.is_repeatable && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => incrementGames(entry.id, entry.games_played)}
                        disabled={entry.games_played >= entry.games_requested}
                        className="text-[9px] sm:text-xs h-8 sm:h-9 bg-white px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={entry.games_played >= entry.games_requested ? "Batas game tercapai" : "Tambah jumlah sudah dimainkan"}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Dimainkan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => incrementMaxGames(entry.id, entry.games_requested)}
                        className="text-[9px] sm:text-xs h-8 sm:h-9 border-amber-300 text-amber-700 hover:bg-amber-50 bg-white px-2"
                        title="Tambah jumlah maks bermain"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Maks
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(entry.id, 'waiting')}
                    className="text-[9px] sm:text-xs h-8 sm:h-9 border-red-500 text-red-500 hover:text-red-600 hover:bg-red-100 hover:border-red-600 bg-white px-2"
                    title="Kembalikan ke antrian"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Antri Lagi
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => updateStatus(entry.id, 'done')}
                    className="text-[9px] sm:text-xs h-8 sm:h-9 bg-emerald-600 hover:bg-emerald-700 px-2"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Selesai
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
