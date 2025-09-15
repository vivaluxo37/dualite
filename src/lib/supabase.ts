import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for backend operations
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceRoleKey ? createClient(supabaseUrl, supabaseServiceRoleKey) : null;

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin';
          experience_level: 'beginner' | 'intermediate' | 'advanced' | null;
          trading_style: 'scalping' | 'day_trading' | 'swing_trading' | 'position_trading' | null;
          preferred_instruments: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null;
          trading_style?: 'scalping' | 'day_trading' | 'swing_trading' | 'position_trading' | null;
          preferred_instruments?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null;
          trading_style?: 'scalping' | 'day_trading' | 'swing_trading' | 'position_trading' | null;
          preferred_instruments?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      brokers: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          country: string;
          founded_year: number | null;
          website_url: string | null;
          description: string | null;
          regulations: string[];
          spreads_avg: number;
          min_deposit: number;
          max_leverage: number | null;
          platforms: string[];
          affiliate_url: string | null;
          trust_score: number;
          avg_rating: number;
          review_count: number;
          withdrawal_methods: string[] | null;
          deposit_methods: string[] | null;
          customer_support: string[] | null;
          education_resources: boolean;
          demo_account: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          country: string;
          founded_year?: number | null;
          website_url?: string | null;
          description?: string | null;
          regulations?: string[];
          spreads_avg: number;
          min_deposit: number;
          max_leverage?: number | null;
          platforms?: string[];
          affiliate_url?: string | null;
          trust_score?: number;
          avg_rating?: number;
          review_count?: number;
          withdrawal_methods?: string[] | null;
          deposit_methods?: string[] | null;
          customer_support?: string[] | null;
          education_resources?: boolean;
          demo_account?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          country?: string;
          founded_year?: number | null;
          website_url?: string | null;
          description?: string | null;
          regulations?: string[];
          spreads_avg?: number;
          min_deposit?: number;
          max_leverage?: number | null;
          platforms?: string[];
          affiliate_url?: string | null;
          trust_score?: number;
          avg_rating?: number;
          review_count?: number;
          withdrawal_methods?: string[] | null;
          deposit_methods?: string[] | null;
          customer_support?: string[] | null;
          education_resources?: boolean;
          demo_account?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_matcher_results: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          match_score: number;
          user_preferences: {
            experience_level: string;
            trading_style: string;
            budget_range: string;
            risk_tolerance: string;
            instruments: string[];
            regulation_preference: string;
            features: string[];
          };
          recommended_brokers: {
            broker_id: string;
            broker_name: string;
            match_percentage: number;
            reasons: string[];
            rating: number;
            regulation: string;
            min_deposit: number;
          }[];
          metadata: Record<string, any>;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          match_score: number;
          user_preferences: {
            experience_level: string;
            trading_style: string;
            budget_range: string;
            risk_tolerance: string;
            instruments: string[];
            regulation_preference: string;
            features: string[];
          };
          recommended_brokers: {
            broker_id: string;
            broker_name: string;
            match_percentage: number;
            reasons: string[];
            rating: number;
            regulation: string;
            min_deposit: number;
          }[];
          metadata?: Record<string, any>;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          match_score?: number;
          user_preferences?: {
            experience_level: string;
            trading_style: string;
            budget_range: string;
            risk_tolerance: string;
            instruments: string[];
            regulation_preference: string;
            features: string[];
          };
          recommended_brokers?: {
            broker_id: string;
            broker_name: string;
            match_percentage: number;
            reasons: string[];
            rating: number;
            regulation: string;
            min_deposit: number;
          }[];
          metadata?: Record<string, any>;
        };
      };
      learning_modules: {
        Row: {
          id: string;
          title: string;
          description: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          estimated_duration: number;
          total_lessons: number;
          category: string;
          created_at: string;
          updated_at: string;
          is_published: boolean;
          content: Record<string, any>;
          prerequisites: string[];
          tags: string[];
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          estimated_duration: number;
          total_lessons: number;
          category: string;
          created_at?: string;
          updated_at?: string;
          is_published?: boolean;
          content?: Record<string, any>;
          prerequisites?: string[];
          tags?: string[];
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          estimated_duration?: number;
          total_lessons?: number;
          category?: string;
          created_at?: string;
          updated_at?: string;
          is_published?: boolean;
          content?: Record<string, any>;
          prerequisites?: string[];
          tags?: string[];
        };
      };
      user_shortlists: {
        Row: {
          id: string;
          user_id: string;
          broker_id: string;
          created_at: string;
          notes: string;
          priority: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          broker_id: string;
          created_at?: string;
          notes?: string;
          priority?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          broker_id?: string;
          created_at?: string;
          notes?: string;
          priority?: number;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          completed_lessons: number;
          total_score: number;
          completed_at: string | null;
          last_accessed: string;
          progress_data: Record<string, any>;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          completed_lessons?: number;
          total_score?: number;
          completed_at?: string | null;
          last_accessed?: string;
          progress_data?: Record<string, any>;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          completed_lessons?: number;
          total_score?: number;
          completed_at?: string | null;
          last_accessed?: string;
          progress_data?: Record<string, any>;
        };
      };
      admin_users: {
        Row: {
          id: string;
          clerk_user_id: string;
          email: string;
          role: 'admin' | 'super_admin' | 'content_manager';
          permissions: string[];
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_user_id: string;
          email: string;
          role?: 'admin' | 'super_admin' | 'content_manager';
          permissions?: string[];
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_user_id?: string;
          email?: string;
          role?: 'admin' | 'super_admin' | 'content_manager';
          permissions?: string[];
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_activity_log: {
        Row: {
          id: string;
          admin_user_id: string;
          action: string;
          target_type: string | null;
          target_id: string | null;
          details: Record<string, any> | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_user_id: string;
          action: string;
          target_type?: string | null;
          target_id?: string | null;
          details?: Record<string, any> | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_user_id?: string;
          action?: string;
          target_type?: string | null;
          target_id?: string | null;
          details?: Record<string, any> | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
  };
};