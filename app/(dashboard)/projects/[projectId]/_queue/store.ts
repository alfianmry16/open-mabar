import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database.types'
import type { QueueEntry, Project, ProjectRole } from './types'

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AddForm {
  gameId: string
  displayName: string
  gamesRequested: number
  isFastTrack: boolean
  roleIds: string[]
}

const defaultAddForm: AddForm = {
  gameId: '',
  displayName: '',
  gamesRequested: 1,
  isFastTrack: false,
  roleIds: [],
}

interface QueueState {
  // Core data
  entries: QueueEntry[]
  project: Project | null
  projectRoles: ProjectRole[]
  isOwner: boolean

  // UI state
  copiedUrl: boolean
  copiedGameId: string | null
  showAddForm: boolean
  isAdding: boolean
  error: string | null
  activeRoleTab: string
  searchQuery: string
  vipFilter: 'all' | 'vip' | 'regular'
  addForm: AddForm

  // Actions
  init: (project: Project, initialEntries: QueueEntry[], projectRoles: ProjectRole[], isOwner: boolean) => void
  refetchEntries: () => Promise<void>
  refetchProject: () => Promise<void>
  refetchRoles: () => Promise<void>
  addPlayer: () => Promise<void>
  updateStatus: (entryId: string, status: 'waiting' | 'playing' | 'done') => Promise<void>
  incrementGames: (entryId: string, currentPlayed: number) => Promise<void>
  incrementMaxGames: (entryId: string, currentRequested: number) => Promise<void>
  removeEntry: (entryId: string) => Promise<void>
  toggleFastTrack: (entryId: string, current: boolean) => Promise<void>
  copyPublicUrl: (slug: string) => Promise<void>
  copyGameId: (gameId: string) => Promise<void>
  toggleRole: (roleId: string) => void
  setActiveRoleTab: (tab: string) => void
  setSearchQuery: (query: string) => void
  setVipFilter: (filter: 'all' | 'vip' | 'regular') => void
  setShowAddForm: (show: boolean) => void
  setAddFormField: <K extends keyof AddForm>(field: K, value: AddForm[K]) => void
  resetAddForm: () => void
  toggleProjectStatus: () => Promise<void>
  setError: (error: string | null) => void
}

export const useQueueStore = create<QueueState>((set, get) => ({
  // Core data
  entries: [],
  project: null,
  projectRoles: [],
  isOwner: false,

  // UI state
  copiedUrl: false,
  copiedGameId: null,
  showAddForm: false,
  isAdding: false,
  error: null,
  activeRoleTab: 'all',
  searchQuery: '',
  vipFilter: 'all',
  addForm: { ...defaultAddForm },

  // Actions
  init: (project, initialEntries, projectRoles, isOwner) => {
    set({ project, entries: initialEntries, projectRoles, isOwner })
  },

  refetchEntries: async () => {
    const { project } = get()
    if (!project) return
    const { data } = await supabase
      .from('queue_entries')
      .select('*, profiles:user_id(id, full_name, email, avatar_url)')
      .eq('project_id', project.id)
      .order('is_fast_track', { ascending: false })
      .order('joined_at', { ascending: true })
    if (data) set({ entries: data as unknown as QueueEntry[] })
  },

  refetchProject: async () => {
    const { project } = get()
    if (!project) return
    const { data } = await supabase
      .from('projects')
      .select('*, profiles:owner_id(*)')
      .eq('id', project.id)
      .single()
    if (data) set({ project: data as unknown as Project })
  },

  refetchRoles: async () => {
    const { project } = get()
    if (!project) return
    const { data } = await supabase
      .from('project_roles')
      .select('*')
      .eq('project_id', project.id)
      .order('display_order', { ascending: true })
    if (data) set({ projectRoles: data as unknown as ProjectRole[] })
  },

  addPlayer: async () => {
    const { project, addForm, isOwner, entries } = get()
    if (!project || !addForm.gameId.trim()) return

    // Guard: Only owners/moderators can add players
    if (!isOwner) {
      set({ error: 'Hanya owner/moderator yang bisa menambah pemain' })
      return
    }

    set({ isAdding: true, error: null })

    try {
      // Check duplicate ONLY for ACTIVE entries (waiting or playing)
      const activeEntry = entries.find(
        (e) => e.game_id === addForm.gameId.trim() && e.status !== 'done'
      )

      if (activeEntry) {
        // If already in queue (waiting/playing), just increase their target games (requested)
        await (supabase.from('queue_entries') as any)
          .update({
            games_requested: activeEntry.games_requested + (project.is_repeatable ? addForm.gamesRequested : 1)
          } as Database['public']['Tables']['queue_entries']['Update'])
          .eq('id', activeEntry.id)

        set({ addForm: { ...defaultAddForm }, showAddForm: false })
        await get().refetchEntries()
        set({ isAdding: false })
        return
      }

      const { error: insertError } = await (supabase.from('queue_entries') as any).insert({
        project_id: project.id,
        game_id: addForm.gameId.trim(),
        display_name: addForm.displayName.trim() || null,
        games_requested: project.is_repeatable ? addForm.gamesRequested : 1,
        is_fast_track: project.has_fast_track ? addForm.isFastTrack : false,
        role_ids: addForm.roleIds.length > 0 ? addForm.roleIds : null,
        status: 'waiting'
      } as Database['public']['Tables']['queue_entries']['Insert'])

      if (insertError) {
        set({ error: insertError.message })
      } else {
        set({ addForm: { ...defaultAddForm }, showAddForm: false })
        await get().refetchEntries()
      }
    } catch {
      set({ error: 'Gagal menambahkan pemain' })
    }
    set({ isAdding: false })
  },

  updateStatus: async (entryId, status) => {
    await (supabase.from('queue_entries') as any)
      .update({ status } as Database['public']['Tables']['queue_entries']['Update'])
      .eq('id', entryId)
    await get().refetchEntries()
  },

  incrementGames: async (entryId, currentPlayed) => {
    const { entries } = get()
    const entry = entries.find(e => e.id === entryId)
    // Guard: don't increment if already at max
    if (entry && entry.games_played >= entry.games_requested) return

    await (supabase.from('queue_entries') as any)
      .update({ games_played: currentPlayed + 1 } as Database['public']['Tables']['queue_entries']['Update'])
      .eq('id', entryId)
    await get().refetchEntries()
  },

  incrementMaxGames: async (entryId, currentRequested) => {
    await (supabase.from('queue_entries') as any)
      .update({ games_requested: currentRequested + 1 } as Database['public']['Tables']['queue_entries']['Update'])
      .eq('id', entryId)
    await get().refetchEntries()
  },

  removeEntry: async (entryId) => {
    await (supabase.from('queue_entries') as any).delete().eq('id', entryId)
    set((state) => ({ entries: state.entries.filter((e) => e.id !== entryId) }))
  },

  toggleFastTrack: async (entryId, current) => {
    await (supabase.from('queue_entries') as any)
      .update({ is_fast_track: !current } as Database['public']['Tables']['queue_entries']['Update'])
      .eq('id', entryId)
    await get().refetchEntries()
  },

  copyPublicUrl: async (slug) => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/p/${slug}`
      : `/p/${slug}`
    await navigator.clipboard.writeText(url)
    set({ copiedUrl: true })
    setTimeout(() => set({ copiedUrl: false }), 2000)
  },

  copyGameId: async (gameId) => {
    await navigator.clipboard.writeText(gameId)
    set({ copiedGameId: gameId })
    setTimeout(() => set({ copiedGameId: null }), 1500)
  },

  toggleRole: (roleId) => {
    set((state) => ({
      addForm: {
        ...state.addForm,
        roleIds: state.addForm.roleIds.includes(roleId)
          ? state.addForm.roleIds.filter((id) => id !== roleId)
          : [...state.addForm.roleIds, roleId],
      },
    }))
  },

  setActiveRoleTab: (tab) => set({ activeRoleTab: tab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setVipFilter: (vipFilter) => set({ vipFilter }),
  setShowAddForm: (show) => set({ showAddForm: show, error: show ? null : get().error }),
  setAddFormField: (field, value) => set((state) => ({ addForm: { ...state.addForm, [field]: value } })),
  resetAddForm: () => set({ addForm: { ...defaultAddForm } }),
  toggleProjectStatus: async () => {
    const { project } = get()
    if (!project) return

    const { error } = await (supabase.from('projects') as any)
      .update({ is_active: !project.is_active } as Database['public']['Tables']['projects']['Update'])
      .eq('id', project.id)

    if (error) {
      set({ error: error.message })
    } else {
      await get().refetchProject()
      await get().refetchEntries()
    }
  },

  setError: (error) => set({ error }),
}))

// ── Stable derived-data hooks (shallow-compared, no infinite loops) ──

export function useWaitingEntries() {
  return useQueueStore(useShallow((s) => {
    let filtered = s.entries.filter((e) => e.status === 'waiting')

    // Search filter
    if (s.searchQuery.trim()) {
      const query = s.searchQuery.toLowerCase().trim()
      filtered = filtered.filter(e =>
        e.game_id?.toLowerCase().includes(query) ||
        e.display_name?.toLowerCase().includes(query)
      )
    }

    // VIP filter
    if (s.vipFilter === 'vip') {
      filtered = filtered.filter(e => e.is_fast_track)
    } else if (s.vipFilter === 'regular') {
      filtered = filtered.filter(e => !e.is_fast_track)
    }

    return filtered
  }))
}

export function usePlayingEntries() {
  return useQueueStore(useShallow((s) => s.entries.filter((e) => e.status === 'playing')))
}

export function useDoneEntries() {
  return useQueueStore(useShallow((s) => s.entries.filter((e) => e.status === 'done')))
}
