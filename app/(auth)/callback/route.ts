import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { NextResponse } from 'next/server'
import { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/projects'

  // Handle email confirmation
  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // Get user data to create/update profile
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Upsert user profile
        const { error: profileError } = await (supabase
          .from('profiles') as any)
          .upsert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || null,
            updated_at: new Date().toISOString(),
          } as Database['public']['Tables']['profiles']['Insert'])

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to login with error
  return NextResponse.redirect(`${origin}/login?error=verification_failed`)
}
