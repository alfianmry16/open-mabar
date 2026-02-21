export interface SuperAdminProfile {
  is_admin: boolean
  admin_full_name: string | null
  admin_email: string
}

export interface AdminStats {
  total_users: number
  new_users_7d: number
  new_users_30d: number
  total_projects: number
  active_projects: number
  total_queues: number
  queues_waiting: number
  queues_playing: number
  queues_done: number
}

export interface RecentUser {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface UserGrowth {
  month: string
  user_count: number
}

export interface FeedbackEntry {
  id: string
  user_id: string
  rating: number | null
  category: string
  message: string
  is_public: boolean
  is_featured: boolean
  created_at: string
  full_name: string | null
  email: string
  avatar_url: string | null
}

export interface FeaturedTestimonial {
  id: string
  rating: number
  message: string
  full_name: string | null
  avatar_url: string | null
}
