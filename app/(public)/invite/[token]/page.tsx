import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Shield, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params
  const supabase = await createClient()

  // 1. Validate Token
  const query = (supabase
    .from('invite_links') as any)
    .select('*, projects(*)')
    .eq('token', token)
    .eq('is_active', true)
    .single()

  type InviteWithProject = NonNullable<Awaited<typeof query>['data']>
  const { data: invite, error: inviteError } = await query

  if (inviteError || !invite) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-md">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm">
            <div className="h-16 w-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Undangan Tidak Valid</h1>
            <p className="text-slate-500 mb-8">Link undangan ini mungkin sudah kadaluarsa atau tidak ada.</p>
            <Button asChild className="w-full h-12">
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Intermediate variable to help TS with narrowing on joined data
  const inviteTyped = invite as InviteWithProject

  // Check expiry if exists
  if (inviteTyped.expires_at && new Date(inviteTyped.expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-md">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm">
            <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Undangan Kadaluarsa</h1>
            <p className="text-slate-500 mb-8">Link ini sudah tidak berlaku lagi.</p>
            <Button asChild className="w-full h-12">
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Check usage count
  if (inviteTyped.max_uses && (inviteTyped.uses_count || 0) >= inviteTyped.max_uses) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-md">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm">
            <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Kapasitas Penuh</h1>
            <p className="text-slate-500 mb-8">Undangan ini sudah mencapai batas maksimum penggunaan.</p>
            <Button asChild className="w-full h-12">
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()
  const project = inviteTyped.projects

  // 4. Handle Authenticated Flow (Auto-join or Redirect)
  if (user) {
    // Check if already a member
    const { data: existingMember } = await (supabase
      .from('project_members') as any)
      .select('role')
      .eq('project_id', inviteTyped.project_id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingMember) {
      // Already a member, go to project
      redirect(`/projects/${inviteTyped.project_id}`)
    }

    // Not a member yet, AUTO JOIN via RPC (to bypass RLS and handle atomicity)
    const { data: joinedProjectId, error: joinError } = await (supabase as any).rpc('join_project_via_invite', {
      link_token: token
    })

    if (!joinError && joinedProjectId) {
      // Success! Redirect to project
      redirect(`/projects/${joinedProjectId}`)
    }

    // If error joining, we'll continue and show the manual button as fallback
    if (joinError) {
      console.error('Join error:', joinError)
    }
  }

  // Action to handle join (for fallback or non-logged in)
  async function joinProject() {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      redirect(`/login?returnTo=/invite/${token}`)
    }

    // If they were already logged in but auto-join failed, clicking the button reloads
    // which triggers the auto-join logic in the render cycle again.
    redirect(`/invite/${token}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-20 max-w-lg">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="h-20 w-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-200 rotate-3">
            <Shield className="h-10 w-10" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
            Undangan Moderator
          </h1>
          <p className="text-slate-500 mb-8 text-lg">
            Anda diundang untuk menjadi moderator di project <span className="font-bold text-slate-800">&quot;{project?.name}&quot;</span>.
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Kelola Antrian</p>
                <p className="text-sm text-slate-500">Bantu streamer menarik pemain dan menyelesaikan sesi game.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Kontrol Real-time</p>
                <p className="text-sm text-slate-500">Akses fitur manajemen pemain yang sinkron secara instan.</p>
              </div>
            </div>
          </div>

          <form action={joinProject}>
            <Button size="lg" className="w-full h-14 text-lg font-bold shadow-lg shadow-indigo-100 group">
              {user ? 'Gabung Sekarang' : 'Login untuk Bergabung'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Dengan bergabung, Anda menyetujui kebijakan moderator yang ditentukan oleh owner project.
          </p>
        </div>
      </div>
    </div>
  )
}
