'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail, Lock, User, Gamepad2, CheckCircle2 } from 'lucide-react'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/projects'
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak sama')
      setIsLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      setIsLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setIsLoading(false)
        return
      }

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        setSuccess(true)
        setIsLoading(false)
        return
      }

      // If auto-confirmed, create profile and redirect
      if (data?.user && data.session) {
        await (supabase.from('profiles') as any).upsert({
          id: data.user.id,
          email: data.user.email!,
          full_name: formData.fullName,
          updated_at: new Date().toISOString(),
        } as Database['public']['Tables']['profiles']['Insert'])

        router.push(returnTo)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setIsLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Registrasi Berhasil!</h2>
            <p className="text-gray-500">
              Kami telah mengirim email konfirmasi ke <br />
              <span className="font-semibold text-gray-700">{formData.email}</span>
            </p>
            <p className="text-sm text-gray-400">
              Silakan cek inbox atau folder spam untuk mengkonfirmasi akun Anda.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/login">Kembali ke halaman Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 relative overflow-hidden">
        {/* Floating Decorations */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-32 left-16 w-48 h-48 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="flex flex-col justify-center px-16 z-10 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Gamepad2 className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold">Mabar</h1>
          </div>
          <h2 className="text-3xl font-semibold mb-4 leading-tight">
            Bergabung dengan<br />
            <span className="text-white/80">Komunitas Streamer</span>
          </h2>
          <p className="text-lg text-white/70 max-w-md leading-relaxed">
            Buat akun gratis dan mulai kelola antrian open mabar kamu. Mudah, cepat, dan real-time.
          </p>

          {/* Benefits */}
          <div className="mt-12 space-y-4">
            {[
              'Gratis selamanya untuk streamer',
              'Setup dalam 2 menit',
              'Antrian real-time untuk viewer',
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-300" />
                <span className="text-white/80">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Mabar</h1>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Buat Akun</CardTitle>
              <CardDescription className="text-base text-gray-500">
                Daftar gratis untuk mulai mengelola antrian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Nama lengkap kamu"
                      className="pl-10 h-11 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      className="pl-10 h-11 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      className="pl-10 h-11 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Konfirmasi Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Ulangi password"
                      className="pl-10 h-11 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500">Password tidak sama</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Membuat akun...
                    </>
                  ) : (
                    'Daftar'
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Sudah punya akun?{' '}
                  <Link
                    href={`/login${returnTo !== '/projects' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            &copy; 2026 Mabar. Built for streamers.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
