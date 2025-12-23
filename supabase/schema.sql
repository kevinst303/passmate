-- PassMate Supabase Schema

-- 1. Profiles (extending auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  current_xp INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  daily_streak INTEGER DEFAULT 0,
  last_streak_update TIMESTAMPTZ,
  hearts INTEGER DEFAULT 5,
  last_heart_regen TIMESTAMPTZ DEFAULT NOW(),
  is_premium BOOLEAN DEFAULT FALSE,
  premium_tier TEXT, -- 'test_ready', 'citizenship_achiever'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Daily Streaks History (to track fire counter/multipliers)
CREATE TABLE IF NOT EXISTS streak_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  active_date DATE NOT NULL,
  xp_gained INTEGER DEFAULT 0,
  UNIQUE(user_id, active_date)
);

-- 3. XP Logs
CREATE TABLE IF NOT EXISTS xp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL, -- 'quiz_complete', 'daily_quest', 'league_reward'
  multiplier DECIMAL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Leagues
CREATE TABLE IF NOT EXISTS leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'Bronze', 'Silver', 'Gold', 'Diamond'
  rank INTEGER NOT NULL, -- 1 to 4
  min_xp_threshold INTEGER DEFAULT 0,
  reward_xp INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
);

-- 5. User League Standings
CREATE TABLE IF NOT EXISTS league_standings (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  weekly_xp INTEGER DEFAULT 0,
  current_rank INTEGER,
  PRIMARY KEY (user_id, league_id)
);

-- 6. Daily Quests Definitions
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'quiz_count', 'perfect_score', 'streak_maintain'
  requirement_value INTEGER NOT NULL
);

-- 7. User Quest Completion
CREATE TABLE IF NOT EXISTS user_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, quest_id, expires_at)
);

-- 8. Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  badge_url TEXT,
  xp_reward INTEGER DEFAULT 0,
  secret BOOLEAN DEFAULT FALSE
);

-- 9. User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- 10. Question Bank
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL, -- 'History', 'Government', 'Values', 'People'
  subtopic TEXT,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of strings
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  difficulty TEXT DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. User Quiz History
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Friendships
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- 13. User Mistakes (for spaced repetition)
CREATE TABLE IF NOT EXISTS user_mistakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  incorrect_attempts INTEGER DEFAULT 1,
  last_mistake_at TIMESTAMPTZ DEFAULT NOW(),
  is_resolved BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, question_id)
);

-- 14. Challenges (PvP Battles)
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenged_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'completed', 'declined'
  challenger_score INTEGER DEFAULT 0,
  challenged_score INTEGER DEFAULT 0,
  challenger_played BOOLEAN DEFAULT FALSE,
  challenged_played BOOLEAN DEFAULT FALSE,
  winner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. XP Logs Policies
CREATE POLICY "Users can view own xp logs" ON xp_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own xp logs" ON xp_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. User Quests Policies
CREATE POLICY "Users can view own quests" ON user_quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own quests" ON user_quests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quests" ON user_quests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Quiz Attempts Policies
CREATE POLICY "Users can view own quiz attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. League Standings Policies
CREATE POLICY "Anyone can view standings" ON league_standings FOR SELECT USING (true);
CREATE POLICY "Users can update own standing" ON league_standings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own standing" ON league_standings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Streak History Policies
CREATE POLICY "Users can view own streaks" ON streak_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON streak_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Read-only Public Data
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leagues are viewable by everyone" ON leagues FOR SELECT USING (true);

ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quests are viewable by everyone" ON quests FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert quests" ON quests FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert questions" ON questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements are viewable by everyone" ON achievements FOR SELECT USING (true);

-- 8. Friendships Policies
CREATE POLICY "Users can view their own friendships" ON friendships FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can manage their own friendships" ON friendships FOR ALL USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- 9. User Mistakes Policies
CREATE POLICY "Users can view own mistakes" ON user_mistakes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own mistakes" ON user_mistakes FOR ALL USING (auth.uid() = user_id);

-- 10. Challenges Policies
CREATE POLICY "Users can view their own challenges" ON challenges FOR SELECT USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);
CREATE POLICY "Users can manage their own challenges" ON challenges FOR ALL USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

-- 15. Topic Progress (Study Course)
CREATE TABLE IF NOT EXISTS topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  status TEXT DEFAULT 'locked', -- 'locked', 'in-progress', 'completed'
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_name)
);

ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own topic progress" ON topic_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own topic progress" ON topic_progress FOR ALL USING (auth.uid() = user_id);


-- 16. Functions & Triggers

-- Function to safely increment XP
CREATE OR REPLACE FUNCTION increment_xp(uid UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles
    SET total_xp = total_xp + amount,
        current_xp = current_xp + amount,
        updated_at = NOW()
    WHERE id = uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current hearts (including regeneration)
-- Logic: 1 heart every 3 hours, max 5 hearts
CREATE OR REPLACE FUNCTION get_current_hearts(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    last_regen TIMESTAMPTZ;
    current_hearts INTEGER;
    hours_passed INTEGER;
    hearts_to_add INTEGER;
BEGIN
    SELECT hearts, last_heart_regen INTO current_hearts, last_regen
    FROM profiles
    WHERE id = user_id_param;

    IF current_hearts >= 5 THEN
        RETURN 5;
    END IF;

    hours_passed := EXTRACT(EPOCH FROM (NOW() - last_regen)) / 3600;
    hearts_to_add := hours_passed / 3; -- 1 heart per 3 hours

    IF hearts_to_add > 0 THEN
        current_hearts := LEAST(5, current_hearts + hearts_to_add);
        
        -- Update the profile with new hearts and adjusted last_regen
        UPDATE profiles
        SET hearts = current_hearts,
            last_heart_regen = last_regen + (INTERVAL '3 hours' * hearts_to_add),
            updated_at = NOW()
        WHERE id = user_id_param;
    END IF;

    RETURN current_hearts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
