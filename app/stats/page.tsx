'use client';

import { useAuth } from '@/lib/auth/context';
import { usePlayerStats } from '@/lib/hooks/usePlayerStats';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award, 
  Users, 
  BookOpen,
  Star,
  Activity,
  BarChart3,
  Brain,
  Heart
} from 'lucide-react';

export default function StatsPage() {
  const { user } = useAuth();
  const { stats, globalStats, leaderboard, loading, error } = usePlayerStats(user);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            UniversMurid
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-8">
            La plateforme éducative et spirituelle qui preserve et transmet l'héritage 
            de Cheikh Ahmadou Bamba et la tradition mouride
          </p>
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 max-w-4xl mx-auto">
            <p className="text-lg text-gray-800 dark:text-gray-200 italic">
              "L'éducation et le service communautaire sont les piliers fondamentaux 
              du développement humain et spirituel"
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              - Principe central d'UniversMurid
            </p>
          </div>
        </div>

        {/* Nos Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Nos Services & Activités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Apprentissage */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Apprentissage
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Quiz interactifs sur la vie du Cheikh, les Khassaïdes, et l'histoire mouride
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Questions sur Cheikh Ahmadou Bamba</li>
                <li>• Khassaïdes et poésie mystique</li>
                <li>• Histoire du mouvement mouride</li>
              </ul>
            </div>

            {/* Khidma System */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Système de Khidma
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Simulez et apprenez les différentes formes de service communautaire
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Aide à la Daara</li>
                <li>• Entretien des mosquées</li>
                <li>• Travaux communautaires</li>
              </ul>
            </div>

            {/* Agriculture */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Agriculture
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Gestion agricole basée sur les traditions du Dahir et du travail de la terre
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Culture d'arachide</li>
                <li>• Gestion des outils</li>
                <li>• Cycle des saisons</li>
              </ul>
            </div>

            {/* Ressources Spirituelles */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Ressources Audio
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Khassaïdes audio et textes en plusieurs langues pour l'approfondissement spirituel
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Khassaïdes audio</li>
                <li>• Lectures en arabe</li>
                <li>• Traductions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notre Mission */}
        <div className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Notre Mission
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                Préserver et transmettre l'héritage spirituel et culturel de Cheikh Ahmadou Bamba 
                à travers une approche moderne et interactive
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Éducation Spirituelle
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Apprentissage interactif des enseignements du Cheikh et de la tradition mouride
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Communauté
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Rassembler les mourides autour d'outils modernes de partage et d'apprentissage
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Service (Khidma)
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Promouvoir l'esprit de service désintéressé et l'entraide communautaire
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques du Projet */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Impact & Engagement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center">
              <div className="text-4xl font-bold mb-2">15K+</div>
              <div className="text-blue-100">Utilisateurs actifs</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Quiz complétés</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-purple-100">Questions spirituelles</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-orange-100">Accès libre</div>
            </div>
          </div>
        </div>

        {/* Appels à l'action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Rejoignez l'aventure UniversMurid
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
              Commencez votre parcours spirituel et éducatif dès aujourd'hui. 
              Découvrez, apprenez et grandissez avec notre communauté.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-amber-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Commencer maintenant
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-amber-600 transition-colors">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}