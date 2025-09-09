-- Setup test data for SavedBrokers component testing
-- Run this in Supabase SQL Editor

-- First, ensure we have some test brokers
INSERT INTO brokers (
  name, slug, country, established_year, min_deposit, spreads_avg, 
  leverage_max, platforms, regulations, regulation_tier, trust_score, 
  avg_rating, total_reviews, description, pros, cons
) VALUES 
(
  'FX Pro Test', 'fx-pro-test', 'UK', 2006, 100, 1.2, '1:500',
  ARRAY['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
  ARRAY['FCA', 'CySEC'], 'tier1', 92, 4.6, 1250,
  'Leading UK-based forex broker with excellent regulation and platforms.',
  ARRAY['FCA regulated', 'Multiple platforms', 'Low spreads'],
  ARRAY['High minimum deposit', 'Limited educational resources']
),
(
  'Capital Markets Test', 'capital-markets-test', 'Cyprus', 2010, 50, 1.5, '1:200',
  ARRAY['MetaTrader 4', 'WebTrader'],
  ARRAY['CySEC'], 'tier2', 78, 4.2, 890,
  'Cyprus-based broker offering competitive trading conditions.',
  ARRAY['Low minimum deposit', 'Good customer support'],
  ARRAY['Limited regulation', 'Higher spreads']
),
(
  'Global Trade Test', 'global-trade-test', 'Australia', 2015, 200, 0.8, '1:400',
  ARRAY['MetaTrader 5', 'TradingView'],
  ARRAY['ASIC'], 'tier1', 88, 4.4, 567,
  'Australian regulated broker with advanced trading technology.',
  ARRAY['ASIC regulated', 'Advanced platforms', 'Tight spreads'],
  ARRAY['High minimum deposit', 'Limited currency pairs']
)
ON CONFLICT (slug) DO NOTHING;

-- Get the broker IDs for shortlist insertion
-- Note: You'll need to replace these UUIDs with actual broker IDs from the insert above
-- or run a separate query to get the IDs

-- Example shortlist entries (replace user_id with actual test user ID)
-- INSERT INTO user_shortlists (user_id, broker_id, notes)
-- SELECT 
--   'your-test-user-id-here'::uuid,
--   b.id,
--   CASE 
--     WHEN b.name = 'FX Pro Test' THEN 'Excellent regulation and platforms'
--     WHEN b.name = 'Capital Markets Test' THEN 'Good for beginners'
--     WHEN b.name = 'Global Trade Test' THEN 'Advanced trading features'
--   END
-- FROM brokers b
-- WHERE b.slug IN ('fx-pro-test', 'capital-markets-test', 'global-trade-test');

-- Check if data was inserted correctly
SELECT 
  name, slug, country, regulation_tier, trust_score, avg_rating
FROM brokers 
WHERE slug IN ('fx-pro-test', 'capital-markets-test', 'global-trade-test');

-- Check user shortlists (replace with actual user ID)
-- SELECT 
--   us.notes,
--   b.name,
--   b.avg_rating,
--   b.trust_score
-- FROM user_shortlists us
-- JOIN brokers b ON us.broker_id = b.id
-- WHERE us.user_id = 'your-test-user-id-here'::uuid;