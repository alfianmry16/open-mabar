'use client'

import { Button } from '@/components/ui/button'
import {
  Clock,
  Users,
  UserPlus,
  Tag,
  Search,
  Check,
  Zap,
} from 'lucide-react'
import { getRoleColor } from '../helpers'
import { useQueueStore, useWaitingEntries } from '../store'
import { WaitingEntryCard } from './WaitingEntryCard'
import { AddPlayerForm } from './AddPlayerForm'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'

export function WaitingSection() {
  const {
    project,
    projectRoles,
    showAddForm,
    activeRoleTab,
    searchQuery,
    vipFilter,
    setShowAddForm,
    setActiveRoleTab,
    setSearchQuery,
    setVipFilter,
    setError,
    isOwner,
  } = useQueueStore()
  const waitingEntries = useWaitingEntries()
  const [visibleCount, setVisibleCount] = useState(25)

  // Filter entries based on role tab
  const filteredByRole = useMemo(() => {
    return activeRoleTab === 'all'
      ? waitingEntries
      : waitingEntries.filter((e) => (e.role_ids || []).includes(activeRoleTab))
  }, [waitingEntries, activeRoleTab])

  const visibleEntries = useMemo(() => {
    return filteredByRole.slice(0, visibleCount)
  }, [filteredByRole, visibleCount])

  if (!project) return null

  const hasMore = filteredByRole.length > visibleCount

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
          <Clock className="h-4 w-4" />
          Antrian ({waitingEntries.length})
        </h2>
        {isOwner && (
          <Button
            size="sm"
            variant={showAddForm ? 'default' : 'outline'}
            onClick={() => { setShowAddForm(!showAddForm); setError(null) }}
            className="text-xs h-8"
          >
            <UserPlus className="h-3 w-3 mr-1" />
            Tambah Pemain
          </Button>
        )}
      </div>

      {/* Queue Closed Notice for Public */}
      {!project.is_active && !isOwner && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-in">
          <Zap className="h-5 w-5 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-800">Antrian Ditutup</p>
            <p className="text-xs text-red-600">Streamer sedang menonaktifkan pendaftaran antrian baru untuk saat ini.</p>
          </div>
        </div>
      )}

      {/* Search & VIP Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari ID atau Nama..."
            className="pl-9 h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {project.has_fast_track && (
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto shrink-0">
            {[
              { id: 'all', label: 'Semua', icon: Users },
              { id: 'vip', label: 'VIP', icon: Zap },
              { id: 'regular', label: 'Reguler', icon: Check },
            ].map((f) => {
              const Icon = f.icon
              const isActive = vipFilter === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setVipFilter(f.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${isActive
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  <Icon className="h-3 w-3" />
                  {f.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Player Form (only show for owner/moderator) */}
      {(showAddForm && isOwner) && (
        <AddPlayerForm project={project} projectRoles={projectRoles} />
      )}

      {waitingEntries.length === 0 && (!showAddForm || !isOwner) ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
          <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">
            {searchQuery || vipFilter !== 'all' ? 'Pemain tidak ditemukan' : 'Belum ada yang mengantri'}
          </p>
          {(isOwner && !searchQuery && vipFilter === 'all') && (
            <p className="text-xs text-slate-300 mt-1">Klik &quot;Tambah Pemain&quot; untuk memulai</p>
          )}
        </div>
      ) : projectRoles.length > 0 ? (
        /* Tab-based role filter */
        <div className="space-y-4 max-w-full overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto p-1 scrollbar-hide max-w-full pb-2">
            <button
              type="button"
              onClick={() => setActiveRoleTab('all')}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${activeRoleTab === 'all'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-300'
                : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:text-slate-700'
                }`}
            >
              <Users className="h-3 w-3" />
              Semua Role
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeRoleTab === 'all' ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-500'
                }`}>{waitingEntries.length}</span>
            </button>
            {projectRoles.map((role) => {
              const count = waitingEntries.filter((e) => (e.role_ids || []).includes(role.id)).length
              const color = getRoleColor(role.id, projectRoles)
              const isActive = activeRoleTab === role.id
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRoleTab(role.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${isActive
                    ? `${color.bg} ${color.text} ${color.border} ring-1 ring-offset-1`
                    : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:text-slate-700'
                    }`}
                >
                  <Tag className="h-3 w-3" />
                  {role.name}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? `${color.bg} ${color.text}` : 'bg-slate-100 text-slate-500'
                    }`}>{count}</span>
                </button>
              )
            })}
          </div>

          {/* Filtered entries */}
          <div className="space-y-2">
            {visibleEntries.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-6 text-center">
                <p className="text-xs text-slate-400">Tidak ada pemain di role ini</p>
              </div>
            ) : (
              visibleEntries.map((entry, index) => (
                <WaitingEntryCard key={entry.id} entry={entry} index={index} project={project} projectRoles={projectRoles} />
              ))
            )}
          </div>

          {/* Lazy Load Button */}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleCount(prev => prev + 25)}
                className="text-xs text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
              >
                Tampilkan Lebih Banyak ({filteredByRole.length - visibleCount} lagi)
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Flat list when no roles */
        <div className="space-y-4">
          <div className="space-y-2">
            {waitingEntries.slice(0, visibleCount).map((entry, index) => (
              <WaitingEntryCard key={entry.id} entry={entry} index={index} project={project} projectRoles={projectRoles} />
            ))}
          </div>
          {waitingEntries.length > visibleCount && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleCount(prev => prev + 25)}
                className="text-xs text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
              >
                Tampilkan Lebih Banyak ({waitingEntries.length - visibleCount} lagi)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
