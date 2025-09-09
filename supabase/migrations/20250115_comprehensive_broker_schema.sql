/*
# Comprehensive Broker Data Schema Extension
This migration extends the existing broker schema to accommodate all detailed broker information from scraped data including trading conditions, deposit/withdrawal methods, bonuses, support channels, and more.

## Query Description:
Extends the broker database schema to store comprehensive broker information including:
- Detailed trading conditions and execution types
- Deposit and withdrawal methods with fees
- Bonuses and promotional offers
- Customer support channels and languages
- Security features and trust indicators
- Educational resources and research tools
- Media assets and screenshots

## Metadata:
- Schema-Category: "Extension"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- broker_trading_conditions: Trading specifications and execution details
- broker_instruments: Detailed instrument offerings by category
- broker_deposit_methods: Payment methods for deposits
- broker_withdrawal_methods: Payment methods for withdrawals
- broker_bonuses: Promotional offers and bonuses
- broker_support_channels: Customer support information
- broker_security_features: Security and trust indicators
- broker_media: Screenshots, videos, and promotional materials
- broker_educational_resources: Learning materials and research tools

## Security Implications:
- RLS Status: Enabled on all new tables
- Policy Changes: Yes - comprehensive RLS policies for new tables
- Auth Requirements: Public read, admin write access

## Performance Impact:
- Indexes: Added for performance optimization on foreign keys and search fields
- Triggers: Automatic timestamp updates
- Estimated Impact: Optimized for read-heavy workloads with detailed broker data
*/

-- Create additional enum types for broker data
CREATE TYPE execution_type AS ENUM ('market', 'instant', 'ecn', 'ndd', 'stp');
CREATE TYPE broker_type AS ENUM ('ecn', 'stp', 'market_maker', 'hybrid');
CREATE TYPE account_type AS ENUM ('standard', 'pro', 'islamic', 'raw_spread', 'vip', 'demo');
CREATE TYPE support_channel AS ENUM ('live_chat', 'email', 'phone', 'whatsapp', 'telegram', 'ticket_system');
CREATE TYPE bonus_type AS ENUM ('welcome', 'deposit', 'no_deposit', 'cashback', 'loyalty', 'contest');
CREATE TYPE payment_method AS ENUM ('bank_transfer', 'credit_card', 'debit_card', 'skrill', 'neteller', 'paypal', 'crypto', 'perfect_money', 'webmoney', 'fasapay');

-- Extend the existing brokers table with additional fields
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS founded_year INTEGER;
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS headquarters_city TEXT;
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS headquarters_country TEXT;
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS license_numbers TEXT[];
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS base_currencies TEXT[];
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS broker_type broker_type;
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS execution_type execution_type;
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS mobile_trading_available BOOLEAN DEFAULT false;
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS demo_account_available BOOLEAN DEFAULT true;
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS negative_balance_protection BOOLEAN DEFAULT false;
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS segregated_accounts BOOLEAN DEFAULT false;
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS investor_compensation_amount DECIMAL(15,2);
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS two_factor_auth BOOLEAN DEFAULT false;
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS dailyforex_rating DECIMAL(3,2);
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS user_rating_average DECIMAL(3,2);
ALTER TABLE public.brokers ADD COLUMN IF NOT EXISTS user_rating_count INTEGER DEFAULT 0;

-- Broker Trading Conditions Table
CREATE TABLE public.broker_trading_conditions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
    
    -- Account types and conditions
    account_types account_type[] NOT NULL DEFAULT '{}',
    minimum_trade_size DECIMAL(10,4),
    maximum_trade_size DECIMAL(15,2),
    
    -- Spreads and commissions
    spread_eur_usd_min DECIMAL(5,2),
    spread_gbp_usd_min DECIMAL(5,2),
    spread_usd_jpy_min DECIMAL(5,2),
    commission_per_lot DECIMAL(8,2),
    commission_per_side DECIMAL(8,2),
    
    -- Leverage
    leverage_forex_max TEXT,
    leverage_crypto_max TEXT,
    leverage_indices_max TEXT,
    leverage_commodities_max TEXT,
    
    -- Trading rules
    scalping_allowed BOOLEAN DEFAULT true,
    hedging_allowed BOOLEAN DEFAULT true,
    ea_trading_allowed BOOLEAN DEFAULT true,
    copy_trading_available BOOLEAN DEFAULT false,
    social_trading_available BOOLEAN DEFAULT false,
    
    -- Margin requirements
    margin_call_level DECIMAL(5,2),
    stop_out_level DECIMAL(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(broker_id)
);

-- Broker Instruments Table
CREATE TABLE public.broker_instruments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
    
    -- Forex
    forex_pairs_count INTEGER DEFAULT 0,
    forex_pairs_major TEXT[],
    forex_pairs_minor TEXT[],
    forex_pairs_exotic TEXT[],
    
    -- Other instruments
    commodities_count INTEGER DEFAULT 0,
    commodities_list TEXT[],
    indices_count INTEGER DEFAULT 0,
    indices_list TEXT[],
    stocks_count INTEGER DEFAULT 0,
    stocks_exchanges TEXT[],
    crypto_count INTEGER DEFAULT 0,
    crypto_list TEXT[],
    etfs_count INTEGER DEFAULT 0,
    etfs_list TEXT[],
    
    -- Other instruments
    bonds_available BOOLEAN DEFAULT false,
    options_available BOOLEAN DEFAULT false,
    futures_available BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(broker_id)
);

-- Broker Deposit Methods Table
CREATE TABLE public.broker_deposit_methods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
    method payment_method NOT NULL,
    
    -- Method details
    method_name TEXT NOT NULL,
    minimum_amount DECIMAL(10,2),
    maximum_amount DECIMAL(15,2),
    
    -- Fees and processing
    fee_percentage DECIMAL(5,2),
    fee_fixed DECIMAL(8,2),
    processing_time_min INTEGER, -- in minutes
    processing_time_max INTEGER, -- in minutes
    
    -- Availability
    available_countries TEXT[],
    currencies_supported TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Broker Withdrawal Methods Table
CREATE TABLE public.broker_withdrawal_methods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
    method payment_method NOT NULL,
    
    -- Method details
    method_name TEXT NOT NULL,
    minimum_amount DECIMAL(10,2),
    maximum_amount DECIMAL(15,2),
    
    -- Fees and processing
    fee_percentage DECIMAL(5,2),
    fee_fixed DECIMAL(8,2),
    processing_time_min INTEGER, -- in minutes
    processing_time_max INTEGER, -- in minutes
    
    -- Availability
    available_countries TEXT[],
    currencies_supported TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Broker Bonuses Table
CREATE TABLE public.broker_bonuses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
    
    -- Bonus details
    bonus_type bonus_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    
    -- Bonus amounts
    bonus_amount DECIMAL(10,2),
    bonus_percentage DECIMAL(5,2),
    maximum_bonus DECIMAL(10,2),
    
    -- Terms and conditions
    minimum_deposit DECIMAL(10,2),
    wagering_requirement DECIMAL(5,2),
    time_limit_days INTEGER,
    
    -- Availability
    available_countries TEXT[],
    excluded_countries TEXT[],
    terms_and_conditions TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Broker Support Channels Table
CREATE TABLE public.broker_support_channels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
    
    -- Channel details
    channel support_channel NOT NULL,
    contact_info TEXT, -- phone number, email, etc.
    
    -- Availability
    available_24_7 BOOLEAN DEFAULT false,
    available_24_5 BOOLEAN DEFAULT false,
    support_hours TEXT,
    languages_supported TEXT[],
    
    -- Response times
    average_response_time_minutes INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Broker Security Features Table
CREATE TABLE public.broker_security_features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
    
    -- Security features
    ssl_encryption BOOLEAN DEFAULT false,
    two_factor_authentication BOOLEAN DEFAULT false,
    negative_balance_protection BOOLEAN DEFAULT false,
    segregated_client_accounts BOOLEAN DEFAULT false,
    
    -- Insurance and compensation
    deposit_insurance BOOLEAN DEFAULT false,
    insurance_amount DECIMAL(15,2),
    compensation_scheme BOOLEAN DEFAULT false,
    compensation_amount DECIMAL(15,2),
    
    -- Auditing and compliance
    external_audits BOOLEAN DEFAULT false,
    audit_firm TEXT,
    compliance_certifications TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    UNIQUE(broker_id)
);

-- Broker Media Table
CREATE TABLE public.broker_media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
    
    -- Media details
    media_type TEXT NOT NULL, -- 'screenshot', 'video', 'logo', 'banner'
    title TEXT,
    description TEXT,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    
    -- Media metadata
    file_size INTEGER,
    dimensions TEXT, -- e.g., '1920x1080'
    format TEXT, -- e.g., 'jpg', 'png', 'mp4'
    
    -- Display order
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Broker Educational Resources Table
CREATE TABLE public.broker_educational_resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
    
    -- Resource details
    resource_type TEXT NOT NULL, -- 'webinar', 'tutorial', 'guide', 'ebook', 'video', 'course'
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    
    -- Resource metadata
    duration_minutes INTEGER,
    difficulty_level learning_level,
    languages_available TEXT[],
    
    -- Availability
    is_free BOOLEAN DEFAULT true,
    requires_account BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Broker Research Tools Table
CREATE TABLE public.broker_research_tools (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE CASCADE NOT NULL,
    
    -- Tool details
    tool_type TEXT NOT NULL, -- 'economic_calendar', 'news_feed', 'market_analysis', 'trading_signals', 'sentiment_analysis'
    tool_name TEXT NOT NULL,
    description TEXT,
    
    -- Tool features
    real_time_data BOOLEAN DEFAULT false,
    historical_data BOOLEAN DEFAULT false,
    customizable BOOLEAN DEFAULT false,
    mobile_available BOOLEAN DEFAULT false,
    
    -- Access requirements
    requires_account BOOLEAN DEFAULT false,
    minimum_deposit_required DECIMAL(10,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_broker_trading_conditions_broker_id ON public.broker_trading_conditions(broker_id);
CREATE INDEX idx_broker_instruments_broker_id ON public.broker_instruments(broker_id);
CREATE INDEX idx_broker_deposit_methods_broker_id ON public.broker_deposit_methods(broker_id);
CREATE INDEX idx_broker_deposit_methods_method ON public.broker_deposit_methods(method);
CREATE INDEX idx_broker_withdrawal_methods_broker_id ON public.broker_withdrawal_methods(broker_id);
CREATE INDEX idx_broker_withdrawal_methods_method ON public.broker_withdrawal_methods(method);
CREATE INDEX idx_broker_bonuses_broker_id ON public.broker_bonuses(broker_id);
CREATE INDEX idx_broker_bonuses_type ON public.broker_bonuses(bonus_type);
CREATE INDEX idx_broker_bonuses_active ON public.broker_bonuses(is_active);
CREATE INDEX idx_broker_support_channels_broker_id ON public.broker_support_channels(broker_id);
CREATE INDEX idx_broker_support_channels_channel ON public.broker_support_channels(channel);
CREATE INDEX idx_broker_security_features_broker_id ON public.broker_security_features(broker_id);
CREATE INDEX idx_broker_media_broker_id ON public.broker_media(broker_id);
CREATE INDEX idx_broker_media_type ON public.broker_media(media_type);
CREATE INDEX idx_broker_educational_resources_broker_id ON public.broker_educational_resources(broker_id);
CREATE INDEX idx_broker_educational_resources_type ON public.broker_educational_resources(resource_type);
CREATE INDEX idx_broker_research_tools_broker_id ON public.broker_research_tools(broker_id);
CREATE INDEX idx_broker_research_tools_type ON public.broker_research_tools(tool_type);

-- Enable Row Level Security on new tables
ALTER TABLE public.broker_trading_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_deposit_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_withdrawal_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_support_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_security_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_educational_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_research_tools ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables (public read, admin write)
CREATE POLICY "Broker trading conditions are viewable by everyone" ON public.broker_trading_conditions
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage broker trading conditions" ON public.broker_trading_conditions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Broker instruments are viewable by everyone" ON public.broker_instruments
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage broker instruments" ON public.broker_instruments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Broker deposit methods are viewable by everyone" ON public.broker_deposit_methods
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage broker deposit methods" ON public.broker_deposit_methods
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Broker withdrawal methods are viewable by everyone" ON public.broker_withdrawal_methods
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage broker withdrawal methods" ON public.broker_withdrawal_methods
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Broker bonuses are viewable by everyone" ON public.broker_bonuses
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage broker bonuses" ON public.broker_bonuses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Broker support channels are viewable by everyone" ON public.broker_support_channels
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage broker support channels" ON public.broker_support_channels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Broker security features are viewable by everyone" ON public.broker_security_features
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage broker security features" ON public.broker_security_features
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Broker media are viewable by everyone" ON public.broker_media
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage broker media" ON public.broker_media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Broker educational resources are viewable by everyone" ON public.broker_educational_resources
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage broker educational resources" ON public.broker_educational_resources
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Broker research tools are viewable by everyone" ON public.broker_research_tools
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage broker research tools" ON public.broker_research_tools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Apply update timestamp triggers to new tables
CREATE TRIGGER update_broker_trading_conditions_updated_at BEFORE UPDATE ON public.broker_trading_conditions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broker_instruments_updated_at BEFORE UPDATE ON public.broker_instruments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broker_deposit_methods_updated_at BEFORE UPDATE ON public.broker_deposit_methods
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broker_withdrawal_methods_updated_at BEFORE UPDATE ON public.broker_withdrawal_methods
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broker_bonuses_updated_at BEFORE UPDATE ON public.broker_bonuses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broker_support_channels_updated_at BEFORE UPDATE ON public.broker_support_channels
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broker_security_features_updated_at BEFORE UPDATE ON public.broker_security_features
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broker_media_updated_at BEFORE UPDATE ON public.broker_media
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broker_educational_resources_updated_at BEFORE UPDATE ON public.broker_educational_resources
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broker_research_tools_updated_at BEFORE UPDATE ON public.broker_research_tools
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();