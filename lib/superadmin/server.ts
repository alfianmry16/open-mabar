import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  SuperAdminProfile,
  AdminStats,
  RecentUser,
  UserGrowth,
  FeedbackEntry,
  FeaturedTestimonial
} from './types'

export * from './types'

export async function isSuperAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  // Use SECURITY DEFINER RPC to bypass RLS
  const { data } = await supabase.rpc('check_is_superadmin' as any)
  return data === true
}

export async function requireSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/superadmin/login')
  }

  // Use SECURITY DEFINER RPC to bypass RLS
  const { data: profileData } = await supabase.rpc('get_superadmin_profile' as any)

  const profileArr = profileData as unknown as SuperAdminProfile[]
  const profile = Array.isArray(profileArr) ? profileArr[0] : profileArr as unknown as SuperAdminProfile

  if (!profile?.is_admin) {
    redirect('/superadmin/login')
  }

  return {
    user,
    profile: {
      full_name: profile.admin_full_name,
      email: profile.admin_email,
    }
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_admin_stats')

  if (error) throw error
  return data as unknown as AdminStats
}

export async function getRecentUsers(limit: number = 10): Promise<RecentUser[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_recent_users', { limit_count: limit } as any)

  if (error) throw error
  return (data as unknown as RecentUser[]) || []
}

export async function getUserGrowth(): Promise<UserGrowth[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_user_growth')

  if (error) throw error
  return (data as unknown as UserGrowth[]) || []
}

export async function getAllFeedback(): Promise<FeedbackEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_all_feedback')

  if (error) throw error
  return (data as unknown as FeedbackEntry[]) || []
}

export async function getFeaturedTestimonials(): Promise<FeaturedTestimonial[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_featured_testimonials')

  if (error) throw error
  return (data as unknown as FeaturedTestimonial[]) || []
}

