-- MASTER REPAIR SCRIPT FOR FORGE
-- Run this in Supabase SQL Editor to fix "Cannot complete habit" issues

-- 1. PROFILES TABLE & POLICIES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    anti_gravity_score INT DEFAULT 0,
    consistency_score INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. HABITS TABLE & POLICIES
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    attribute TEXT NOT NULL, -- IRON, FIRE, STEEL, FOCUS
    difficulty INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habits" 
ON public.habits FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits" 
ON public.habits FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits" 
ON public.habits FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits" 
ON public.habits FOR DELETE 
USING (auth.uid() = user_id);

-- 3. LOGS TABLE & POLICIES (CRITICAL FOR COMPLETION)
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    status TEXT NOT NULL, -- 'completed', 'failed', 'skipped'
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs" 
ON public.logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs" 
ON public.logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own logs" 
ON public.logs FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. PORTAL DECISIONS TABLE (If missing)
CREATE TABLE IF NOT EXISTS public.portal_decisions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    habit_id UUID REFERENCES public.habits(id),
    decision_type TEXT NOT NULL, -- 'BRIGHTEN', 'DARKEN'
    context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.portal_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own decisions" 
ON public.portal_decisions FOR ALL 
USING (auth.uid() = user_id);


-- 5. FUNCTION & TRIGGER FOR STATS (Idempotent)
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        UPDATE profiles
        SET 
            xp = COALESCE(xp, 0) + 10,
            current_streak = COALESCE(current_streak, 0) + 1,
            anti_gravity_score = COALESCE(anti_gravity_score, 0) + 5
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_habit_complete ON public.logs;
CREATE TRIGGER on_habit_complete
AFTER INSERT ON public.logs
FOR EACH ROW
EXECUTE FUNCTION update_profile_stats();
