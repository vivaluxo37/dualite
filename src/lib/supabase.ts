import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          experience_level: 'beginner' | 'intermediate' | 'advanced' | null
          trading_style: 'scalping' | 'day_trading' | 'swing_trading' | 'position_trading' | null
          preferred_instruments: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          trading_style?: 'scalping' | 'day_trading' | 'swing_trading' | 'position_trading' | null
          preferred_instruments?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          trading_style?: 'scalping' | 'day_trading' | 'swing_trading' | 'position_trading' | null
          preferred_instruments?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      brokers: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          country: string
          founded_year: number | null
          website_url: string | null
          description: string | null
          regulations: string[]
          spreads_avg: number
          min_deposit: number
          max_leverage: number | null
          platforms: string[]
          affiliate_url: string | null
          trust_score: number
          avg_rating: number
          review_count: number
          withdrawal_methods: string[] | null
          deposit_methods: string[] | null
          customer_support: string[] | null
          education_resources: boolean
          demo_account: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          country: string
          founded_year?: number | null
          website_url?: string | null
          description?: string | null
          regulations?: string[]
          spreads_avg: number
          min_deposit: number
          max_leverage?: number | null
          platforms?: string[]
          affiliate_url?: string | null
          trust_score?: number
          avg_rating?: number
          review_count?: number
          withdrawal_methods?: string[] | null
          deposit_methods?: string[] | null
          customer_support?: string[] | null
          education_resources?: boolean
          demo_account?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          country?: string
          founded_year?: number | null
          website_url?: string | null
          description?: string | null
          regulations?: string[]
          spreads_avg?: number
          min_deposit?: number
          max_leverage?: number | null
          platforms?: string[]
          affiliate_url?: string | null
          trust_score?: number
          avg_rating?: number
          review_count?: number
          withdrawal_methods?: string[] | null
          deposit_methods?: string[] | null
          customer_support?: string[] | null
          education_resources?: boolean
          demo_account?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
