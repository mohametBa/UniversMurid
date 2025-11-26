'use client';

import { Trophy, Target, Clock, Star, Zap } from 'lucide-react';

interface ScoreBoardProps {
  currentScore: number;
  maxScore: number;
  timeLeft?: number;
  streak?: number;
  questionNumber?: number;
  totalQuestions?: number;
  className?: string;
}

export default function ScoreBoard({
  currentScore,
  maxScore,
  timeLeft,
  streak = 0,
  questionNumber,
  totalQuestions,
  className = ''
}: ScoreBoardProps) {
  const scorePercentage = Math.min((currentScore / maxScore) * 100, 100);

  return (
    <div className={`bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Score actuel */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-orange-400 mr-2" />
            <span className="text-slate-400 text-sm">Score</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {currentScore}
            {maxScore > 0 && (
              <span className="text-lg text-slate-400">/{maxScore}</span>
            )}
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>

        {/* Temps restant */}
        {timeLeft !== undefined && (
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-slate-400 text-sm">Temps</span>
            </div>
            <div className={`text-2xl font-bold ${timeLeft < 30 ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}s
            </div>
          </div>
        )}

        {/* Streak */}
        {streak > 0 && (
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-slate-400 text-sm">Streak</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {streak}
            </div>
          </div>
        )}

        {/* Progression */}
        {questionNumber && totalQuestions && (
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-slate-400 text-sm">Question</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {questionNumber}
              <span className="text-lg text-slate-400">/{totalQuestions}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}