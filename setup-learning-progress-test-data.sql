-- Test data for LearningProgress component
-- This script creates learning modules and user progress data for testing

-- Insert test user (reuse from previous test)
INSERT INTO users (id, display_name, role, language_preference)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Test User',
  'user',
  'en'
) ON CONFLICT (id) DO NOTHING;

-- Insert test learning modules
INSERT INTO learning_modules (
  id,
  title,
  slug,
  description,
  content,
  level,
  order_index,
  duration_minutes,
  objectives,
  prerequisites,
  is_published
) VALUES 
(
  '22222222-2222-2222-2222-222222222221',
  'Forex Basics',
  'forex-basics',
  'Learn the fundamentals of forex trading',
  'Introduction to currency pairs, pips, and basic trading concepts.',
  'beginner',
  1,
  30,
  ARRAY['Understand currency pairs', 'Learn about pips', 'Basic trading terminology'],
  ARRAY[],
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Technical Analysis',
  'technical-analysis',
  'Master chart patterns and technical indicators',
  'Learn to read charts, identify patterns, and use technical indicators.',
  'intermediate',
  2,
  45,
  ARRAY['Read candlestick charts', 'Identify support and resistance', 'Use moving averages'],
  ARRAY['forex-basics'],
  true
),
(
  '22222222-2222-2222-2222-222222222223',
  'Risk Management',
  'risk-management',
  'Advanced risk management strategies',
  'Learn position sizing, stop losses, and portfolio management.',
  'advanced',
  3,
  60,
  ARRAY['Calculate position sizes', 'Set appropriate stop losses', 'Manage portfolio risk'],
  ARRAY['forex-basics', 'technical-analysis'],
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Insert user progress data
INSERT INTO user_progress (
  id,
  user_id,
  module_id,
  completed,
  score,
  completion_date
) VALUES 
(
  '33333333-3333-3333-3333-333333333331',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222221',
  true,
  85,
  NOW() - INTERVAL '7 days'
),
(
  '33333333-3333-3333-3333-333333333332',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  true,
  92,
  NOW() - INTERVAL '3 days'
),
(
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222223',
  false,
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Verify data insertion
-- SELECT 
--   lm.title,
--   lm.level,
--   lm.duration_minutes,
--   up.completed,
--   up.score,
--   up.completion_date
-- FROM learning_modules lm
-- LEFT JOIN user_progress up ON lm.id = up.module_id 
--   AND up.user_id = '11111111-1111-1111-1111-111111111111'
-- ORDER BY lm.order_index;

-- Check total progress
-- SELECT 
--   COUNT(*) as total_modules,
--   COUNT(CASE WHEN up.completed = true THEN 1 END) as completed_modules,
--   ROUND(
--     (COUNT(CASE WHEN up.completed = true THEN 1 END)::float / COUNT(*)::float) * 100, 
--     2
--   ) as completion_percentage
-- FROM learning_modules lm
-- LEFT JOIN user_progress up ON lm.id = up.module_id 
--   AND up.user_id = '11111111-1111-1111-1111-111111111111'
-- WHERE lm.is_published = true;