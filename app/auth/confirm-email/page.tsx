'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { Mail, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';

export default function ConfirmEmailPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    // Si l'utilisateur est déjà connecté et confirmé, rediriger vers la page d'accueil
    if (user && user.email_confirmed_at) {
      window.location.href = '/';
    }
    
    // Si l'utilisateur est connecté mais pas confirmé, récupérer son email
    if (user && !user.email_confirmed_at) {
      setEmail(user.email || '');
    }
  }, [user]);

  const handleResendConfirmation = async () => {
    if (!email) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }).then(res => res.json());

      if (error) {
        setError(error.message || 'Erreur lors de l\'envoi de l\'email de confirmation');
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
          
          <div className="w-16 h-16 bg-emerald-600 dark:bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Confirmez votre email
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Un email de confirmation a été envoyé à votre adresse
          </p>
        </div>

        {/* Contenu principal */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <p className="text-green-800 dark:text-green-400 text-sm">
                Email de confirmation renvoyé avec succès !
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
              <Mail className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Vérifiez votre boîte email
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Nous avons envoyé un lien de confirmation à :
              </p>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                {email || 'votre adresse email'}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Étapes suivantes :
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left">
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">1</span>
                  Ouvrez votre boîte email
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">2</span>
                  Recherchez un email de UniversMurid
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">3</span>
                  Cliquez sur le lien de confirmation
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleResendConfirmation}
                disabled={loading || !email}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Renvoyer l'email</span>
                  </>
                )}
              </button>

              <Link href="/auth/login" className="block w-full">
                <button className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
                  Retour à la connexion
                </button>
              </Link>
            </div>

            {/* Problèmes */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Vous ne recevez pas l'email ?
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 text-left">
                <li>• Vérifiez votre dossier spam/courrier indésirable</li>
                <li>• Attendez quelques minutes, la livraison peut prendre du temps</li>
                <li>• Vérifiez que l'adresse email est correcte</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}