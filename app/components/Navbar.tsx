'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Star,
  Book,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  User,
  LogIn,
  UserPlus,
  BarChart3,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/auth/context';

// Composant pour les icônes de thème
const ThemeIcon = ({ theme, mounted }: { theme?: string; mounted: boolean }) => {
  if (!mounted) return <Monitor className="w-5 h-5" />;
  
  switch (theme) {
    case 'light':
      return <Sun className="w-5 h-5" />;
    case 'dark':
      return <Moon className="w-5 h-5" />;
    default:
      return <Monitor className="w-5 h-5" />;
  }
};

// Composant pour les items de navigation
const NavItem = ({ 
  href, 
  label, 
  isActive, 
  onClick 
}: { 
  href: string; 
  label: string; 
  isActive: boolean; 
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`relative px-4 py-3 text-base font-medium transition-all duration-200 group rounded-lg ${
      isActive
        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
        : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
    }`}
  >
    {label}
    {isActive && (
      <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300 rounded-full"></div>
    )}
  </Link>
);

// Composant pour le menu utilisateur
const UserMenuDropdown = ({ 
  user, 
  onClose, 
  onSignOut 
}: { 
  user: any; 
  onClose: () => void; 
  onSignOut: () => void;
}) => (
  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-in fade-in slide-in-from-top-2">
    <div className="p-3">
      {/* En-tête utilisateur */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {user.user_metadata?.full_name || 'Utilisateur'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {user.email}
        </p>
      </div>
      
      {/* Liens de menu */}
      <Link
        href="/stats"
        onClick={onClose}
        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors group"
      >
        <BarChart3 className="w-4 h-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
        <span>Statistiques</span>
      </Link>
      
      <button
        onClick={onSignOut}
        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors group"
      >
        <LogOut className="w-4 h-4" />
        <span>Déconnexion</span>
      </button>
    </div>
  </div>
);

// Composant pour le sélecteur de thème
const ThemeSelector = ({ theme, setTheme, mounted }: { theme?: string; setTheme: (theme: string) => void; mounted: boolean }) => {
  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Clair' },
    { value: 'dark', icon: Moon, label: 'Sombre' },
    { value: 'system', icon: Monitor, label: 'Système' },
  ];

  return (
    <div className="relative group">
      <button 
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        aria-label="Sélecteur de thème"
      >
        <ThemeIcon theme={theme} mounted={mounted} />
      </button>
      
      <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {themeOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = mounted && theme === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-sm first:rounded-t-lg last:rounded-b-lg transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{option.label}</span>
              {isSelected && <div className="ml-auto w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full"></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Composant principal
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fermer les menus en cliquant en dehors
  useEffect(() => {
    if (!isMenuOpen && !isUserMenuOpen) return;

    const handleClickOutside = () => {
      setIsMenuOpen(false);
      setIsUserMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, isUserMenuOpen]);

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/khassida', label: 'Khassida' },
    { href: '/audio', label: 'Écouter' },
    { href: '/jeux', label: 'Jeux' },
    { href: '/langues', label: 'Langues' },
    { href: '/stats', label: 'Stats' },
  ];

  const isActive = useCallback((href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }, [pathname]);

  const handleSignOut = () => {
    setIsUserMenuOpen(false);
    signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 safe-area-inset-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0 touch-manipulation">
            <div className="relative overflow-hidden rounded-xl p-1">
              <img
                src="/LogoUm.png"
                alt="Logo UniversMurid"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-active:scale-95"
              />
              <div className="absolute inset-0 bg-emerald-600 dark:bg-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300 tracking-tight">
                  Univers
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300 tracking-tight">
                  Murid
                </span>
              </div>
              <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase">
                Communauté
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={isActive(item.href)}
              />
            ))}
          </div>

          {/* Droite: Auth, Thème et Menu Mobile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* User Authentication */}
            {loading ? (
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse"></div>
            ) : user ? (
              /* User Menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-200 group touch-manipulation min-h-[48px]"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="hidden lg:block text-base font-medium text-emerald-700 dark:text-emerald-300 max-w-[120px] sm:max-w-[150px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <UserMenuDropdown 
                    user={user}
                    onClose={() => setIsUserMenuOpen(false)}
                    onSignOut={handleSignOut}
                  />
                )}
              </div>
            ) : (
              /* Auth Buttons */
              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 px-5 py-3 text-base font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 touch-manipulation min-h-[48px]"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-base font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg touch-manipulation min-h-[48px]"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>S'inscrire</span>
                </Link>
              </div>
            )}

            {/* Theme Selector */}
            {mounted && (
              <div className="touch-manipulation">
                <ThemeSelector theme={theme} setTheme={setTheme} mounted={mounted} />
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 sm:p-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Menu mobile"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden safe-area-inset-top ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pt-4 pb-6 space-y-2 bg-white dark:bg-gray-900 rounded-2xl mt-3 border border-gray-200 dark:border-gray-700 shadow-2xl">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-4 px-4 py-4 text-lg font-semibold rounded-xl transition-all duration-200 touch-manipulation min-h-[56px] ${
                  isActive(item.href)
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive(item.href) 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {item.href === '/' && <span className="text-xl">🏠</span>}
                  {item.href === '/khassida' && <span className="text-xl">📖</span>}
                  {item.href === '/audio' && <span className="text-xl">🎵</span>}
                  {item.href === '/jeux' && <span className="text-xl">🎮</span>}
                  {item.href === '/langues' && <span className="text-xl">🌍</span>}
                  {item.href === '/stats' && <span className="text-xl">📊</span>}
                </div>
                <span>{item.label}</span>
                {isActive(item.href) && (
                  <div className="ml-auto w-3 h-3 bg-emerald-500 rounded-full"></div>
                )}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            {!user && !loading && (
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-4 px-4 py-4 text-lg font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors touch-manipulation min-h-[56px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-4 px-4 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg touch-manipulation min-h-[56px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <span>S'inscrire</span>
                </Link>
              </div>
            )}

            {/* Mobile User Menu */}
            {user && (
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="px-4 py-3 mb-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {user.user_metadata?.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                    {user.email}
                  </p>
                </div>
                
                <Link
                  href="/stats"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-4 px-4 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors touch-manipulation min-h-[56px] mb-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span>Statistiques</span>
                </Link>
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center space-x-4 px-4 py-4 text-lg font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors touch-manipulation min-h-[56px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}