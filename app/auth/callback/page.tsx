'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';

export default function AuthCallback() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Attendre quelques secondes puis rediriger
    const timer = setTimeout(() => {
      if (user) {
        // Si l'utilisateur est connecté, rediriger vers l'accueil
        router.push('/');
      } else {
        // Si pas d'utilisateur, rediriger vers la connexion
        router.push('/auth/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-600 dark:bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Finalisation de la connexion...
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Veuillez patienter, nous finalisons votre authentification.
        </p>
      </div>
    </div>
  );
}