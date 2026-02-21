import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { ProfileForm } from '../profile/profile-form'
import { SecurityForm } from './security-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Shield, MessageSquare } from 'lucide-react'
import { FeedbackForm } from './feedback-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await (supabase
    .from('profiles') as any)
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Pengaturan Akun</h1>
          <p className="text-slate-500">
            Kelola profil publik dan keamanan akun Anda di sini.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm inline-flex">
            <TabsTrigger
              value="profile"
              className="px-6 py-2.5 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="px-6 py-2.5 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              <span>Keamanan</span>
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="px-6 py-2.5 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Feedback</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="focus-visible:outline-none">
            <ProfileForm initialProfile={profile as any} />
          </TabsContent>

          <TabsContent value="security" className="focus-visible:outline-none">
            <SecurityForm />
          </TabsContent>

          <TabsContent value="feedback" className="focus-visible:outline-none">
            <FeedbackForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
