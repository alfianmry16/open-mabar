'use client'

import { Chrome } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function GoogleAuthButton() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error logging in:', error.message)
    }
  }

  return (
    <Button onClick={handleGoogleLogin} variant="outline" size="lg" className="w-full">
      <Chrome className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  )
}
