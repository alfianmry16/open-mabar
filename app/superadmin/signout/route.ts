import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const headersList = await headers()
  const origin = headersList.get('origin') || headersList.get('referer') || 'http://localhost:3000'
  const baseUrl = new URL(origin).origin

  return NextResponse.redirect(new URL('/superadmin/login', baseUrl), {
    status: 302,
  })
}
