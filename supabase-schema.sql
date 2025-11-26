-- ================================================
-- Schema SQL pour l'authentification et les stats
-- ================================================

-- 1. Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Table des profils utilisateurs (étend auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    email_confirmed_at TIMESTAMP WITH TIME ZONE,
    last_sign_in_at TIMESTAMP WITH TIME ZONE
);

-- 3. Table des statistiques des joueurs
CREATE TABLE public.player_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    total_quizzes_played INTEGER DEFAULT 0,
    total_correct_answers INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    total_time_played INTEGER DEFAULT 0, -- en minutes
    favorite_category TEXT,
    achievements TEXT[], -- Array des réussites
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Table des sessions utilisateur
CREATE TABLE public.user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    session_end TIMESTAMP WITH TIME ZONE,
    total_activities INTEGER DEFAULT 0,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Table des activités utilisateur
CREATE TABLE public.user_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.user_sessions(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'quiz_started', 'quiz_completed', 'login', etc.
    activity_data JSONB, -- Données spécifiques à l'activité
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Table des quiz et questions (optionnel)
CREATE TABLE public.quizzes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty_level INTEGER DEFAULT 1, -- 1=facile, 2=moyen, 3=difficile
    time_limit INTEGER, -- en secondes
    total_questions INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice', -- 'multiple_choice', 'true_false', 'text'
    options JSONB, -- Array des options pour choix multiples
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Table des tentatives de quiz
CREATE TABLE public.quiz_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- en secondes
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ================================================
-- INDEXES pour optimiser les performances
-- ================================================

-- Index pour les recherches fréquentes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX idx_player_stats_user_id ON public.player_stats(user_id);
CREATE INDEX idx_player_stats_total_score ON public.player_stats(total_score DESC);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at);
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_quizzes_category ON public.quizzes(category);
CREATE INDEX idx_questions_quiz_id ON public.questions(quiz_id);

-- ================================================
-- FONCTIONS TRIGGER pour la mise à jour automatique
-- ================================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, avatar_url, email_confirmed_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.email_confirmed_at
    );
    
    INSERT INTO public.player_stats (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- TABLES POUR LA PROGRESSION DES JEUX
-- ================================================

-- Table pour sauvegarder l'état des jeux
CREATE TABLE public.game_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    game_type TEXT NOT NULL, -- 'khidma', 'quiz', 'learning_portal'
    game_state JSONB NOT NULL, -- État complet du jeu (sérialisé)
    current_session_id UUID REFERENCES public.user_sessions(id),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table pour sauvegarder la progression des tâches en cours
CREATE TABLE public.task_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    game_progress_id UUID REFERENCES public.game_progress(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL,
    task_type TEXT NOT NULL,
    progress_percentage INTEGER DEFAULT 0, -- 0-100
    start_time TIMESTAMP WITH TIME ZONE,
    estimated_completion TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table pour les statistiques de sessions de jeu
CREATE TABLE public.game_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.user_sessions(id),
    game_type TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    activities_completed INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    experience_gained INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ================================================
-- INDEXES POUR LES NOUVELLES TABLES
-- ================================================

CREATE INDEX idx_game_progress_user_id ON public.game_progress(user_id);
CREATE INDEX idx_game_progress_type ON public.game_progress(game_type);
CREATE INDEX idx_game_progress_last_activity ON public.game_progress(last_activity_at);
CREATE INDEX idx_task_progress_user_id ON public.task_progress(user_id);
CREATE INDEX idx_task_progress_game_id ON public.task_progress(game_progress_id);
CREATE INDEX idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX idx_game_sessions_active ON public.game_sessions(is_active);

-- ================================================
-- FONCTIONS POUR LA PROGRESSION AUTOMATIQUE
-- ================================================

-- Fonction pour sauvegarder la progression d'un jeu
CREATE OR REPLACE FUNCTION public.save_game_progress(
    p_user_id UUID,
    p_game_type TEXT,
    p_game_state JSONB,
    p_session_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    progress_id UUID;
BEGIN
    -- Insérer ou mettre à jour la progression
    INSERT INTO public.game_progress (
        user_id,
        game_type,
        game_state,
        current_session_id,
        last_activity_at
    ) VALUES (
        p_user_id,
        p_game_type,
        p_game_state,
        p_session_id,
        TIMEZONE('utc'::text, NOW())
    )
    ON CONFLICT (user_id, game_type) 
    DO UPDATE SET
        game_state = p_game_state,
        current_session_id = COALESCE(p_session_id, game_progress.current_session_id),
        last_activity_at = TIMEZONE('utc'::text, NOW()),
        updated_at = TIMEZONE('utc'::text, NOW())
    RETURNING id INTO progress_id;
    
    RETURN progress_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour récupérer la progression d'un jeu
CREATE OR REPLACE FUNCTION public.get_game_progress(
    p_user_id UUID,
    p_game_type TEXT
)
RETURNS JSONB AS $$
DECLARE
    game_state JSONB;
BEGIN
    SELECT gp.game_state INTO game_state
    FROM public.game_progress gp
    WHERE gp.user_id = p_user_id AND gp.game_type = p_game_type
    ORDER BY gp.last_activity_at DESC
    LIMIT 1;
    
    RETURN COALESCE(game_state, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour sauvegarder la progression d'une tâche
CREATE OR REPLACE FUNCTION public.save_task_progress(
    p_user_id UUID,
    p_game_progress_id UUID,
    p_task_id TEXT,
    p_task_type TEXT,
    p_progress_percentage INTEGER,
    p_start_time TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_estimated_completion TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_is_completed BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
    task_id UUID;
BEGIN
    INSERT INTO public.task_progress (
        user_id,
        game_progress_id,
        task_id,
        task_type,
        progress_percentage,
        start_time,
        estimated_completion,
        is_completed
    ) VALUES (
        p_user_id,
        p_game_progress_id,
        p_task_id,
        p_task_type,
        p_progress_percentage,
        COALESCE(p_start_time, TIMEZONE('utc'::text, NOW())),
        p_estimated_completion,
        p_is_completed
    )
    ON CONFLICT (user_id, task_id) 
    DO UPDATE SET
        progress_percentage = p_progress_percentage,
        estimated_completion = p_estimated_completion,
        is_completed = p_is_completed,
        updated_at = TIMEZONE('utc'::text, NOW())
    RETURNING id INTO task_id;
    
    RETURN task_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour récupérer les tâches en cours
CREATE OR REPLACE FUNCTION public.get_user_active_tasks(p_user_id UUID)
RETURNS TABLE (
    task_id TEXT,
    task_type TEXT,
    progress_percentage INTEGER,
    start_time TIMESTAMP WITH TIME ZONE,
    estimated_completion TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tp.task_id,
        tp.task_type,
        tp.progress_percentage,
        tp.start_time,
        tp.estimated_completion,
        tp.is_completed
    FROM public.task_progress tp
    WHERE tp.user_id = p_user_id 
    AND tp.is_completed = false
    ORDER BY tp.start_time DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour créer une session de jeu
CREATE OR REPLACE FUNCTION public.start_game_session(
    p_user_id UUID,
    p_game_type TEXT,
    p_session_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    game_session_id UUID;
BEGIN
    INSERT INTO public.game_sessions (
        user_id,
        session_id,
        game_type,
        start_time
    ) VALUES (
        p_user_id,
        p_session_id,
        p_game_type,
        TIMEZONE('utc'::text, NOW())
    )
    RETURNING id INTO game_session_id;
    
    RETURN game_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour terminer une session de jeu
CREATE OR REPLACE FUNCTION public.end_game_session(
    p_user_id UUID,
    p_game_type TEXT,
    p_activities_completed INTEGER DEFAULT 0,
    p_points_earned INTEGER DEFAULT 0,
    p_experience_gained INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.game_sessions 
    SET 
        end_time = TIMEZONE('utc'::text, NOW()),
        activities_completed = p_activities_completed,
        points_earned = p_points_earned,
        experience_gained = p_experience_gained,
        is_active = false
    WHERE user_id = p_user_id 
    AND game_type = p_game_type 
    AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- TRIGGERS POUR LES NOUVELLES TABLES
-- ================================================

-- Trigger pour updated_at sur game_progress
CREATE TRIGGER set_timestamp_game_progress
    BEFORE UPDATE ON public.game_progress
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger pour updated_at sur task_progress
CREATE TRIGGER set_timestamp_task_progress
    BEFORE UPDATE ON public.task_progress
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ================================================
-- POLITIQUES RLS POUR LES NOUVELLES TABLES
-- ================================================

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques pour game_progress
CREATE POLICY "Les utilisateurs peuvent voir leur propre progression" ON public.game_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leur progression" ON public.game_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leur progression" ON public.game_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour task_progress
CREATE POLICY "Les utilisateurs peuvent voir leurs tâches" ON public.task_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs tâches" ON public.task_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs tâches" ON public.task_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour game_sessions
CREATE POLICY "Les utilisateurs peuvent voir leurs sessions de jeu" ON public.game_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs sessions de jeu" ON public.game_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs sessions de jeu" ON public.game_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- CONTRAINTE UNIQUE POUR Éviter LES DOUBLONS
-- ================================================

-- Assurer qu'un utilisateur n'a qu'une progression active par type de jeu
ALTER TABLE public.game_progress 
ADD CONSTRAINT unique_user_game_type_progress 
UNIQUE (user_id, game_type);

-- Fonction pour calculer le niveau basé sur l'expérience
CREATE OR REPLACE FUNCTION public.calculate_level(experience_points INTEGER)
RETURNS INTEGER AS $$
    RETURN FLOOR(SQRT(experience_points / 100.0))::INTEGER + 1;
$$ LANGUAGE plpgsql;

-- ================================================
-- TRIGGERS
-- ================================================

-- Trigger pour updated_at sur user_profiles
CREATE TRIGGER set_timestamp_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger pour updated_at sur player_stats
CREATE TRIGGER set_timestamp_player_stats
    BEFORE UPDATE ON public.player_stats
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger pour updated_at sur quizzes
CREATE TRIGGER set_timestamp_quizzes
    BEFORE UPDATE ON public.quizzes
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger pour créer un profil automatiquement lors de l'inscription
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ================================================
-- VUES pour les statistiques globales
-- ================================================

-- Vue des statistiques globales
CREATE VIEW public.global_stats AS
SELECT
    COUNT(DISTINCT up.id) as total_users,
    COUNT(DISTINCT pa.user_id) as active_players,
    SUM(ps.total_quizzes_played) as total_quizzes_played,
    SUM(ps.total_correct_answers) as total_correct_answers,
    AVG(ps.best_score) as average_best_score,
    MAX(ps.best_score) as highest_score,
    SUM(ps.total_time_played) as total_time_played_minutes
FROM public.user_profiles up
LEFT JOIN public.player_stats ps ON up.id = ps.user_id
LEFT JOIN (
    SELECT DISTINCT user_id 
    FROM public.user_activities 
    WHERE created_at >= NOW() - INTERVAL '30 days'
) pa ON up.id = pa.user_id;

-- Vue du leaderboard
CREATE VIEW public.leaderboard AS
SELECT
    up.id,
    up.full_name,
    up.avatar_url,
    ps.level,
    ps.total_score,
    ps.best_score,
    ps.total_quizzes_played,
    ps.current_streak,
    ps.longest_streak,
    ps.experience_points,
    ROW_NUMBER() OVER (ORDER BY ps.total_score DESC, ps.best_score DESC) as rank
FROM public.user_profiles up
JOIN public.player_stats ps ON up.id = ps.user_id
WHERE ps.total_quizzes_played > 0
ORDER BY ps.total_score DESC, ps.best_score DESC;

-- ================================================
-- POLITIQUES RLS (Row Level Security)
-- ================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Politiques pour player_stats
CREATE POLICY "Les utilisateurs peuvent voir leurs propres stats" ON public.player_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent voir toutes les stats" ON public.player_stats
    FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres stats" ON public.player_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour user_sessions
CREATE POLICY "Les utilisateurs peuvent voir leurs propres sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs propres sessions" ON public.user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour user_activities
CREATE POLICY "Les utilisateurs peuvent voir leurs propres activités" ON public.user_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs propres activités" ON public.user_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour quiz_attempts
CREATE POLICY "Les utilisateurs peuvent voir leurs propres tentatives" ON public.quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs propres tentatives" ON public.quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ================================================
-- DONNÉES D'EXEMPLE (optionnel)
-- ================================================

-- Insérer quelques catégories de quiz par défaut
INSERT INTO public.quizzes (title, description, category, difficulty_level, total_questions) VALUES
('Quiz Khassida - Niveau Débutant', 'Quiz sur les Khassida pour débutants', 'Khassida', 1, 10),
('Quiz Khassida - Niveau Intermédiaire', 'Quiz sur les Khassida niveau intermédiaire', 'Khassida', 2, 15),
('Quiz Khassida - Niveau Avancé', 'Quiz sur les Khassida pour experts', 'Khassida', 3, 20),
('Quiz Culture Islamique', 'Questions sur la culture et les valeurs islamiques', 'Culture', 1, 10),
('Quiz Histoire Islamique', 'Questions sur l''histoire de l''Islam', 'Histoire', 2, 15);

-- ================================================
-- FONCTIONS UTILITAIRES
-- ================================================

-- Fonction pour mettre à jour les stats après un quiz
CREATE OR REPLACE FUNCTION public.update_player_stats_after_quiz(
    quiz_user_id UUID,
    quiz_score INTEGER,
    quiz_total_questions INTEGER,
    quiz_correct_answers INTEGER,
    quiz_time_spent INTEGER
)
RETURNS VOID AS $$
DECLARE
    current_level INTEGER;
    new_experience INTEGER;
    new_total_score INTEGER;
    new_best_score INTEGER;
    new_current_streak INTEGER;
    new_longest_streak INTEGER;
    current_stats RECORD;
BEGIN
    -- Récupérer les stats actuelles
    SELECT * INTO current_stats
    FROM public.player_stats
    WHERE user_id = quiz_user_id;
    
    -- Calculer les nouvelles valeurs
    new_total_score := current_stats.total_score + quiz_score;
    new_best_score := GREATEST(current_stats.best_score, quiz_score);
    new_experience := current_stats.experience_points + quiz_score * 10;
    new_current_streak := CASE
        WHEN quiz_correct_answers = quiz_total_questions THEN current_stats.current_streak + 1
        ELSE 0
    END;
    new_longest_streak := GREATEST(current_stats.longest_streak, new_current_streak);
    
    -- Calculer le nouveau niveau
    current_level := public.calculate_level(new_experience);
    
    -- Mettre à jour les stats
    UPDATE public.player_stats SET
        total_quizzes_played = current_stats.total_quizzes_played + 1,
        total_correct_answers = current_stats.total_correct_answers + quiz_correct_answers,
        total_score = new_total_score,
        best_score = new_best_score,
        current_streak = new_current_streak,
        longest_streak = new_longest_streak,
        total_time_played = current_stats.total_time_played + (quiz_time_spent / 60),
        level = current_level,
        experience_points = new_experience,
        updated_at = NOW()
    WHERE user_id = quiz_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
