/**
 * Supabase Database Types
 * Auto-generated based on database schema
 *
 * This file will be updated after creating the database schema
 */

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
          email: string
          name: string
          role: string
          agency: string
          license_number: string | null
          phone: string
          avatar: string | null
          microsite_url: string
          plan: 'FREE' | 'PRO'
          searches_used: number
          max_searches: number
          reputation: Json
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: string
          agency?: string
          license_number?: string | null
          phone: string
          avatar?: string | null
          microsite_url?: string
          plan?: 'FREE' | 'PRO'
          searches_used?: number
          max_searches?: number
          reputation?: Json
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          agency?: string
          license_number?: string | null
          phone?: string
          avatar?: string | null
          microsite_url?: string
          plan?: 'FREE' | 'PRO'
          searches_used?: number
          max_searches?: number
          reputation?: Json
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string
          avatar: string | null
          location_interest: string
          budget: string
          status: string
          last_activity: string
          archived_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone: string
          avatar?: string | null
          location_interest: string
          budget: string
          status?: string
          last_activity?: string
          archived_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string
          avatar?: string | null
          location_interest?: string
          budget?: string
          status?: string
          last_activity?: string
          archived_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          user_id: string
          title: string
          location: string
          price: number
          currency: string
          bedrooms: number
          bathrooms: number
          area: number
          image_url: string
          images: string[]
          url: string | null
          tags: string[]
          status: string
          agent_note: string | null
          source: string
          is_simulated: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          location: string
          price: number
          currency?: string
          bedrooms: number
          bathrooms: number
          area: number
          image_url: string
          images?: string[]
          url?: string | null
          tags?: string[]
          status?: string
          agent_note?: string | null
          source?: string
          is_simulated?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          location?: string
          price?: number
          currency?: string
          bedrooms?: number
          bathrooms?: number
          area?: number
          image_url?: string
          images?: string[]
          url?: string | null
          tags?: string[]
          status?: string
          agent_note?: string | null
          source?: string
          is_simulated?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      visits: {
        Row: {
          id: string
          property_id: string
          client_id: string
          user_id: string
          date: string
          time: string
          status: string
          notes: string | null
          timeline: Json[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          client_id: string
          user_id: string
          date: string
          time: string
          status?: string
          notes?: string | null
          timeline?: Json[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          client_id?: string
          user_id?: string
          date?: string
          time?: string
          status?: string
          notes?: string | null
          timeline?: Json[]
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          type: string
          title: string
          description: string
          is_urgent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          type: string
          title: string
          description: string
          is_urgent?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          type?: string
          title?: string
          description?: string
          is_urgent?: boolean
          created_at?: string
        }
      }
      client_properties: {
        Row: {
          client_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          client_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          client_id?: string
          property_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
