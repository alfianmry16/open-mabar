'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Loader2, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export function SecurityForm() {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword.length < 6) {
      toast.error('Password minimal 6 karakter')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      })

      if (error) throw error

      toast.success('Password berhasil diperbarui!')
      setFormData({ newPassword: '', confirmPassword: '' })
    } catch (err) {
      console.error('Error updating password:', err)
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="border-slate-200/60 dark:border-slate-700/60 shadow-sm border-0 bg-white dark:bg-slate-900">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-md">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
            </div>
            <CardTitle className="text-xl">Keamanan Akun</CardTitle>
          </div>
          <CardDescription>
            Perbarui kata sandi Anda untuk menjaga keamanan akun.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdatePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="pl-10 pr-10 border-slate-200 focus:ring-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Ulangi password baru"
                  className="pl-10 border-slate-200 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memperbarui...
                </>
              ) : (
                'Ganti Password'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="border-red-100 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20">
        <CardHeader>
          <CardTitle className="text-red-700 text-lg">Tips Keamanan</CardTitle>
          <CardDescription className="text-red-600/70">
            Gunakan kombinasi huruf, angka, dan simbol untuk password yang lebih kuat. Jangan gunakan password yang sama dengan layanan lain.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
