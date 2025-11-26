-- Table game_stats: Sauvegardes principales
CREATE TABLE public.game_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type VARCHAR(50) NOT NULL,
  game_state JSONB NOT NULL,
  total_play_time INTEGER DEFAULT 0, -- en secondes
  session_play_time INTEGER DEFAULT 0, -- en secondes
  last_saved TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_type)
);

-- Index pour les recherches rapides
CREATE INDEX idx_game_stats_user_id ON public.game_stats(user_id);
CREATE INDEX idx_game_stats_game_type ON public.game_stats(game_type);
CREATE INDEX idx_game_stats_last_saved ON public.game_stats(last_saved DESC);

-- Table game_stats_history: Historique des sauvegardes
CREATE TABLE public.game_stats_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type VARCHAR(50) NOT NULL,
  game_state JSONB NOT NULL,
  total_play_time INTEGER DEFAULT 0,
  session_play_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour l'historique
CREATE INDEX idx_game_stats_history_user_id ON public.game_stats_history(user_id);
CREATE INDEX idx_game_stats_history_game_type ON public.game_stats_history(game_type);
CREATE INDEX idx_game_stats_history_created_at ON public.game_stats_history(created_at DESC);

-- Table player_achievements: Achievements du joueur
CREATE TABLE public.player_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Index pour les achievements
CREATE INDEX idx_player_achievements_user_id ON public.player_achievements(user_id);
CREATE INDEX idx_player_achievements_earned_at ON public.player_achievements(earned_at DESC);

-- Table game_sessions: Sessions actives
CREATE TABLE public.game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type VARCHAR(50) NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  play_duration INTEGER, -- en secondes
  status VARCHAR(20) DEFAULT 'active', -- active, paused, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les sessions
CREATE INDEX idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX idx_game_sessions_status ON public.game_sessions(status);
CREATE INDEX idx_game_sessions_session_start ON public.game_sessions(session_start DESC);

-- Table player_progression: Progression détaillée
CREATE TABLE public.player_progression (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type VARCHAR(50) NOT NULL,
  level VARCHAR(50),
  experience INTEGER DEFAULT 0,
  completed_tasks JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '{}'::jsonb,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour la progression
CREATE INDEX idx_player_progression_user_id ON public.player_progression(user_id);
CREATE INDEX idx_player_progression_game_type ON public.player_progression(game_type);
CREATE INDEX idx_player_progression_last_updated ON public.player_progression(last_updated DESC);

-- Politique de sécurité: Les utilisateurs ne peuvent voir que leurs propres stats
CREATE POLICY "Users can view their own game stats"
  ON public.game_stats
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game stats"
  ON public.game_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game stats"
  ON public.game_stats
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique pour l'historique
CREATE POLICY "Users can view their own game history"
  ON public.game_stats_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game history"
  ON public.game_stats_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique pour les achievements
CREATE POLICY "Users can view their own achievements"
  ON public.player_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.player_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Fonction pour mettre à jour l'updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger pour game_stats
CREATE TRIGGER game_stats_updated_at
  BEFORE UPDATE ON public.game_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour player_progression
CREATE TRIGGER player_progression_updated_at
  BEFORE UPDATE ON public.player_progression
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();