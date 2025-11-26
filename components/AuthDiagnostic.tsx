'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { AlertCircle, RefreshCw, CheckCircle, Wifi, WifiOff, User, Lock } from 'lucide-react';

interface AuthDiagnosticProps {
  onRefresh?: () => void;
}

export default function AuthDiagnostic({ onRefresh }: AuthDiagnosticProps) {
  const { user, loading } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!user) {
        setIssues(['Utilisateur non connecté']);
        setChecking(false);
        return;
      }

      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        setSessionInfo({
          user: {
            id: user.id,
            email: user.email,
            created_at: user.created_at
          },
          session: {
            access_token: !!session?.access_token,
            refresh_token: !!session?.refresh_token,
            expires_at: session?.expires_at,
            token_type: session?.token_type
          }
        });

        const foundIssues = [];

        if (!session?.access_token) {
          foundIssues.push('Token d\'accès manquant');
        }

        if (!session?.refresh_token) {
          foundIssues.push('Token de rafraîchissement manquant');
        }

        if (session?.expires_at && session.expires_at * 1000 < Date.now()) {
          foundIssues.push('Session expirée');
        }

        setIssues(foundIssues);
      } catch (error) {
        setIssues(['Erreur lors de la vérification de la session']);
      } finally {
        setChecking(false);
      }
    };

    checkAuthStatus();
  }, [user]);

  if (loading || checking) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mr-2" />
          <span className="text-blue-800">Vérification de l'authentification...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Diagnostic d'Authentification
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualiser
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Status utilisateur */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Utilisateur</span>
          <div className="flex items-center">
            {user ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-700">
                  {user.email || user.id}
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-700">Non connecté</span>
              </>
            )}
          </div>
        </div>

        {/* Status session */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Session</span>
          <div className="flex items-center">
            {sessionInfo?.session?.access_token ? (
              <>
                <Wifi className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-700">Active</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-700">Inactive</span>
              </>
            )}
          </div>
        </div>

        {/* Token */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Token Auth</span>
          <div className="flex items-center">
            <Lock className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm text-blue-700">
              {sessionInfo?.session?.access_token ? 'Présent' : 'Absent'}
            </span>
          </div>
        </div>

        {/* Issues détectées */}
        {issues.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-800">
                Problèmes détectés ({issues.length})
              </span>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {issues.map((issue, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Session info détaillées */}
        {sessionInfo && issues.length === 0 && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">
                Authentification OK
              </span>
            </div>
            <div className="text-xs text-green-700 space-y-1">
              <div>ID: {sessionInfo.user.id.slice(0, 8)}...</div>
              <div>Email: {sessionInfo.user.email}</div>
              {sessionInfo.session.expires_at && (
                <div>
                  Expire: {new Date(sessionInfo.session.expires_at * 1000).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}