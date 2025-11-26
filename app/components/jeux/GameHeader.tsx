'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface GameHeaderProps {
  title: string;
  description?: string;
  backUrl?: string;
  className?: string;
}

export default function GameHeader({ 
  title, 
  description, 
  backUrl = '/jeux', 
  className = '' 
}: GameHeaderProps) {
  return (
    <div className={`bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center">
          <Link 
            href={backUrl}
            className="flex items-center text-orange-400 hover:text-orange-300 transition-colors mr-6 group"
          >
            <ArrowLeft className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour aux jeux</span>
          </Link>
          
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {title}
            </h1>
            {description && (
              <p className="text-slate-300 mt-2 text-lg">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}