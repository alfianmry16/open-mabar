'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Loader2,
  Link as LinkIcon,
  Trash2,
  Shield,
  Search,
  Check,
  Copy,
  Plus,
  X,
  History,
} from 'lucide-react'
import Image from 'next/image'

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

export interface InviteLink {
  id: string
  project_id: string
  token: string
  created_by: string
  expires_at: string | null
  max_uses: number | null
  uses_count: number
  is_active: boolean
  created_at: string
}

interface Profile {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
}

interface Props {
  projectId: string
  initialMembers: Member[]
  initialInviteLinks: InviteLink[]
}

export function MemberManagement({ projectId, initialMembers, initialInviteLinks }: Props) {
  const supabase = createClient()
  const [members, setMembers] = useState<Member[]>(initialMembers)

  // Email search state
  const [searchEmail, setSearchEmail] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<Profile | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // Invite link state
  const [inviteLinks, setInviteLinks] = useState<InviteLink[]>(initialInviteLinks)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Search user by email
  const handleSearch = async () => {
    if (!searchEmail.trim()) return
    setIsSearching(true)
    setSearchError(null)
    setSearchResult(null)

    const { data, error } = await (supabase.from('profiles') as any)
      .select('*')
      .eq('email', searchEmail.trim())
      .single()

    if (error) {
      setSearchError('Pengguna tidak ditemukan')
    } else {
      setSearchResult(data)
    }
    setIsSearching(false)
  }

  // Add moderator by user id
  const addModerator = async (userId: string) => {
    setIsAdding(true)
    const { data, error } = await (supabase
      .from('project_members') as any)
      .insert({
        project_id: projectId,
        user_id: userId,
        role: 'moderator'
      } as Database['public']['Tables']['project_members']['Insert'])
      .select('*, profiles:user_id(*)')
      .single()

    if (!error && data) {
      setMembers([...members, data as unknown as Member])
      setSearchResult(null)
      setSearchEmail('')
    }
    setIsAdding(false)
  }

  // Remove member
  const removeMember = async (memberId: string) => {
    const { error } = await (supabase.from('project_members') as any)
      .delete()
      .eq('id', memberId)

    if (!error) {
      setMembers(members.filter(m => m.id !== memberId))
    }
  }

  // Generate invite link
  const generateInviteLink = async () => {
    setIsGenerating(true)
    const token = crypto.randomUUID().replace(/-/g, '')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await (supabase
      .from('invite_links') as any)
      .insert({
        project_id: projectId,
        token,
        created_by: user.id,
        max_uses: 5 // Default to 5 uses
      } as Database['public']['Tables']['invite_links']['Insert'])
      .select()
      .single()

    if (!error && data) {
      setInviteLinks([data, ...inviteLinks])
    }
    setIsGenerating(false)
  }

  // Copy link to clipboard
  const copyToClipboard = (token: string, id: string) => {
    const url = `${window.location.origin}/invite/${token}`
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* ===== MEMBER LIST ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 dark:text-white">Moderator & Anggota</h2>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            {members.length} Total
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {members.map((member) => (
            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
                  {member.profiles.avatar_url ? (
                    <Image src={member.profiles.avatar_url} alt={member.profiles.full_name || ''} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-slate-500">
                      {member.profiles.full_name?.charAt(0).toUpperCase() || member.profiles.email.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {member.profiles.full_name || 'Tanpa Nama'}
                    </span>
                    {member.role === 'owner' && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Owner</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{member.profiles.email}</p>
                </div>
              </div>

              {member.role !== 'owner' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMember(member.id)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===== ADD BY EMAIL ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white">Tambah Moderator Baru</h2>
          <p className="text-xs text-slate-400 mt-0.5">Cari pengguna berdasarkan alamat email mereka</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Teman@email.com"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                className="pl-10 h-11"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !searchEmail.trim()} className="h-11 px-6">
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cari'}
            </Button>
          </div>

          {searchError && <p className="text-xs text-red-500 flex items-center gap-1.5"><X className="h-3 w-3" /> {searchError}</p>}

          {searchResult && (
            <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border-2 border-indigo-100 dark:border-indigo-800">
                  <span className="text-sm font-bold text-indigo-600">
                    {searchResult.full_name?.charAt(0).toUpperCase() || searchResult.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{searchResult.full_name || 'Tanpa Nama'}</p>
                  <p className="text-xs text-slate-500">{searchResult.email}</p>
                </div>
              </div>
              <Button
                onClick={() => addModerator(searchResult.id)}
                disabled={isAdding || members.some(m => m.user_id === searchResult.id)}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1.5" /> Tambahkan</>}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ===== INVITE LINKS ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white">Invite Link</h2>
          <p className="text-xs text-slate-400 mt-0.5">Bagikan link ini agar teman Anda bisa bergabung sendiri</p>
        </div>
        <div className="p-6">
          <Button
            onClick={generateInviteLink}
            disabled={isGenerating}
            variant="outline"
            className="w-full h-11 border-dashed border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <><LinkIcon className="h-4 w-4 mr-2" /> Buat Invite Link Baru</>
            )}
          </Button>

          {inviteLinks.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <History className="h-3 w-3" /> Link Aktif
              </h3>
              {inviteLinks.map(link => (
                <div key={link.id} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 group">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs font-mono text-slate-500 truncate">
                      {window.location.origin}/invite/{link.token}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Maks {link.max_uses} penggunaan</p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(link.token, link.id)}
                    className="h-8 shadow-none"
                  >
                    {copiedId === link.id ? (
                      <><Check className="h-3 w-3 mr-1.5 text-emerald-600" /> Disalin</>
                    ) : (
                      <><Copy className="h-3 w-3 mr-1.5" /> Salin</>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
