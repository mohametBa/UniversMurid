'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function JeuxPage() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStartGame = () => {
    setIsAnimating(true);
    setTimeout(() => {
      router.push('/jeux/jouer');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br mt-12 from-slate-900 via-emerald-950 to-teal-900 pt-16 pb-20 relative overflow-hidden">
      {/* Fond animé subtil */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-1/4 left-1/4 text-[15rem] font-arabic text-emerald-300/20"
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.03, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          بِسْمِ ٱللَّٰهِ
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header compact */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-3">
            Le Sentier de la <span className="text-yellow-400">Khidma</span>
          </h1>
          <p className="text-lg text-gray-300">
            Travail • Service • Savoir
          </p>
        </motion.div>

        {/* Card principale - design moderne glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-900/40 via-teal-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-2xl p-6 sm:p-8 mb-6"
        >
          {/* Les 3 Piliers - Grid compact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { 
                icon: "💰", 
                title: "Faaïda", 
                color: "from-yellow-500 to-amber-600",
                border: "border-yellow-500/30",
                desc: "Monnaie du Dahir"
              },
              { 
                icon: "✨", 
                title: "Baraka", 
                color: "from-emerald-500 to-teal-600",
                border: "border-emerald-500/30",
                desc: "Mérite spirituel"
              },
              { 
                icon: "🧠", 
                title: "L'Éveil", 
                color: "from-cyan-500 to-blue-600",
                border: "border-cyan-500/30",
                desc: "Savoir mouride"
              }
            ].map((pilier, index) => (
              <motion.div
                key={pilier.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${pilier.color} p-5 rounded-2xl border ${pilier.border} shadow-lg backdrop-blur-sm`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{pilier.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{pilier.title}</h3>
                  <p className="text-xs text-white/80">{pilier.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Règle d'or - Compact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-md rounded-xl p-4 border border-yellow-500/30 mb-6"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <h4 className="text-lg font-bold text-yellow-300 mb-1">Règle d'Or</h4>
                <p className="text-sm text-gray-200">
                  Tout progrès nécessite <span className="text-emerald-300 font-semibold">Baraka</span> + <span className="text-cyan-300 font-semibold">Éveil</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Règles - Accordéon style */}
          <div className="space-y-3 mb-6">
            {[
              { icon: "1️⃣", title: "Travail", color: "yellow", desc: "Cultive et gagne de la Faaïda" },
              { icon: "2️⃣", title: "Khidma", color: "emerald", desc: "Service pour gagner la Baraka" },
              { icon: "3️⃣", title: "Quizz", color: "cyan", desc: "Apprends pour obtenir l'Éveil" }
            ].map((rule, index) => (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{rule.icon}</span>
                  <div className="flex-1">
                    <span className={`font-bold text-${rule.color}-300`}>{rule.title}</span>
                    <span className="text-gray-300 text-sm ml-2">→ {rule.desc}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bouton CTA moderne */}
          <motion.button
            onClick={handleStartGame}
            disabled={isAnimating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative overflow-hidden px-8 py-5 bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-600 hover:from-yellow-600 hover:via-amber-700 hover:to-orange-700 text-white font-bold text-xl rounded-2xl shadow-xl border-2 border-yellow-400/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/10 blur-xl"></div>
            
            <div className="relative flex items-center justify-center gap-3">
              {isAnimating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Chargement...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🎮</span>
                  <span>COMMENCER LE SENTIER</span>
                  <span className="text-2xl">⚡</span>
                </>
              )}
            </div>
          </motion.button>
        </motion.div>

        {/* Contribution Touba - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-yellow-600/20 via-amber-600/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30"
        >
          <div className="flex items-center gap-6">
            <div className="text-5xl">🕋</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-yellow-300 mb-2">
                Niveau Murid
              </h3>
              <div className="flex items-center gap-4 text-lg font-semibold mb-2">
                <span className="text-emerald-300">✨ 10K Baraka</span>
                <span className="text-yellow-400">→</span>
                <span className="text-yellow-200">💰 1K FCFA</span>
              </div>
              <p className="text-xs text-gray-300 italic">
                Convertis ta Baraka en don réel pour Touba
              </p>
            </div>
          </div>
        </motion.div>

        {/* Citation footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6 text-sm text-gray-400 italic"
        >
          « Jàmm ak jamm, jàmm ak jamm » — Serigne Touba (QSS)
        </motion.p>
      </div>
    </div>
  );
}