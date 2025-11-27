'use client';

import Link from 'next/link';
import { Star, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const socialStats = [
    { platform: 'Facebook', followers: '15K', icon: Facebook, color: 'hover:text-blue-600' },
    { platform: 'Instagram', followers: '22K', icon: Instagram, color: 'hover:text-pink-600' },
    { platform: 'YouTube', followers: '35K', icon: Youtube, color: 'hover:text-red-600' },
    { platform: 'Twitter', followers: '8K', icon: Twitter, color: 'hover:text-sky-600' }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start space-x-3 group mb-4">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="/LogoUm.png"
                  alt="Logo UM"
                  className="w-10 h-10 object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-active:scale-95"
                />
                <div className="absolute inset-0 bg-emerald-600 dark:bg-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-400 dark:group-hover:border-emerald-500 rounded-lg transition-all duration-300"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300 tracking-wide">
                    Univers
                  </span>
                  <span className="text-xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300 tracking-wide">
                    Murid
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-gray-400 dark:text-gray-300 mb-4">
              Préserver et partager l'héritage spirituel de Cheikh Ahmadou Bamba à travers le monde numérique.
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-4">
              {socialStats.slice(0, 4).map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors duration-200 hover:scale-110 transform"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <div className="space-y-2">
              <Link href="/khassida" className="block text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors">
                Khassida
              </Link>
              <Link href="/audio" className="block text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors">
                Audio
              </Link>
              <Link href="/langues" className="block text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors">
                Langues
              </Link>
              <Link href="/partager" className="block text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors">
                Partager
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400 dark:text-gray-300">
              <p>eluniversomurid@gmail.com</p>
              <p>+33 644 76 12 08</p>
              <p>+221 75 635 13 13</p>
              <p>75001 Paris</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-800 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              © 2025 UniversMurid. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-white dark:hover:text-white transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="hover:text-white dark:hover:text-white transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="hover:text-white dark:hover:text-white transition-colors">
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}