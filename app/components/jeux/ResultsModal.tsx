'use client';

import { Trophy, Star, Clock, Target, RotateCcw, Share2 } from 'lucide-react';
import Link from 'next/link';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: 'quiz' | 'memory' | 'flashcard';
  score: number;
  maxScore: number;
  timeSpent: number;
  questionsAnswered?: number;
  correctAnswers?: number;
  achievements?: string[];
  newHighScore?: boolean;
}

export default function ResultsModal({
  isOpen,
  onClose,
  gameType,
  score,
  maxScore,
  timeSpent,
  questionsAnswered,
  correctAnswers,
  achievements = [],
  newHighScore = false
}: ResultsModalProps) {
  if (!isOpen) return null;

  const scorePercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const accuracy = questionsAnswered && correctAnswers ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-400', emoji: '🏆' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-400', emoji: '🥇' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-400', emoji: '🥈' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-400', emoji: '🥉' };
    return { grade: 'D', color: 'text-red-400', emoji: '📚' };
  };

  const grade = getGrade(accuracy);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        <div className="p-8">
          {/* Header avec animation */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">{grade.emoji}</div>
            <h2 className="text-4xl font-bold text-white mb-2">
              {newHighScore ? '🎉 Nouveau Record !' : 'Partie terminée !'}
            </h2>
            <p className="text-slate-300 text-lg">
              {gameType === 'quiz' && 'Quiz Mode'}
              {gameType === 'memory' && 'Jeu de Mémoire'}
              {gameType === 'flashcard' && 'Flashcards'}
            </p>
          </div>

          {/* Score principal */}
          <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl p-6 mb-8 text-center">
            <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text mb-2">
              {score}
            </div>
            <div className="text-xl text-slate-300">
              points sur {maxScore > 0 ? maxScore : score}
            </div>
            <div className="text-lg text-slate-400">
              {scorePercentage}% de réussite
            </div>
            <div className={`text-2xl font-bold mt-2 ${grade.color}`}>
              Note: {grade.grade}
            </div>
          </div>

          {/* Stats détaillées */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center">
              <Target className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-slate-400 text-sm">Score</div>
            </div>

            <div className="text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{timeSpent}s</div>
              <div className="text-slate-400 text-sm">Temps</div>
            </div>

            {questionsAnswered !== undefined && (
              <div className="text-center">
                <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{correctAnswers}/{questionsAnswered}</div>
                <div className="text-slate-400 text-sm">Réponses</div>
              </div>
            )}

            <div className="text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{accuracy}%</div>
              <div className="text-slate-400 text-sm">Précision</div>
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 text-center">🏅 Réussites</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {achievements.map((achievement, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 px-4 py-2 rounded-full border border-yellow-500/30"
                  >
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/jeux" className="flex-1">
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                Retour aux jeux
              </button>
            </Link>
            
            <button 
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              Rejouer
            </button>
          </div>

          {/* Partage */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <button className="w-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Share2 className="w-5 h-5 mr-2" />
              <span>Partager votre score</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}