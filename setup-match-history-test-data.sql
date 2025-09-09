-- Test data for MatchHistory component
-- This script creates sample quiz results and user progress data

-- Insert test user
INSERT INTO users (id, display_name, role, language_preference)
VALUES ('11111111-1111-1111-1111-111111111111', 'Test User', 'user', 'en')
ON CONFLICT (id) DO NOTHING;

-- Insert test learning modules
INSERT INTO learning_modules (id, title, slug, description, level, order_index, duration_minutes, objectives, is_published)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Forex Basics', 'forex-basics', 'Introduction to forex trading fundamentals', 'beginner', 1, 30, ARRAY['Understand currency pairs', 'Learn market hours'], true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Technical Analysis', 'technical-analysis', 'Chart patterns and indicators', 'intermediate', 2, 45, ARRAY['Read charts', 'Use indicators'], true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Risk Management', 'risk-management', 'Managing trading risks effectively', 'advanced', 3, 60, ARRAY['Calculate position size', 'Set stop losses'], true)
ON CONFLICT (slug) DO NOTHING;

-- Insert test quiz results (match history)
INSERT INTO quiz_results (id, user_id, experience_level, trading_style, preferred_instruments, deposit_size_range, regulation_importance, platform_preference, recommended_brokers, match_scores, created_at)
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 'beginner', 'long_term', ARRAY['forex', 'stocks'], 'under_1000', 4, 'mt4', ARRAY['11111111-2222-3333-4444-555555555555'::uuid, '22222222-3333-4444-5555-666666666666'::uuid], '{"broker1": 85, "broker2": 78}', NOW() - INTERVAL '7 days'),
  ('660e8400-e29b-41d4-a716-446655440002', '11111111-1111-1111-1111-111111111111', 'intermediate', 'day_trading', ARRAY['forex', 'crypto'], '1000_5000', 5, 'mt5', ARRAY['22222222-3333-4444-5555-666666666666'::uuid, '33333333-4444-5555-6666-777777777777'::uuid], '{"broker2": 92, "broker3": 88}', NOW() - INTERVAL '3 days'),
  ('660e8400-e29b-41d4-a716-446655440003', '11111111-1111-1111-1111-111111111111', 'advanced', 'scalping', ARRAY['forex'], 'over_10000', 3, 'ctrader', ARRAY['11111111-2222-3333-4444-555555555555'::uuid, '33333333-4444-5555-6666-777777777777'::uuid], '{"broker1": 95, "broker3": 90}', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Insert test user progress
INSERT INTO user_progress (id, user_id, module_id, completed, score, completed_at)
VALUES 
  ('770e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440001', true, 85, NOW() - INTERVAL '5 days'),
  ('770e8400-e29b-41d4-a716-446655440002', '11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440002', true, 92, NOW() - INTERVAL '2 days'),
  ('770e8400-e29b-41d4-a716-446655440003', '11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440003', false, null, null)
ON CONFLICT (id) DO NOTHING;

-- Verify data insertion
-- SELECT 'Quiz Results:' as table_name;
-- SELECT id, experience_level, risk_tolerance, trading_goals, created_at FROM quiz_results WHERE user_id = '11111111-1111-1111-1111-111111111111';
-- SELECT 'User Progress:' as table_name;
-- SELECT up.id, lm.title, up.completed, up.score, up.completed_at FROM user_progress up JOIN learning_modules lm ON up.module_id = lm.id WHERE up.user_id = '11111111-1111-1111-1111-111111111111';