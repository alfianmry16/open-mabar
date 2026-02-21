'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { MemberManagement } from './member-management'
import {
  ArrowLeft,
  Loader2,
  Save,
  Trash2,
  Plus,
  X,
  GripVertical,
  AlertTriangle,
  CheckCircle2,
  Settings as SettingsIcon,
  Gamepad,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { InviteLink } from './member-management'

interface Project {
  id: string
  owner_id: string
  name: string
  slug: string
  game_name: string
  is_repeatable: boolean
  has_fast_track: boolean
  is_active: boolean
}

interface ProjectRole {
  id: string
  project_id: string
  name: string
  display_order: number
}

interface Member {
  id: string
  project_id: string
  user_id: string
  role: 'owner' | 'moderator'
  created_at: string
  profiles: {
    full_name: string | null
    email: string
    avatar_url: string | null
  }
}

interface Props {
  project: Project
  initialRoles: ProjectRole[]
  initialMembers: Member[]
  initialInviteLinks: InviteLink[]
}

export function ProjectSettings({ project, initialRoles, initialMembers, initialInviteLinks }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<'general' | 'roles' | 'members'>('general')

  // Project form state
  const [formData, setFormData] = useState({
    name: project.name,
    gameName: project.game_name,
    isRepeatable: project.is_repeatable,
    hasFastTrack: project.has_fast_track,
    isActive: project.is_active,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Roles state
  const [roles, setRoles] = useState<ProjectRole[]>(initialRoles)
  const [newRoleName, setNewRoleName] = useState('')
  const [isAddingRole, setIsAddingRole] = useState(false)

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Save project settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSaveSuccess(false)

    const { error: updateError } = await (supabase
      .from('projects') as any)
      .update({
        name: formData.name,
        game_name: formData.gameName,
        is_repeatable: formData.isRepeatable,
        has_fast_track: formData.hasFastTrack,
        is_active: formData.isActive,
      } as Database['public']['Tables']['projects']['Update'])
      .eq('id', project.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
    setIsSaving(false)
  }

  // Add role
  const addRole = async () => {
    if (!newRoleName.trim()) return
    setIsAddingRole(true)

    const { data, error: roleError } = await (supabase
      .from('project_roles') as any)
      .insert({
        project_id: project.id,
        name: newRoleName.trim(),
        display_order: roles.length,
      } as Database['public']['Tables']['project_roles']['Insert'])
      .select()
      .single()

    if (!roleError && data) {
      setRoles([...roles, data as unknown as ProjectRole])
      setNewRoleName('')
    }
    setIsAddingRole(false)
  }

  // Delete role
  const deleteRole = async (roleId: string) => {
    await (supabase.from('project_roles') as any).delete().eq('id', roleId)
    setRoles(roles.filter((r) => r.id !== roleId))
  }

  // Delete project
  const handleDeleteProject = async () => {
    if (deleteConfirmText !== project.name) return
    setIsDeleting(true)

    await (supabase.from('projects') as any).delete().eq('id', project.id)
    router.push('/projects')
  }

  const tabs = [
    { id: 'general', label: 'Pengaturan Umum', icon: SettingsIcon },
    { id: 'roles', label: 'Game Roles', icon: Gamepad },
    { id: 'members', label: 'Moderator', icon: Users },
  ] as const

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Back */}
      <Button variant="ghost" asChild className="mb-6 -ml-3">
        <Link href={`/projects/${project.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Antrian
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pengaturan Project</h1>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar Tabs */}
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-white" : "text-slate-400")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <h2 className="font-bold text-slate-900 dark:text-white">Informasi Umum</h2>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-5">
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  {saveSuccess && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <p className="text-sm text-emerald-600 font-medium">Pengaturan berhasil disimpan!</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Project</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gameName">Nama Game</Label>
                    <Input
                      id="gameName"
                      value={formData.gameName}
                      onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* High-visibility Toggle Card */}
                    <div className={cn(
                      "p-5 rounded-2xl border-2 transition-all duration-300",
                      formData.isActive
                        ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 ring-4 ring-indigo-50 dark:ring-indigo-950/30"
                        : "bg-red-50/30 dark:bg-red-950/20 border-red-100 dark:border-red-800"
                    )}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="isActive" className="text-base font-bold text-slate-900 dark:text-white cursor-pointer">
                            Status Antrian: {formData.isActive ? 'AKTIF (Publik Bisa Lihat)' : 'NONAKTIF (Sembunyi)'}
                          </Label>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {formData.isActive
                              ? "Semua orang bisa melihat daftar antrian dan posisi pemain."
                              : "Daftar antrian akan disembunyikan dari publik. Hanya Anda dan moderator yang bisa lihat."
                            }
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant={formData.isActive ? "default" : "outline"}
                          onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                          className={cn(
                            "h-11 px-6 font-bold shadow-sm transition-all",
                            formData.isActive
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                              : "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          )}
                        >
                          {formData.isActive ? 'Matikan Antrian' : 'Aktifkan Antrian'}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                      <Checkbox
                        id="isRepeatable"
                        checked={formData.isRepeatable}
                        onCheckedChange={(v) => setFormData({ ...formData, isRepeatable: v as boolean })}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="isRepeatable" className="cursor-pointer">Tampilkan Jumlah Game (Repeatable)</Label>
                        <p className="text-xs text-slate-400">Menampilkan jumlah game yang dimainkan oleh setiap pemain</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                      <Checkbox
                        id="hasFastTrack"
                        checked={formData.hasFastTrack}
                        onCheckedChange={(v) => setFormData({ ...formData, hasFastTrack: v as boolean })}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="hasFastTrack" className="cursor-pointer">Aktifkan Fast Track / VIP</Label>
                        <p className="text-xs text-slate-400">Buat antrian prioritas untuk subscriber atau tamu spesial</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" disabled={isSaving} className="h-11 shadow-indigo-100">
                      {isSaving ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                      ) : (
                        <><Save className="mr-2 h-4 w-4" /> Simpan Perubahan</>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* DANGER ZONE */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-800 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-red-50 bg-red-50/30">
                  <h2 className="font-bold text-red-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Zona Berbahaya
                  </h2>
                </div>
                <div className="p-6">
                  {!showDeleteConfirm ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Hapus Project</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Semua data termasuk antrian dan role akan dihapus permanen
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Hapus Project
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-red-600 font-medium">
                        Ketik <span className="font-mono bg-red-50 px-1.5 py-0.5 rounded">{project.name}</span> untuk mengkonfirmasi:
                      </p>
                      <Input
                        placeholder="Ketik nama project..."
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="h-11 border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          disabled={deleteConfirmText !== project.name || isDeleting}
                          onClick={handleDeleteProject}
                          className="h-11"
                        >
                          {isDeleting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghapus...</>
                          ) : (
                            <><Trash2 className="mr-2 h-4 w-4" /> Ya, Hapus Permanen</>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                          className="h-11"
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h2 className="font-bold text-slate-900 dark:text-white">Game Roles</h2>
                <p className="text-xs text-slate-400 mt-0.5">Kategori role untuk antrian (contoh: Tank, Mage, Jungler)</p>
              </div>
              <div className="p-6">
                {roles.length > 0 ? (
                  <div className="space-y-2 mb-6">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 group hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-slate-300" />
                          <span className="font-medium text-slate-700 dark:text-slate-300">{role.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRole(role.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 hover:bg-red-50 h-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 mb-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <Gamepad className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500">Belum ada role</p>
                    <p className="text-xs text-slate-400 mt-1">Tambahkan role untuk mengkategorikan pemain</p>
                  </div>
                )}

                <div className="flex gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <Input
                    placeholder="Nama role baru... (contoh: Tank)"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRole(); } }}
                    className="h-11 bg-white"
                  />
                  <Button
                    onClick={addRole}
                    disabled={isAddingRole || !newRoleName.trim()}
                    className="h-11 shrink-0 px-6"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <MemberManagement
              projectId={project.id}
              initialMembers={initialMembers}
              initialInviteLinks={initialInviteLinks}
            />
          )}
        </div>
      </div>
    </div>
  )
}
