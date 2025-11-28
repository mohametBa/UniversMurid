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
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import serigne from '../public/Serigne.png';
import Image from 'next/image';
import { features, socialStats } from './data/homepageData';

export default function Page() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  // Mapping des icônes pour les features
  const getFeatureIcon = (iconName: string) => {
    const icons = {
      Book: <Book className="w-8 h-8" />,
      Headphones: <Headphones className="w-8 h-8" />,
      Globe: <Globe className="w-8 h-8" />,
      Share2: <Share2 className="w-8 h-8" />
    };
    return icons[iconName as keyof typeof icons] || <Book className="w-8 h-8" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900">
      {/* Fond calligraphique */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 text-[15rem] font-arabic text-emerald-300/20"
          animate={{ opacity: [0.2, 0.4, 0.2], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        >
          بِسْمِ ٱللَّٰهِ
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 text-[12rem] font-arabic text-teal-300/20"
          animate={{ opacity: [0.2, 0.4, 0.2], rotate: [0, -3, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
        >
          الحمد لله
        </motion.div>
      </div>

      {/* Hero Section */}
      {/* Hero Section */}
{/* Hero Section */}
<section className="relative overflow-hidden pt-10">
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
    {/* Mobile Layout - Overlaid */}
    <div className="lg:hidden relative h-screen flex items-center justify-center">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <motion.div
          className="absolute top-1/4 left-1/4 text-[8rem] md:text-[10rem] font-arabic text-emerald-300/20"
          animate={{ opacity: [0.2, 0.4, 0.2], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        >
          بِسْمِ ٱللَّٰهِ
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 text-[6rem] md:text-[8rem] font-arabic text-teal-300/20"
          animate={{ opacity: [0.2, 0.4, 0.2], rotate: [0, -3, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
        >
          الحمد لله
        </motion.div>
      </div>

      {/* Image Layer - Behind */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <div className="w-full h-full">
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-2xl animate-pulse"></div>
          <Image
            src={serigne}
            alt="Cheikh Ahmadou Bamba"
            className="relative w-full h-full object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* Text Layer - On Top */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-20 w-full px-4 py-8 space-y-6 text-center flex flex-col justify-center items-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30"
        >
          <Sparkles className="w-3 h-3" />
          <span>UniversMurid</span>
        </motion.div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg">
          Les Œuvres de
          <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Cheikh Ahmadou Bamba
          </span>
        </h1>
        
        <p className="text-sm sm:text-base text-gray-100 leading-relaxed drop-shadow-md max-w-xs">
          Découvrez les Khassida et enseignements du vénéré Cheikh Ahmadou Bamba Mbacké.
        </p>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/60 backdrop-blur-xl border-l-4 border-yellow-500 p-4 rounded-r-xl text-sm sm:text-base max-w-xs"
        >
          <p className="text-gray-100 italic mb-2">
            "Le savoir est une lumière que Dieu projette dans le cœur"
          </p>
          <p className="text-xs sm:text-sm text-yellow-300 font-semibold">— Cheikh Ahmadou Bamba</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 w-full max-w-xs"
        >
          <Link href="/khassida" className="w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-lg font-semibold text-base shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <span>Explorer les Khassida</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <Link href="/contact" className="w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold text-base border-2 border-white/20"
            >
              En savoir plus
            </motion.button>
          </Link>
        </motion.div>

        {/* Social Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-4 pt-4"
        >
          {socialStats.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className={`${social.color} transition-colors duration-200 drop-shadow-lg`}
              >
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.a>
            );
          })}
        </motion.div>
      </motion.div>
    </div>

    {/* Desktop Layout - Original Grid */}
    <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center lg:text-left space-y-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-500/30"
        >
          <Sparkles className="w-4 h-4" />
          <span>Bienvenue dans UniversMurid</span>
        </motion.div>
        
        <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
          Les Œuvres de
          <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Cheikh Ahmadou Bamba
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed">
          Découvrez, lisez et écoutez les Khassida et enseignements du vénéré Cheikh Ahmadou Bamba Mbacké.
          Une bibliothèque spirituelle moderne à portée de main.
        </p>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/40 backdrop-blur-xl border-l-4 border-yellow-500 p-6 rounded-r-2xl shadow-2xl"
        >
          <p className="text-gray-200 italic mb-2 text-lg">
            "Le savoir est une lumière que Dieu projette dans le cœur"
          </p>
          <p className="text-sm text-yellow-400 font-semibold">— Cheikh Ahmadou Bamba</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/khassida" className="group flex-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <span>Explorer les Khassida</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          <Link href="/contact" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/20"
            >
              En savoir plus
            </motion.button>
          </Link>
        </motion.div>

        {/* Social Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center lg:justify-start gap-6 pt-4"
        >
          <span className="text-sm text-gray-400">Rejoignez-nous:</span>
          {socialStats.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                className={`${social.color} transition-colors duration-200`}
              >
                <IconComponent className="w-5 h-5" />
              </motion.a>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Right Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative flex items-center justify-center"
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-3xl blur-3xl animate-pulse"></div>
          <Image
            src={serigne}
            alt="Cheikh Ahmadou Bamba"
            className="relative z-10 w-full max-h-[500px] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      </motion.div>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Notre Plateforme
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Une expérience complète pour explorer et partager les enseignements de Cheikh Ahmadou Bamba
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={feature.link}>
                  <motion.div
                    onHoverStart={() => setActiveFeature(index)}
                    onHoverEnd={() => setActiveFeature(null)}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className={`
                      relative rounded-2xl p-6 h-full
                      bg-gradient-to-br backdrop-blur-xl
                      border transition-all duration-500 cursor-pointer
                      ${activeFeature === index
                        ? `${feature.gradient} border-white/20 shadow-2xl`
                        : 'from-black/40 to-gray-900/40 border-gray-700/50 hover:border-gray-600/50'
                      }
                    `}
                  >
                    {/* Glow effect */}
                    {activeFeature === index && (
                      <motion.div
                        layoutId="featureGlow"
                        className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                        style={{
                          background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))`
                        }}
                      />
                    )}

                    <div className="relative">
                      {/* Icon */}
                      <div className={`
                        inline-flex p-4 rounded-xl mb-4 transition-all duration-300
                        ${activeFeature === index ? 'bg-white/20' : feature.iconBg}
                      `}>
                        <div className={activeFeature === index ? 'text-white' : 'text-emerald-400'}>
                          {getFeatureIcon(feature.icon)}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-xl font-bold mb-3 transition-colors ${
                        activeFeature === index ? 'text-white' : 'text-white'
                      }`}>
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className={`text-sm mb-4 transition-colors ${
                        activeFeature === index ? 'text-white/90' : 'text-gray-400'
                      }`}>
                        {feature.description}
                      </p>

                      {/* Arrow */}
                      <div className={`flex items-center gap-2 text-sm font-medium transition-all ${
                        activeFeature === index ? 'text-white' : 'text-emerald-400'
                      }`}>
                        <span>Explorer</span>
                        <ArrowRight className={`w-4 h-4 transition-transform ${
                          activeFeature === index ? 'translate-x-2' : ''
                        }`} />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Community Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl border border-emerald-500/30"
          >
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-4">
                Rejoignez Notre Communauté UniversMurid
              </h3>
              <p className="text-xl mb-8 text-emerald-50">
                Connectez-vous avec des milliers de fidèles à travers le monde
              </p>

              {/* Social Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {socialStats.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all"
                    >
                      <div className="flex items-center justify-center mb-2">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold">{social.followers}</div>
                      <div className="text-sm text-emerald-100">{social.platform}</div>
                    </motion.a>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-emerald-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 shadow-lg"
                  >
                    Commencer Maintenant
                  </motion.button>
                </Link>
                <Link href="/partager">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-emerald-800 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-900 shadow-lg"
                  >
                    Partager
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}