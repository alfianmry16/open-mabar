// This file will be auto-generated from your Supabase database schema
// For now, we'll create placeholder types based on our schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          social_links: Json | null
          is_superadmin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          social_links?: Json | null
          is_superadmin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          social_links?: Json | null
          is_superadmin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          rating: number | null
          category: 'saran' | 'testimoni' | 'bug'
          message: string
          is_public: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rating?: number | null
          category: 'saran' | 'testimoni' | 'bug'
          message: string
          is_public?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rating?: number | null
          category?: 'saran' | 'testimoni' | 'bug'
          message?: string
          is_public?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          game_name: string
          is_repeatable: boolean
          max_games: number
          has_fast_track: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          game_name: string
          is_repeatable?: boolean
          max_games?: number
          has_fast_track?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          game_name?: string
          is_repeatable?: boolean
          max_games?: number
          has_fast_track?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      project_roles: {
        Row: {
          id: string
          project_id: string
          name: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          display_order?: number
          created_at?: string
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'owner' | 'moderator'
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: 'owner' | 'moderator'
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'owner' | 'moderator'
          created_at?: string
        }
      }
      queue_entries: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id?: string | null
          role_id?: string | null
          role_ids?: string[] | null
          game_id?: string | null
          display_name?: string | null
          status?: 'waiting' | 'playing' | 'done'
          games_requested?: number
          games_played?: number
          is_fast_track?: boolean
          joined_at?: string
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string | null
          role_id?: string | null
          role_ids?: string[] | null
          game_id?: string | null
          display_name?: string | null
          status?: 'waiting' | 'playing' | 'done'
          games_requested?: number
          games_played?: number
          is_fast_track?: boolean
          joined_at?: string
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invite_links: {
        Row: {
          id: string
          project_id: string
          token: string
          created_by: string
          expires_at: string | null
          max_uses: number | null
          uses_count: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          token: string
          created_by: string
          expires_at?: string | null
          max_uses?: number | null
          uses_count?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          token?: string
          created_by?: string
          expires_at?: string | null
          max_uses?: number | null
          uses_count?: number
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: null | object
    Functions: {
      join_project_via_invite: {
        Args: {
          link_token: string
        }
        Returns: string
      }
      get_admin_stats: {
        Args: Record<string, never>
        Returns: Json
      }
      get_recent_users: {
        Args: {
          limit_count?: number
        }
        Returns: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }[]
      }
      get_user_growth: {
        Args: Record<string, never>
        Returns: {
          month: string
          user_count: number
        }[]
      }
      get_all_feedback: {
        Args: Record<string, never>
        Returns: {
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
        }[]
      }
    }
    Enums: {
      member_role: 'owner' | 'moderator'
      queue_status: 'waiting' | 'playing' | 'done'
    }
  }
}
