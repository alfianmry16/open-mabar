// Queue Manager Types

export interface SocialLink {
  platform: string
  url: string
}

export interface Profile {
  id: string
  full_name: string | null
  email?: string
  avatar_url?: string | null
  social_links?: SocialLink[] | null
}

export interface QueueEntry {
  id: string
  project_id: string
  user_id: string | null
  role_id: string | null
  role_ids: string[] | null
  game_id: string | null
  display_name: string | null
  status: 'waiting' | 'playing' | 'done'
  games_requested: number
  games_played: number
  is_fast_track: boolean
  joined_at: string
  started_at: string | null
  completed_at: string | null
  profiles: Profile | null
}

export interface Project {
  id: string
  owner_id: string
  name: string
  slug: string
  game_name: string
  is_repeatable: boolean
  has_fast_track: boolean
  is_active: boolean
  profiles?: Profile | null
}

export interface ProjectRole {
  id: string
  name: string
  display_order: number
}

export interface QueueManagerProps {
  project: Project
  initialEntries: QueueEntry[]
  projectRoles: ProjectRole[]
  isOwner: boolean
  currentUserId?: string
  isPublicView?: boolean
}
