export interface Broker {
    id: string;
    name: string;
    logo_url: string | null;
    country: string;
    regulations: string[];
    spreads_avg: number;
    min_deposit: number;
    max_leverage: number | null;
    platforms: string[];
    trust_score: number;
    avg_rating: number;
    review_count: number;
    affiliate_url: string | null;
    is_active: boolean;
    founded_year: number | null;
    description: string | null;
    withdrawal_methods: string[] | null;
    deposit_methods: string[] | null;
    customer_support: string[] | null;
    education_resources: boolean;
    demo_account: boolean;
    // Added for simulator
    commission_per_lot?: number; 
  }
  
  export interface Review {
    id: string;
    broker_id: string;
    user_id: string;
    rating: number;
    text: string;
    verified: boolean;
    created_at: string;
    users: {
      display_name: string | null;
      avatar_url: string | null;
    } | null;
  }

  export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
  }
