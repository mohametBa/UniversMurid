'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { RefreshCw, AlertTriangle, CheckCircle, Download, Upload, Save } from 'lucide-react';
import { useGameStats } from '@/lib/hooks/useGameStats';
import type { KhidmaGameState } from '@/app/jeux/types';

interface ProgressRecoveryProps {
  gameState: KhidmaGameState;
  onGameStateUpdate: (newState: KhidmaGameState) => void;
}

export default function ProgressRecovery({ gameState, onGameStateUpdate }: ProgressRecoveryProps) {
  const { user } = useAuth();
  const [localData, setLocalData] = useState<any>(null);
  const [serverData, setServerData] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  // Hook pour les stats du serveur
  const {
    loadedStats: serverStats,
    isLoading: serverLoading,
    error: serverError
  } = useGameStats(gameState, { gameType: 'khidma_sentier' });

  // Vérifier les données locales
  const checkLocalData = () => {
    try {
      const saved = localStorage.getItem('universmurid_game_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        setLocalData({
          ...parsed,
          timestamp: new Date(parsed.timestamp || Date.now())
        });
      }
    } catch (error) {
      console.error('Erreur lors de la lecture des données locales:', error);
      setLocalData(null);
    }
  };

  // Vérifier les données du serveur
  const checkServerData = async () => {
    if (!user) return;

    setChecking(true);
    try {
      // Les données du serveur sont gérées par le hook useGameStats
      setLastCheck(new Date());
    } catch (error) {
      console.error('Erreur lors de la vérification des données serveur:', error);
    } finally {
      setChecking(false);
    }
  };

  // Synchroniser avec le serveur
  const syncWithServer = async () => {
    if (!user || !serverStats) return;

    setSyncStatus('syncing');
    try {
      // Sauvegarder les données locales vers le serveur si elles sont plus récentes
      if (localData && localData.timestamp > new Date(serverStats.lastSaved || 0)) {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
          const response = await fetch('/api/game-stats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              gameType: 'khidma_sentier',
              gameState: localData.gameState || gameState,
              sessionPlayTime: localData.sessionPlayTime || 0,
            }),
          });

          if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde');
          }

          setSyncStatus('success');
          setTimeout(() => setSyncStatus('idle'), 3000);
          return;
        }
      }

      // Charger les données du serveur vers le local
      if (serverStats.gameState) {
        const localSave = {
          gameState: serverStats.gameState,
          timestamp: serverStats.lastSaved ? new Date(serverStats.lastSaved).getTime() : Date.now(),
          totalPlayTime: serverStats.totalPlayTime,
          sessionPlayTime: serverStats.sessionPlayTime
        };

        localStorage.setItem('universmurid_game_state', JSON.stringify(localSave));
        onGameStateUpdate(serverStats.gameState);
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  // Forcer la sauvegarde locale
  const saveLocal = () => {
    try {
      const saveData = {
        gameState,
        timestamp: Date.now(),
        totalPlayTime: serverStats?.totalPlayTime || 0,
        sessionPlayTime: serverStats?.sessionPlayTime || 0
      };

      localStorage.setItem('universmurid_game_state', JSON.stringify(saveData));
      setLocalData(saveData);
      
      // Feedback visuel
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  useEffect(() => {
    checkLocalData();
  }, [gameState]);

  useEffect(() => {
    if (serverStats) {
      setServerData(serverStats);
    }
  }, [serverStats]);

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
          <span className="text-yellow-800">
            Connectez-vous pour sauvegarder votre progression
          </span>
        </div>
      </div>
    );
  }

  const hasLocalData = !!localData;
  const hasServerData = !!serverStats;
  const localNewer = localData && serverStats && 
    new Date(localData.timestamp) > new Date(serverStats.lastSaved || 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Save className="w-5 h-5 mr-2" />
          Récupération de Progression
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={checkServerData}
            disabled={checking}
            className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${checking ? 'animate-spin' : ''}`} />
            Vérifier
          </button>
          <button
            onClick={saveLocal}
            disabled={syncStatus === 'syncing'}
            className="flex items-center text-sm bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded"
          >
            <Download className="w-4 h-4 mr-1" />
            Sauver Local
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Données locales */}
        <div className="border rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <Upload className="w-4 h-4 mr-1" />
            Stockage Local
          </h4>
          {hasLocalData ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Données:</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-sm text-gray-600">
                Dernière sauvegarde: {localData.timestamp ? 
                  new Date(localData.timestamp).toLocaleString() : 
                  'Inconnue'
                }
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Aucune donnée locale</div>
          )}
        </div>

        {/* Données serveur */}
        <div className="border rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <Download className="w-4 h-4 mr-1" />
            Serveur
          </h4>
          {serverLoading ? (
            <div className="text-sm text-gray-500">Chargement...</div>
          ) : hasServerData ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Données:</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-sm text-gray-600">
                Dernière sauvegarde: {serverStats.lastSaved ? 
                  new Date(serverStats.lastSaved).toLocaleString() : 
                  'Inconnue'
                }
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Aucune donnée serveur</div>
          )}
        </div>
      </div>

      {/* Actions de synchronisation */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">Synchronisation</span>
          {syncStatus === 'syncing' && (
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          )}
          {syncStatus === 'success' && (
            <CheckCircle className="w-4 h-4 text-green-600" />
          )}
          {syncStatus === 'error' && (
            <AlertTriangle className="w-4 h-4 text-red-600" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {localNewer ? 
              'Les données locales sont plus récentes' : 
              'Les données serveur sont à jour'
            }
          </div>
          <button
            onClick={syncWithServer}
            disabled={syncStatus === 'syncing' || (!hasLocalData && !hasServerData)}
            className="flex items-center text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-3 py-1 rounded"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            Synchroniser
          </button>
        </div>
      </div>

      {lastCheck && (
        <div className="mt-2 text-xs text-gray-500">
          Dernière vérification: {lastCheck.toLocaleString()}
        </div>
      )}
    </div>
  );
}