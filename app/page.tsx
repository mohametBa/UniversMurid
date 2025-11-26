'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Book,
  Headphones,
  Globe,
  Share2,
  Facebook,
  Instagram,
  Youtube,
  Video,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Footer from './components/Footer';
import serigne from '../public/Serigne.png';
import Image from 'next/image';

export default function Page() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Book className="w-8 h-8" />,
      title: "Lire les Khassida",
      description: "Accédez à une collection complète des œuvres de Cheikh Ahmadou Bamba",
      link: "/khassida",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Écouter",
      description: "Écoutez les récitations des Khassidas et Podcast",
      link: "/audio",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multilingue",
      description: "Disponible en arabe, français, wolof et autres langues pour toucher tous les cœurs",
      link: "/langues",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Partager",
      description: "Partagez la lumière des enseignements avec votre communauté et le monde entier",
      link: "/partager",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const socialStats = [
    { platform: 'Facebook', followers: '10K', icon: Facebook, color: 'hover:text-blue-600', url: 'https://www.facebook.com/share/17AHiBumoA/?mibextid=wwXIfr' },
    { platform: 'Instagram', followers: '40,6K', icon: Instagram, color: 'hover:text-pink-600', url: 'https://www.instagram.com/universmurid?igsh=dWd3OTQ2Ym01YXlx&utm_source=qr' },
    { platform: 'YouTube', followers: '628', icon: Youtube, color: 'hover:text-red-600', url: 'https://youtube.com/@universmurid?si=LKxuAs1evuxcb-Xr' },
    { platform: 'TikTok', followers: '22,9K', icon: Video, color: 'hover:text-black', url: 'https://www.tiktok.com/@univers_murid?_r=1&_t=ZN-91Mb874G0uc' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-4 py-2 rounded-full text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Bienvenue dans UniversMurid</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Les Œuvres de
                <span className="text-emerald-600 dark:text-emerald-400 block mt-2">Cheikh Ahmadou Bamba</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                Découvrez, lisez et écoutez les Khassida et enseignements du vénéré Cheikh Ahmadou Bamba Mbacké.
                Une bibliothèque spirituelle moderne à portée de main.
              </p>

              {/* Quote */}
              <div className="bg-white dark:bg-gray-800 border-l-4 border-emerald-600 dark:border-emerald-400 p-6 rounded-r-lg shadow-lg">
                <p className="text-gray-700 dark:text-gray-300 italic mb-2 text-lg">
                  "Le savoir est une lumière que Dieu projette dans le cœur"
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">- Cheikh Ahmadou Bamba</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start w-full sm:w-auto">
                <Link href="/khassida" className="group w-full sm:w-auto max-w-xs sm:max-w-none">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                    <span>Explorer les Khassida</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto max-w-xs sm:max-w-none">
                  <button className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-emerald-600 dark:text-emerald-400 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-emerald-600 dark:border-emerald-400 transform hover:scale-105 transition-all duration-200">
                    En savoir plus
                  </button>
                </Link>
              </div>

              {/* Social Stats */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rejoignez-nous:</span>
                {socialStats.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-500 dark:text-gray-400 ${social.color} transition-colors duration-200 hover:scale-110 transform`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Image Section */}
            <div className="relative flex items-center justify-center">
              <Image
                src={serigne}
                alt="Cheikh Ahmadou Bamba"
                className="relative z-10 w-full max-h-[500px] object-contain rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>

{/* Features Section */}
<section className="py-20 bg-white dark:bg-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Notre Plateforme
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        Une expérience complète pour explorer et partager les enseignements de Cheikh Ahmadou Bamba
      </p>
    </div>

    {/* Features Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
      {features.map((feature, index) => (
        <Link key={index} href={feature.link}>
          <div
            onMouseEnter={() => setActiveFeature(index)}
            onMouseLeave={() => setActiveFeature(null)}
            className={`
              group relative rounded-3xl border border-gray-100 dark:border-gray-700 p-10 
              bg-gradient-to-br transition-all duration-500 cursor-pointer
              min-h-[320px] flex flex-col justify-between
              hover:-translate-y-2 hover:rotate-[1deg] hover:shadow-2xl
              ${
                activeFeature === index 
                  ? `${feature.gradient} text-white scale-110 shadow-3xl` 
                  : 'from-gray-50 to-white dark:from-gray-700 dark:to-gray-900 text-gray-900 dark:text-white'
              }
            `}
          >

            {/* Glow Animation */}
            <div className="
              absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 
              transition-all duration-500 blur-xl
              bg-emerald-400/20 dark:bg-emerald-500/20 pointer-events-none
            " />

            {/* Icon */}
            <div className={`
              text-4xl mb-6 transition-transform duration-500
              ${
                activeFeature === index 
                  ? "text-white scale-125" 
                  : "text-emerald-600 dark:text-emerald-400 group-hover:scale-125"
              }
            `}>
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>

            {/* Description */}
            <p className={`
              transition-colors duration-500 
              ${activeFeature === index ? "text-white/90" : "text-gray-600 dark:text-gray-300"}
            `}>
              {feature.description}
            </p>

            {/* Explore */}
            <div className="mt-6 flex items-center text-sm font-medium group-hover:opacity-100 transition-all opacity-80">
              <span>Explorer</span>
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-500" />
            </div>
          </div>
        </Link>
      ))}
    </div>

    
    {/* Social Media & Community Section */}
    <div className="mt-16 bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-700 dark:to-green-700 rounded-3xl p-12 text-white text-center shadow-2xl">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-4">
          Rejoignez Notre Communauté UniversMurid
        </h3>
        <p className="text-xl mb-8 text-emerald-50">
          Connectez-vous avec des milliers de fidèles à travers le monde et partagez votre amour pour les enseignements
        </p>

        {/* Social Media Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {socialStats.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold">{social.followers}</div>
                <div className="text-sm text-emerald-100">{social.platform}</div>
              </a>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
          <Link href="/contact" className="w-full sm:w-auto max-w-xs sm:max-w-none">
            <button className="w-full bg-white text-emerald-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-emerald-50 transform hover:scale-105 transition shadow-lg">
              Commencer Maintenant
            </button>
          </Link>
          <Link href="/partager" className="w-full sm:w-auto max-w-xs sm:max-w-none">
            <button className="w-full bg-emerald-800 dark:bg-emerald-900 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-emerald-900 dark:hover:bg-emerald-950 transform hover:scale-105 transition shadow-lg">
              Partager
            </button>
          </Link>
        </div>
      </div>
    </div>

  </div>
</section>


      <Footer />
    </div>
  );
}
