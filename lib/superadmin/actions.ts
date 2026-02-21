'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleFeedbackFeatured(id: string, featured: boolean): Promise<boolean> {
  const supabase = await createClient()

  // Verify superadmin status before mutation
  const { data: isAdmin } = await supabase.rpc('check_is_superadmin' as any)
  if (!isAdmin) throw new Error('Unauthorized')

  const { data, error } = await supabase.rpc('toggle_feedback_featured', {
    id_param: id,
    val_param: featured
  } as any)

  if (error) throw error

  revalidatePath('/superadmin/feedback')
  revalidatePath('/') // Revalidate landing page too

  return data === true
}
