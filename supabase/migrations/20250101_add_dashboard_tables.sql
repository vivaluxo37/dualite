-- Create missing database tables for dashboard functionality
-- This migration creates user_shortlists, user_progress, and learning_modules tables

-- Create learning_modules table first (user_progress depends on it)
CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration INTEGER NOT NULL CHECK (estimated_duration > 0),
  total_lessons INTEGER NOT NULL CHECK (total_lessons > 0),
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  is_published BOOLEAN DEFAULT true,
  content JSONB DEFAULT '{}'::jsonb,
  prerequisites TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}'
);

-- Create user_shortlists table
CREATE TABLE IF NOT EXISTS user_shortlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  notes TEXT DEFAULT '',
  priority INTEGER DEFAULT 0,
  UNIQUE(user_id, broker_id)
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE NOT NULL,
  completed_lessons INTEGER DEFAULT 0 CHECK (completed_lessons >= 0),
  total_score INTEGER DEFAULT 0 CHECK (total_score >= 0 AND total_score <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  progress_data JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, module_id)
);

-- Enable Row Level Security
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for learning_modules
-- Everyone can read published learning modules
CREATE POLICY "Anyone can view published learning modules" ON learning_modules 
  FOR SELECT USING (is_published = true);

-- Authenticated users can read all learning modules
CREATE POLICY "Authenticated users can view learning modules" ON learning_modules 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create RLS policies for user_shortlists
CREATE POLICY "Users can view own shortlists" ON user_shortlists 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shortlists" ON user_shortlists 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shortlists" ON user_shortlists 
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own shortlists" ON user_shortlists 
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_progress
CREATE POLICY "Users can view own progress" ON user_progress 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress 
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON user_progress 
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_learning_modules_category ON learning_modules(category);
CREATE INDEX idx_learning_modules_difficulty ON learning_modules(difficulty);
CREATE INDEX idx_learning_modules_published ON learning_modules(is_published);
CREATE INDEX idx_user_shortlists_user_id ON user_shortlists(user_id);
CREATE INDEX idx_user_shortlists_broker_id ON user_shortlists(broker_id);
CREATE INDEX idx_user_shortlists_created_at ON user_shortlists(created_at DESC);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_module_id ON user_progress(module_id);
CREATE INDEX idx_user_progress_last_accessed ON user_progress(last_accessed DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to learning_modules
CREATE TRIGGER update_learning_modules_updated_at 
  BEFORE UPDATE ON learning_modules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample learning modules
INSERT INTO learning_modules (title, description, difficulty, estimated_duration, total_lessons, category, content) VALUES
  ('Forex Trading Basics', 'Learn the fundamentals of forex trading including currency pairs, pips, and market mechanics.', 'beginner', 2, 5, 'Introduction', '{"lessons": [{"title": "What is Forex Trading?", "duration": 15}, {"title": "Currency Pairs Explained", "duration": 20}, {"title": "Understanding Pips and Lots", "duration": 25}, {"title": "Market Participants", "duration": 20}, {"title": "Trading Sessions", "duration": 20}]}'),
  ('Technical Analysis Fundamentals', 'Master chart patterns, indicators, and technical analysis strategies.', 'intermediate', 4, 8, 'Technical Analysis', '{"lessons": [{"title": "Candlestick Patterns", "duration": 30}, {"title": "Support and Resistance", "duration": 25}, {"title": "Trend Analysis", "duration": 30}, {"title": "Moving Averages", "duration": 35}, {"title": "Relative Strength Index", "duration": 30}, {"title": "MACD Indicator", "duration": 30}, {"title": "Fibonacci Retracement", "duration": 35}, {"title": "Chart Patterns", "duration": 40}]}'),
  ('Risk Management Strategies', 'Learn essential risk management techniques to protect your trading capital.', 'intermediate', 3, 6, 'Risk Management', '{"lessons": [{"title": "Position Sizing", "duration": 25}, {"title": "Stop Loss Strategies", "duration": 30}, {"title": "Risk-Reward Ratio", "duration": 25}, {"title": "Diversification", "duration": 20}, {"title": "Leverage Management", "duration": 30}, {"title": "Trading Psychology", "duration": 30}]}'),
  ('Advanced Trading Strategies', 'Explore advanced trading strategies and sophisticated market analysis techniques.', 'advanced', 6, 10, 'Advanced Strategies', '{"lessons": [{"title": "Multiple Time Frame Analysis", "duration": 40}, {"title": "Elliott Wave Theory", "duration": 45}, {"title": "Harmonic Patterns", "duration": 50}, {"title": "Price Action Trading", "duration": 40}, {"title": "Volume Analysis", "duration": 35}, {"title": "Market Correlation", "duration": 30}, {"title": "News Trading", "duration": 35}, {"title": "Scalping Techniques", "duration": 40}, {"title": "Swing Trading", "duration": 35}, {"title": "Position Trading", "duration": 30}]}'),
  ('Broker Selection Guide', 'Learn how to choose the right forex broker based on your trading needs.', 'beginner', 1, 3, 'Broker Selection', '{"lessons": [{"title": "Regulation and Safety", "duration": 20}, {"title": "Trading Costs Analysis", "duration": 25}, {"title": "Platform and Tools", "duration": 25}]}')
ON CONFLICT DO NOTHING;