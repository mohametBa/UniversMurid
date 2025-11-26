"use client"

import React from "react"

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Gradient de base avec transitions fluides */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-transparent to-transparent dark:from-yellow-900/5 dark:via-transparent dark:to-transparent transition-colors duration-500"></div>

      {/* Effets d'étincelles - couleurs adaptées au thème */}
      <div className="absolute inset-0">
        {/* Grandes étincelles */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-gradient-to-br from-yellow-300 to-yellow-400 dark:from-yellow-500 dark:to-yellow-600 rounded-full opacity-20 dark:opacity-15 animate-pulse blur-sm"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-gradient-to-br from-amber-300 to-yellow-400 dark:from-amber-500 dark:to-yellow-500 rounded-full opacity-30 dark:opacity-20 animate-ping blur-sm"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-yellow-300 dark:bg-yellow-500 rounded-full opacity-40 dark:opacity-25 animate-bounce blur-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-5 h-5 bg-gradient-to-br from-yellow-200 to-yellow-300 dark:from-yellow-600 dark:to-amber-600 rounded-full opacity-25 dark:opacity-15 animate-pulse blur-md delay-300"></div>
        <div className="absolute bottom-1/3 right-1/2 w-3 h-3 bg-amber-300 dark:bg-amber-500 rounded-full opacity-35 dark:opacity-20 animate-ping blur-sm delay-500"></div>
      </div>

      {/* Lignes scintillantes avec gradient adaptatif */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-px bg-gradient-to-r from-transparent via-yellow-300 dark:via-yellow-600 to-transparent opacity-30 dark:opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-16 w-16 h-px bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-600 to-transparent opacity-40 dark:opacity-25 animate-pulse delay-200"></div>
        <div className="absolute bottom-20 left-20 w-24 h-px bg-gradient-to-r from-transparent via-yellow-300 dark:via-yellow-600 to-transparent opacity-25 dark:opacity-15 animate-pulse delay-700"></div>
        <div className="absolute bottom-10 right-12 w-20 h-px bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-600 to-transparent opacity-35 dark:opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Particules flottantes - distribution optimisée */}
      <div className="absolute inset-0">
        <div className="absolute top-1/6 left-1/6 w-1 h-1 bg-yellow-400 dark:bg-yellow-500 rounded-full opacity-60 dark:opacity-40 animate-ping blur-sm delay-100"></div>
        <div className="absolute top-1/3 right-1/6 w-2 h-2 bg-amber-300 dark:bg-amber-600 rounded-full opacity-40 dark:opacity-25 animate-bounce blur-sm delay-400"></div>
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-yellow-300 dark:bg-yellow-500 rounded-full opacity-50 dark:opacity-30 animate-pulse blur-sm delay-200"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-yellow-400 dark:bg-yellow-600 rounded-full opacity-70 dark:opacity-40 animate-ping blur-sm delay-600"></div>
        <div className="absolute bottom-1/6 left-1/2 w-1.5 h-1.5 bg-amber-300 dark:bg-amber-500 rounded-full opacity-30 dark:opacity-20 animate-bounce blur-sm delay-800"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-yellow-300 dark:bg-yellow-500 rounded-full opacity-60 dark:opacity-35 animate-pulse blur-sm delay-300"></div>
      </div>

      {/* Effets d'orbes lumineux - plus discrets */}
      <div className="absolute top-1/4 left-1/5 w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-400 dark:from-yellow-700 dark:to-amber-700 rounded-full opacity-8 dark:opacity-5 animate-pulse blur-xl delay-500"></div>
      <div className="absolute bottom-1/4 right-1/5 w-8 h-8 bg-gradient-to-br from-amber-300 to-yellow-300 dark:from-amber-700 dark:to-yellow-700 rounded-full opacity-10 dark:opacity-5 animate-ping blur-xl delay-800"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-200 to-amber-200 dark:from-yellow-900 dark:to-amber-900 rounded-full opacity-6 dark:opacity-3 animate-pulse blur-2xl delay-1200"></div>
    </div>
  )
}