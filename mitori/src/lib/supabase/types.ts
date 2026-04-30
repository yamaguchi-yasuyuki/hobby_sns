export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SourceType = 'note' | 'x' | 'youtube' | 'instagram' | 'blog' | 'other'
export type ContentStatus = 'draft' | 'published' | 'unpublished'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_user_id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          email?: string
          created_at?: string
        }
      }
      genres: {
        Row: {
          id: string
          name: string
          slug: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          created_at?: string
        }
      }
      contents: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          external_url: string
          source_type: SourceType
          genre_id: string
          location_name: string | null
          prefecture: string | null
          status: ContentStatus
          bookmark_count: number
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          external_url: string
          source_type: SourceType
          genre_id: string
          location_name?: string | null
          prefecture?: string | null
          status?: ContentStatus
          bookmark_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          external_url?: string
          source_type?: SourceType
          genre_id?: string
          location_name?: string | null
          prefecture?: string | null
          status?: ContentStatus
          bookmark_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          content_id: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          category?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          category?: string
          created_at?: string
        }
      }
      user_genre_preferences: {
        Row: {
          id: string
          user_id: string
          genre_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          genre_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          genre_id?: string
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
