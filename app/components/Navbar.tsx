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
    className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 group ${
      isActive
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
    }`}
  >
    {label}
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300 rounded-full"></div>
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
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/LogoUm.png"
                alt="Logo UniversMurid"
                className="w-10 h-10 object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-active:scale-95"
              />
              <div className="absolute inset-0 bg-emerald-600 dark:bg-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300 tracking-tight">
                  Univers
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300 tracking-tight">
                  Murid
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase">
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
          <div className="flex items-center space-x-3">
            {/* User Authentication */}
            {loading ? (
              <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
            ) : user ? (
              /* User Menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-emerald-700 dark:text-emerald-300 max-w-[150px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
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
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>S'inscrire</span>
                </Link>
              </div>
            )}

            {/* Theme Selector */}
            {mounted && <ThemeSelector theme={theme} setTheme={setTheme} mounted={mounted} />}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Menu mobile"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-900 rounded-lg mt-2 border border-gray-200 dark:border-gray-700">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={isActive(item.href)}
                onClick={() => setIsMenuOpen(false)}
              />
            ))}

            {/* Mobile Auth Buttons */}
            {!user && !loading && (
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-medium rounded-md transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>S'inscrire</span>
                </Link>
              </div>
            )}

            {/* Mobile User Menu */}
            {user && (
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="px-3 py-2 mb-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.user_metadata?.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
                
                <Link
                  href="/stats"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Statistiques</span>
                </Link>
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  <LogOut className="w-5 h-5" />
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