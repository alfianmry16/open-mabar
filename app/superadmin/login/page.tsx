'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail, Lock, Shield, BarChart3, Users, Activity } from 'lucide-react'

export default function SuperAdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      // Check if this user is a superadmin using RPC (bypasses RLS)
      if (authData.user) {
        const { data: isSuperAdmin } = await supabase.rpc('check_is_superadmin' as any)

        if (!isSuperAdmin) {
          await supabase.auth.signOut()
          setError('Akun ini bukan superadmin. Akses ditolak.')
          setIsLoading(false)
          return
        }
      }

      router.push('/superadmin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Admin Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-16 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="flex flex-col justify-center px-16 z-10 text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
              <Shield className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Super Admin</h1>
              <p className="text-sm text-white/50 font-medium">Mabar Control Panel</p>
            </div>
          </div>

          <h2 className="text-3xl font-semibold mb-4 leading-tight">
            Monitoring &<br />
            <span className="text-indigo-400">Analytics Dashboard</span>
          </h2>
          <p className="text-lg text-white/50 max-w-md leading-relaxed">
            Pantau statistik pengguna, kelola project, dan lihat data real-time dari seluruh platform Mabar.
          </p>

          {/* Feature Cards */}
          <div className="mt-12 space-y-3">
            {[
              { icon: Users, label: 'User Statistics', desc: 'Track user growth & activity' },
              { icon: BarChart3, label: 'Analytics', desc: 'Detailed usage reports' },
              { icon: Activity, label: 'Live Monitoring', desc: 'Real-time queue activity' },
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <feat.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90">{feat.label}</p>
                  <p className="text-xs text-white/40">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-950">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Super Admin</h1>
              <p className="text-xs text-slate-500">Mabar Control Panel</p>
            </div>
          </div>

          <Card className="shadow-2xl border-0 bg-slate-900/80 backdrop-blur-sm border-slate-800">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
              <CardDescription className="text-base text-slate-400">
                Masukkan kredensial superadmin untuk mengakses dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-fade-in">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@mabar.app"
                      className="pl-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Masuk sebagai Admin
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-slate-600 mt-6">
            &copy; 2026 Mabar Admin Panel. Restricted access only.
          </p>
        </div>
      </div>
    </div>
  )
}
