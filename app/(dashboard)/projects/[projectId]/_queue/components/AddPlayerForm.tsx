'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Zap,
  Check,
  Tag,
} from 'lucide-react'
import type { Project, ProjectRole } from '../types'
import { getRoleColor } from '../helpers'
import { useQueueStore } from '../store'

interface AddPlayerFormProps {
  project: Project
  projectRoles: ProjectRole[]
}

export function AddPlayerForm({ project, projectRoles }: AddPlayerFormProps) {
  const {
    addForm,
    isAdding,
    error,
    setAddFormField,
    toggleRole,
    addPlayer,
    setShowAddForm,
    setError,
    isOwner,
  } = useQueueStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addPlayer()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 p-5 mb-4 animate-fade-in space-y-4">
      <h3 className="font-bold text-slate-800 dark:text-white text-sm">Tambah ke Antrian</h3>

      {/* Game ID */}
      <div className="space-y-1.5">
        <Label htmlFor="gameId" className="text-xs">ID Game *</Label>
        <Input
          id="gameId"
          placeholder="Masukkan Game ID / Username..."
          value={addForm.gameId}
          onChange={(e) => setAddFormField('gameId', e.target.value)}
          className="h-10"
          required
        />
      </div>

      {/* Display Name */}
      <div className="space-y-1.5">
        <Label htmlFor="displayName" className="text-xs">
          Nama <span className="text-slate-400">(opsional)</span>
        </Label>
        <Input
          id="displayName"
          placeholder="Nama tampilan..."
          value={addForm.displayName}
          onChange={(e) => setAddFormField('displayName', e.target.value)}
          className="h-10"
        />
      </div>

      {/* Role Selector (multiple checkboxes) */}
      {projectRoles.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-xs">Role <span className="text-slate-400">(bisa pilih lebih dari 1)</span></Label>
          <div className="flex flex-wrap gap-2">
            {projectRoles.map((role) => {
              const isSelected = addForm.roleIds.includes(role.id)
              const color = getRoleColor(role.id, projectRoles)
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggleRole(role.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${isSelected
                    ? `${color.bg} ${color.text} ${color.border} ring-2 ring-offset-1 ring-indigo-300`
                    : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                >
                  <Tag className="h-3 w-3" />
                  {role.name}
                  {isSelected && <Check className="h-3 w-3 ml-0.5" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Games Requested (if repeatable) */}
      {project.is_repeatable && (
        <div className="space-y-1.5">
          <Label htmlFor="gamesRequested" className="text-xs">Jumlah Game</Label>
          <Input
            id="gamesRequested"
            type="number"
            min={1}
            max={99}
            value={addForm.gamesRequested}
            onChange={(e) => setAddFormField('gamesRequested', parseInt(e.target.value) || 1)}
            className="h-10 w-24"
          />
        </div>
      )}

      {/* Fast Track toggle */}
      {project.has_fast_track && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={addForm.isFastTrack}
            onChange={(e) => setAddFormField('isFastTrack', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            Fast Track / VIP
          </span>
        </label>
      )}

      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="submit" size="sm" disabled={isAdding} className="h-10 sm:h-9 flex-1">
          {isAdding ? 'Memproses...' : 'Tambah ke Antrian'}
        </Button>
        {isOwner && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => { setShowAddForm(false); setError(null) }}
            className="h-10 sm:h-9 flex-1"
          >
            Batal
          </Button>
        )}
      </div>
    </form>
  )
}
