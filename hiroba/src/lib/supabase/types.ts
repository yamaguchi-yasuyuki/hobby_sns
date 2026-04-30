export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_user_id: string
          email: string
          account_kind: string
          created_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          email: string
          account_kind?: string
          created_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          email?: string
          account_kind?: string
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          facility_id: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          facility_id: string
          category?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          facility_id?: string
          category?: string
          created_at?: string
        }
      }
    }
  }
}
