'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth/context';

const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes en millisecondes (augmenté)
const AUTO_LOGOUT_TIMEOUT = 60 * 1000; // 60 secondes en millisecondes (doublé)
const MIN_ACTIVITY_INTERVAL = 60000; // Minimum 1 minute entre réinitialisations

export default function SessionManager() {
  const { user, signOut } = useAuth();
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(AUTO_LOGOUT_TIMEOUT);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [countdownTimer, setCountdownTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());

  // Réinitialiser le timer de session
  const resetSessionTimer = useCallback(() => {
    const now = Date.now();
    
    // Vérifier si assez de temps s'est écoulé depuis la dernière activité
    if (now - lastActivityTime < MIN_ACTIVITY_INTERVAL) {
      return; // Ignorer les activités trop fréquentes
    }
    
    setLastActivityTime(now);
    
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }
    
    if (user) {
      const timer = setTimeout(() => {
        setShowTimeoutModal(true);
        setTimeLeft(AUTO_LOGOUT_TIMEOUT);
      }, SESSION_TIMEOUT);
      
      setSessionTimer(timer);
    }
  }, [user, lastActivityTime]);

  // Démarrer le compte à rebours pour la déconnexion automatique
  const startCountdown = useCallback(() => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          // Temps écoulé, déconnexion automatique
          handleAutoLogout();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    setCountdownTimer(timer);
  }, [/* Retirer countdownTimer pour éviter la boucle infinie */]);

  // Gérer la déconnexion automatique
  const handleAutoLogout = async () => {
    setShowTimeoutModal(false);
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }
    await signOut();
  };

  // Gérer le choix de rester connecté
  const handleStayConnected = () => {
    setShowTimeoutModal(false);
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }
    setLastActivityTime(Date.now()); // Mettre à jour l'heure de dernière activité
    resetSessionTimer();
    setTimeLeft(AUTO_LOGOUT_TIMEOUT);
  };

  // Gérer le choix de se déconnecter
  const handleSignOut = async () => {
    setShowTimeoutModal(false);
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }
    
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Forcer la déconnexion même en cas d'erreur
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  // Effets pour la gestion des événements utilisateur
  useEffect(() => {
    if (user && !showTimeoutModal) {
      resetSessionTimer();
    }

    return () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
    };
  }, [user, resetSessionTimer, showTimeoutModal]);

  // Effet pour démarrer le compte à rebours quand le modal s'affiche
  useEffect(() => {
    if (showTimeoutModal) {
      startCountdown();
    }

    return () => {
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
    };
  }, [showTimeoutModal, startCountdown]);

  // Écouter les événements utilisateur pour réinitialiser le timer
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimer = () => {
      if (user && !showTimeoutModal) {
        resetSessionTimer();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [user, showTimeoutModal, resetSessionTimer]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
    };
  }, [sessionTimer, countdownTimer]);

  if (!user || !showTimeoutModal) {
    return null;
  }

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Session expirée
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Votre session a expiré après 10 minutes d'inactivité pour des raisons de sécurité.
            Souhaitez-vous rester connecté ?
          </p>
          
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Déconnexion automatique dans : 
              <span className="font-mono font-semibold ml-1">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStayConnected}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Rester connecté
            </button>
            
            <button
              onClick={handleSignOut}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}