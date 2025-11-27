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
  ChevronDown,
  Home,
  Music,
  Gamepad2,
  Globe,
  BookOpen
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/auth/context';

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

const NavItem = ({ 
  href, 
  label, 
  icon: Icon,
  isActive, 
  onClick,
  isMobile = false
}: { 
  href: string; 
  label: string;
  icon?: React.ReactNode;
  isActive: boolean; 
  onClick?: () => void;
  isMobile?: boolean;
}) => {
  if (isMobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 dark:from-emerald-400/20 dark:to-teal-400/20 text-emerald-600 dark:text-emerald-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/5'
        }`}
      >
        <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
          {Icon}
        </div>
        <span className="font-medium">{label}</span>
        {isActive && <div className="ml-auto w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse" />}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative px-4 py-2.5 text-sm font-semibold transition-all duration-300 group rounded-lg ${
        isActive
          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10 backdrop-blur-sm'
          : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/40 dark:hover:bg-white/5 backdrop-blur-sm'
      }`}
    >
      {label}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-8 bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300 rounded-full"></div>
      )}
    </Link>
  );
};

const UserMenuDropdown = ({ 
  user, 
  onClose, 
  onSignOut 
}: { 
  user: any; 
  onClose: () => void; 
  onSignOut: () => void;
}) => (
  <div className="absolute right-0 top-full mt-3 w-56 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
    <div className="p-4 space-y-2">
      {/* En-tête utilisateur */}
      <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10 border border-emerald-500/20 dark:border-emerald-400/20 mb-3">
        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
          {user.user_metadata?.full_name || 'Utilisateur'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
          {user.email}
        </p>
      </div>
      
      {/* Liens de menu */}
      <Link
        href="/stats"
        onClick={onClose}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-500/20 dark:hover:bg-emerald-400/10 rounded-lg transition-all duration-200 group font-medium"
      >
        <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
        <span>Statistiques</span>
      </Link>
      
      <button
        onClick={onSignOut}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-400/10 rounded-lg transition-all duration-200 group font-medium"
      >
        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span>Déconnexion</span>
      </button>
    </div>
  </div>
);

const ThemeSelector = ({ theme, setTheme, mounted }: { theme?: string; setTheme: (theme: string) => void; mounted: boolean }) => {
  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Clair' },
    { value: 'dark', icon: Moon, label: 'Sombre' },
    { value: 'system', icon: Monitor, label: 'Système' },
  ];

  return (
    <div className="relative group">
      <button 
        className="p-2.5 rounded-lg bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 group-hover:shadow-lg"
        aria-label="Sélecteur de thème"
      >
        <ThemeIcon theme={theme} mounted={mounted} />
      </button>
      
      <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="p-2 space-y-1">
          {themeOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = mounted && theme === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 font-medium ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 dark:from-emerald-400/20 dark:to-teal-400/20 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30 dark:border-emerald-400/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{option.label}</span>
                {isSelected && <div className="ml-auto w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-pulse"></div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Détection du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    { href: '/', label: 'Accueil', icon: <Home className="w-4 h-4" /> },
    { href: '/khassida', label: 'Khassida', icon: <BookOpen className="w-4 h-4" /> },
    { href: '/audio', label: 'Écouter', icon: <Music className="w-4 h-4" /> },
    { href: '/jeux', label: 'Jeux', icon: <Gamepad2 className="w-4 h-4" /> },
    { href: '/langues', label: 'Langues', icon: <Globe className="w-4 h-4" /> },
    { href: '/stats', label: 'Stats', icon: <BarChart3 className="w-4 h-4" /> },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-inset-top ${
      isScrolled 
        ? 'bg-white/70 dark:bg-gray-900/70 shadow-lg' 
        : 'bg-white/40 dark:bg-gray-900/40'
    } backdrop-blur-2xl border-b border-white/20 dark:border-white/5`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 touch-manipulation min-h-[48px]">
            <div className="relative overflow-hidden rounded-xl p-1 group-hover:shadow-lg transition-all duration-300">
              <img
                src="/LogoUm.png"
                alt="Logo UniversMurid"
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain transition-all duration-300 group-hover:scale-110 group-active:scale-95"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
            </div>
            <div className="flex flex-col justify-center hidden sm:block">
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300 tracking-tight">
                  Univers
                </span>
                <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300 tracking-tight">
                  Murid
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Authentication */}
            {loading ? (
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-700 dark:to-teal-700 rounded-lg animate-pulse"></div>
            ) : user ? (
              /* User Menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 transition-all duration-300 group touch-manipulation min-h-[48px] hover:shadow-lg"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-bold text-emerald-700 dark:text-emerald-300 max-w-[140px] truncate">
                    {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
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
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all rounded-lg hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 backdrop-blur-md border border-transparent hover:border-emerald-400/30 dark:hover:border-emerald-400/30 touch-manipulation min-h-[48px]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-400/20 backdrop-blur-md border border-emerald-400/20 touch-manipulation min-h-[48px] group hover:scale-105"
                >
                  <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
              className="lg:hidden p-2.5 rounded-lg bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 transition-all duration-300 touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center hover:shadow-lg"
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
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden safe-area-inset-top ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-3 pt-3 pb-6 space-y-1.5 bg-gradient-to-b from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl mt-2 border border-white/20 dark:border-white/10 shadow-2xl">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={isActive(item.href)}
                onClick={() => setIsMenuOpen(false)}
                isMobile
              />
            ))}

            {/* Mobile Auth Buttons */}
            {!user && !loading && (
              <div className="pt-3 mt-4 border-t border-white/20 dark:border-white/10 space-y-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 dark:hover:bg-emerald-400/10 rounded-lg transition-all touch-manipulation min-h-[48px] border border-emerald-400/30 dark:border-emerald-400/30 backdrop-blur-md"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-semibold rounded-lg transition-all shadow-lg backdrop-blur-md border border-emerald-400/20 touch-manipulation min-h-[48px] group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <span>S'inscrire</span>
                </Link>
              </div>
            )}

            {/* Mobile User Menu */}
            {user && (
              <div className="pt-3 mt-4 border-t border-white/20 dark:border-white/10 space-y-2">
                <div className="px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10 rounded-lg border border-emerald-400/20 dark:border-emerald-400/20 backdrop-blur-md">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {user.user_metadata?.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                    {user.email}
                  </p>
                </div>
                
                <Link
                  href="/stats"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-500/20 dark:hover:bg-emerald-400/10 rounded-lg transition-all touch-manipulation min-h-[48px] backdrop-blur-md"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <span>Statistiques</span>
                </Link>
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-400/10 rounded-lg transition-all touch-manipulation min-h-[48px] backdrop-blur-md"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <LogOut className="w-4 h-4" />
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