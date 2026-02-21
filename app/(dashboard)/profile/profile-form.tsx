'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Loader2, Plus, Trash2, Globe, Github, Twitter, Instagram, Youtube, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface SocialLink {
  platform: string
  url: string
}

interface ProfileFormProps {
  initialProfile: {
    id: string
    email: string
    full_name: string | null
    social_links: SocialLink[] | null
  }
}

const PLATFORMS = [
  { name: 'Discord', icon: MessageSquare },
  { name: 'Instagram', icon: Instagram },
  { name: 'Twitter / X', icon: Twitter },
  { name: 'Youtube', icon: Youtube },
  { name: 'Github', icon: Github },
  { name: 'Lainnya', icon: Globe },
]

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState(initialProfile.full_name || '')
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialProfile.social_links || [])

  const handleAddLink = () => {
    setSocialLinks([...socialLinks, { platform: 'Discord', url: '' }])
  }

  const handleRemoveLink = (index: number) => {
    const newLinks = [...socialLinks]
    newLinks.splice(index, 1)
    setSocialLinks(newLinks)
  }

  const handleUpdateLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks]
    newLinks[index][field] = value
    setSocialLinks(newLinks)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const { error } = await (supabase
        .from('profiles') as any)
        .update({
          full_name: fullName,
          social_links: socialLinks as any, // Cast because of Json mismatch
          updated_at: new Date().toISOString()
        } as Database['public']['Tables']['profiles']['Update'])
        .eq('id', initialProfile.id)

      if (error) throw error

      toast.success('Profil berhasil diperbarui!')
      router.refresh()
    } catch (err) {
      console.error('Error saving profile:', err)
      toast.error('Gagal menyimpan profil')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-8">
      {/* Basic Info */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 shadow-sm border-0 bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
          <CardDescription>Ubah nama tampilan Anda yang akan dilihat oleh orang lain.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={initialProfile.email}
              disabled
              className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 italic font-mono">ID: {initialProfile.id}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 shadow-sm border-0 bg-white dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sosial Media & Tautan</CardTitle>
            <CardDescription>Tambahkan link sosial media agar viewer atau streamer mudah menghubungi Anda.</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddLink}
            className="border-indigo-100 bg-indigo-50/30 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Tambah
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialLinks.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30">
              <Globe className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Belum ada tautan sosial media.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {socialLinks.map((link, index) => {
                const SelectedIcon = PLATFORMS.find(p => p.name === link.platform)?.icon || Globe

                return (
                  <div key={index} className="flex gap-3 group items-start">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="relative">
                        <SelectedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select
                          className="w-full h-10 pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                          value={link.platform}
                          onChange={(e) => handleUpdateLink(index, 'platform', e.target.value)}
                        >
                          {PLATFORMS.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <Input
                          placeholder="https://..."
                          value={link.url}
                          onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                          className="border-slate-200 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLink(index)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-10 w-10 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Perubahan'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
