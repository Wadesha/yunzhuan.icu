-- =====================================================
-- yunzhuan.icu Supabase Database Schema
-- 复制到 Supabase SQL Editor 执行即可
-- =====================================================

-- 1. 用户资料表 (user_profiles)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    target_country TEXT DEFAULT 'US',
    target_major TEXT,
    gpa NUMERIC(3,2),
    sat_score INTEGER,
    act_score INTEGER,
    toefl_score INTEGER,
    ielts_score NUMERIC(2,1),
    grade_level TEXT,
    coins INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_answered INTEGER DEFAULT 0,
    total_correct INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 用户收藏表 (favorites)
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    item_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    item_title TEXT,
    item_url TEXT,
    item_meta JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- 3. 学习进度表 (progress)
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    progress_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    progress_value JSONB,
    completed BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, progress_type, item_id)
);

-- 4. 申请清单表 (application_tasks)
CREATE TABLE IF NOT EXISTS public.application_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    school_id TEXT NOT NULL,
    task_name TEXT NOT NULL,
    task_category TEXT,
    completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    notes TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 选校名单表 (school_list)
CREATE TABLE IF NOT EXISTS public.school_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    school_id TEXT NOT NULL,
    school_name TEXT,
    tier TEXT,
    status TEXT DEFAULT 'considering',
    notes TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, school_id)
);

-- =====================================================
-- 索引
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_application_tasks_user_id ON public.application_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_school_list_user_id ON public.school_list(user_id);

-- =====================================================
-- RLS (Row Level Security) 行级安全策略
-- =====================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_list ENABLE ROW LEVEL SECURITY;

-- user_profiles: 用户只能看自己的资料，可以更新自己的
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- favorites: 用户只能管理自己的收藏
CREATE POLICY "Users can view own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites" ON public.favorites
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- progress: 用户只能管理自己的进度
CREATE POLICY "Users can view own progress" ON public.progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON public.progress
    FOR DELETE USING (auth.uid() = user_id);

-- application_tasks: 用户只能管理自己的任务
CREATE POLICY "Users can view own tasks" ON public.application_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON public.application_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.application_tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON public.application_tasks
    FOR DELETE USING (auth.uid() = user_id);

-- school_list: 用户只能管理自己的选校名单
CREATE POLICY "Users can view own school list" ON public.school_list
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own school list" ON public.school_list
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own school list" ON public.school_list
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own school list" ON public.school_list
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- Trigger: 新用户注册时自动创建 profile
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, display_name, username)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        split_part(NEW.email, '@', 1)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
