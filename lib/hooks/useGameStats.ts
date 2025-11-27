'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';
import type { KhidmaGameState } from '@/app/jeux/types';

export interface ActiveTask {
  id: string;
  taskId: string;
  taskType: string;
  progress: number;
  startTime: string;
  estimatedCompletion?: string;
  isCompleted: boolean;
}

export interface SavedGameStats {
  gameType: string;
  gameState: KhidmaGameState;
  totalPlayTime: number;
  sessionPlayTime: number;
  lastSaved?: string;
  version?: number;
}

interface UseGameProgressOptions {
  autoSaveInterval?: number;
  gameType?: string;
  onLoad?: (data: SavedGameStats) => void;
  onSaveSuccess?: (data: SavedGameStats) => void;
  onSaveError?: (error: Error) => void;
}

interface GameStatsReturn {
  gameState: KhidmaGameState;
  setGameState: React.Dispatch<React.SetStateAction<KhidmaGameState>>;
  activeTasks: ActiveTask[];
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
  saveProgress: (newGameState: KhidmaGameState) => Promise<KhidmaGameState | undefined>;
  scheduleAutoSave: (newGameState: KhidmaGameState) => void;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  sessionPlayTime: number;
  totalPlayTime: number;
  loadedStats: SavedGameStats | null;
  markAsChanged: (newGameState: KhidmaGameState) => void;
  saveTaskProgress: (taskId: string, taskType: string, progress: number, isCompleted?: boolean) => Promise<void>;
  currentSession: boolean;
}

export function useGameStats(
  initialGameState: KhidmaGameState,
  options: UseGameProgressOptions = {}
): GameStatsReturn {
  const {
    autoSaveInterval = 30000,
    gameType = 'khidma_sentier',
    onLoad,
    onSaveSuccess,
    onSaveError
  } = options;

  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [gameState, setGameState] = useState<KhidmaGameState>(initialGameState);
  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([]);
  const [savedStats, setSavedStats] = useState<SavedGameStats | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionPlayTime, setSessionPlayTime] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const sessionStartRef = useRef(Date.now());
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<KhidmaGameState | null>(null);
  const lastSaveRef = useRef<number>(0);
  const hasLoadedRef = useRef(false);

  // Obtenir le token d'accès pour les appels API
  const getAuthToken = useCallback(async (): Promise<string | null> => {
    if (!user) {
      console.warn('⚠️ Utilisateur non disponible');
      return null;
    }
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Erreur session:', sessionError);
        return null;
      }

      if (!session?.access_token) {
        console.warn('⚠️ Pas de token disponible');
        return null;
      }

      return session.access_token;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du token:', error);
      return null;
    }
  }, [user, supabase.auth]);

  // Extraire les tâches actives
  const extractActiveTasks = useCallback((state: KhidmaGameState) => {
    const tasks: ActiveTask[] = [];

    if (state?.khidma?.completedTasks && Array.isArray(state.khidma.completedTasks)) {
      state.khidma.completedTasks.forEach((task: any, idx: number) => {
        if (task && !task.isCompleted) {
          tasks.push({
            id: `khidma-${idx}`,
            taskId: task.id || `task-${idx}`,
            taskType: 'khidma',
            progress: task.progress || 0,
            startTime: task.startTime || new Date().toISOString(),
            estimatedCompletion: task.estimatedCompletion,
            isCompleted: false
          });
        }
      });
    }

    setActiveTasks(tasks);
  }, []);

  // Chargement de la sauvegarde existante
  useEffect(() => {
    // Ne pas charger si l'auth est en cours
    if (authLoading) {
      console.log('🔄 Auth en cours de chargement...');
      return;
    }

    // Ne pas charger si pas d'utilisateur
    if (!user?.id) {
      console.log('⚠️ Pas d\'utilisateur connecté - utilisation de l\'état initial');
      setIsLoading(false);
      hasLoadedRef.current = true;
      return;
    }

    // Éviter les chargements multiples
    if (hasLoadedRef.current) {
      return;
    }

    const loadGameStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = await getAuthToken();
        
        if (!token) {
          console.warn('⚠️ Pas de token - utilisation de l\'état initial');
          setIsLoading(false);
          hasLoadedRef.current = true;
          return;
        }

        console.log('📥 Chargement des stats du jeu...');

        const response = await fetch(`/api/game-stats?gameType=${gameType}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        // 404 est normal si c'est la première partie
        if (response.status === 404) {
          console.log('ℹ️ Pas de sauvegarde existante - nouvelle partie');
          setIsLoading(false);
          hasLoadedRef.current = true;
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || errorData.message || `Erreur HTTP: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (data?.game_state) {
          console.log('✅ Stats chargées:', data);
          
          setGameState(data.game_state);
          extractActiveTasks(data.game_state);
          setTotalPlayTime(data.total_play_time || 0);

          const lastSavedTime = data.last_saved ? new Date(data.last_saved).getTime() : Date.now();
          const sessionPlay = Math.floor((Date.now() - lastSavedTime) / 1000);

          const loaded: SavedGameStats = {
            gameType,
            gameState: data.game_state,
            totalPlayTime: data.total_play_time || 0,
            sessionPlayTime: Math.max(0, sessionPlay),
            lastSaved: data.last_saved || new Date().toISOString(),
            version: data.version || 1
          };

          setSavedStats(loaded);
          onLoad?.(loaded);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        console.error('❌ Erreur lors du chargement:', errorMessage);
        setError(err instanceof Error ? err : new Error(errorMessage));
        // Ne pas interrompre l'application - utiliser l'état initial
      } finally {
        setIsLoading(false);
        hasLoadedRef.current = true;
      }
    };

    loadGameStats();
  }, [user?.id, authLoading, gameType, extractActiveTasks, onLoad, getAuthToken]);

  // Sauvegarde principale via API
  const saveProgress = useCallback(
    async (newGameState: KhidmaGameState): Promise<KhidmaGameState | undefined> => {
      try {
        setIsSaving(true);

        // Si pas d'utilisateur, sauvegarder localement
        if (!user) {
          console.warn('⚠️ Pas d\'utilisateur - stockage local uniquement');
          pendingDataRef.current = newGameState;
          setGameState(newGameState);
          return newGameState;
        }

        const token = await getAuthToken();
        if (!token) {
          console.warn('⚠️ Pas de token - stockage local uniquement');
          pendingDataRef.current = newGameState;
          return newGameState;
        }

        console.log('💾 Sauvegarde en cours...');

        const response = await fetch('/api/game-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            gameType,
            gameState: newGameState,
            sessionPlayTime
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || errorData.message || 'Erreur lors de la sauvegarde';
          throw new Error(errorMessage);
        }

        const saved = await response.json();
        console.log('✅ Partie sauvegardée:', saved);

        lastSaveRef.current = Date.now();
        pendingDataRef.current = null;
        setGameState(newGameState);
        setTotalPlayTime(saved.total_play_time || 0);

        onSaveSuccess?.({
          gameType,
          gameState: newGameState,
          totalPlayTime: saved.total_play_time || 0,
          sessionPlayTime: sessionPlayTime,
          lastSaved: new Date().toISOString()
        });

        return newGameState;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        console.error('❌ Erreur lors de la sauvegarde:', errorMessage);
        onSaveError?.(err instanceof Error ? err : new Error(errorMessage));
        // Continuer même en cas d'erreur
        setGameState(newGameState);
        return newGameState;
      } finally {
        setIsSaving(false);
      }
    },
    [user, gameType, sessionPlayTime, getAuthToken, onSaveSuccess, onSaveError]
  );

  // Auto-save intelligent
  const scheduleAutoSave = useCallback(
    (newGameState: KhidmaGameState) => {
      pendingDataRef.current = newGameState;
      setGameState(newGameState);

      const now = Date.now();
      const timeSinceLastSave = now - lastSaveRef.current;

      // Si dernière sauvegarde < 5s, attendre avant de sauvegarder
      if (timeSinceLastSave < 5000) {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(
          () => pendingDataRef.current && saveProgress(pendingDataRef.current),
          autoSaveInterval
        );
        return;
      }

      // Sinon, sauvegarder immédiatement
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveProgress(newGameState);
    },
    [autoSaveInterval, saveProgress]
  );

  // Temps de session
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionPlayTime(Math.floor((Date.now() - sessionStartRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Cleanup - Sauvegarder avant de quitter
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (pendingDataRef.current && user) {
        saveProgress(pendingDataRef.current);
      }
    };
  }, [saveProgress, user]);

  // Marquer comme changé
  const markAsChanged = useCallback((newGameState: KhidmaGameState) => {
    pendingDataRef.current = newGameState;
    setGameState(newGameState);
  }, []);

  // Sauvegarder la progression d'une tâche
  const saveTaskProgress = useCallback(async (
    taskId: string, 
    taskType: string, 
    progress: number, 
    isCompleted = false
  ): Promise<void> => {
    console.log(`📊 Task progress: ${taskId} - ${progress}% (${isCompleted ? 'completed' : 'in progress'})`);
    // Implémenter la logique si nécessaire
  }, []);

  return {
    gameState,
    setGameState,
    activeTasks,
    isLoading,
    isSaving,
    error,
    saveProgress,
    scheduleAutoSave,
    hasUnsavedChanges: pendingDataRef.current !== null,
    lastSaved: lastSaveRef.current ? new Date(lastSaveRef.current) : null,
    sessionPlayTime,
    totalPlayTime,
    loadedStats: savedStats,
    markAsChanged,
    saveTaskProgress,
    currentSession: true
  };
}