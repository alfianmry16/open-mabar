'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, Lock, User } from 'lucide-react'

type AuthMode = 'login' | 'register'

export function EmailPasswordAuthForm() {
  const router = useRouter()
  const supabase = createClient()
  const [mode, setMode] = useState<AuthMode>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === 'register') {
        // Register new user
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
          setSuccess('Registration successful! Please check your email to confirm your account.')
          setIsLoading(false)
          return
        }

        // If auto-confirmed, redirect to projects
        router.push('/projects')
        router.refresh()
      } else {
        // Login existing user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) {
          setError(signInError.message)
          setIsLoading(false)
          return
        }

        router.push('/projects')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Full Name (Register only) */}
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="pl-10"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required={mode === 'register'}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          {mode === 'register' && (
            <p className="text-xs text-gray-500">Minimum 6 characters</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'register' ? 'Creating Account...' : 'Signing In...'}
            </>
          ) : mode === 'register' ? (
            'Create Account'
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      {/* Toggle Mode */}
      <div className="text-center text-sm">
        {mode === 'login' ? (
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('register')}
              className="text-blue-600 hover:underline font-medium"
            >
              Create one
            </button>
          </p>
        ) : (
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
