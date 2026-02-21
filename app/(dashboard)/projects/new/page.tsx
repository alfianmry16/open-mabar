'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { generateUniqueSlug } from '@/lib/utils/slugify'
import { ArrowLeft, Loader2, Gamepad2, Info } from 'lucide-react'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    gameName: '',
    isRepeatable: false,
    hasFastTrack: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Kamu harus login terlebih dahulu')
        setIsLoading(false)
        return
      }

      const slug = generateUniqueSlug(formData.name)

      const { data: project, error: projectError } = await (supabase
        .from('projects') as any)
        .insert({
          owner_id: user.id,
          name: formData.name,
          slug,
          game_name: formData.gameName,
          is_repeatable: formData.isRepeatable,
          has_fast_track: formData.hasFastTrack,
        })
        .select()
        .single()

      if (projectError) {
        setError(projectError.message)
        setIsLoading(false)
        return
      }

      router.push(`/projects/${project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Mabar</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-3">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
            <h1 className="text-2xl font-bold text-white">Buat Project Baru</h1>
            <p className="text-indigo-100 mt-1">Setup antrian open mabar untuk stream kamu</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Project *</Label>
                <Input
                  id="name"
                  placeholder="Contoh: Ranked Night Friday"
                  className="h-11"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-slate-400">
                  Nama yang mudah diingat untuk project ini
                </p>
              </div>

              {/* Game Name */}
              <div className="space-y-2">
                <Label htmlFor="gameName">Nama Game *</Label>
                <Input
                  id="gameName"
                  placeholder="Contoh: Mobile Legends, Valorant"
                  className="h-11"
                  value={formData.gameName}
                  onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Pengaturan Antrian</h3>
              </div>

              {/* Is Repeatable */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Checkbox
                  id="isRepeatable"
                  checked={formData.isRepeatable}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isRepeatable: checked as boolean })
                  }
                  disabled={isLoading}
                />
                <div className="space-y-1">
                  <Label htmlFor="isRepeatable" className="cursor-pointer">
                    Tampilkan Jumlah Game (Repeatable)
                  </Label>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Menampilkan jumlah game yang dimainkan oleh setiap pemain di dalam daftar antrian
                  </p>
                </div>
              </div>

              {/* Has Fast Track */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Checkbox
                  id="hasFastTrack"
                  checked={formData.hasFastTrack}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, hasFastTrack: checked as boolean })
                  }
                  disabled={isLoading}
                />
                <div className="space-y-1">
                  <Label htmlFor="hasFastTrack" className="cursor-pointer">
                    Aktifkan Fast Track / VIP
                  </Label>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Buat antrian prioritas untuk subscriber atau tamu spesial
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="flex gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-indigo-700 font-medium">Catatan</p>
                  <p className="text-xs text-indigo-500 mt-1 leading-relaxed">
                    Setelah project dibuat, kamu bisa menambahkan custom role (Tank, Mage, Jungler, dll) dan mengundang moderator untuk membantu mengelola antrian.
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isLoading} className="flex-1 h-11">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Membuat Project...
                    </>
                  ) : (
                    'Buat Project'
                  )}
                </Button>
                <Button type="button" variant="outline" asChild className="h-11">
                  <Link href="/projects">Batal</Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
