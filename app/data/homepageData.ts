// Données centralisées pour la page d'accueil
import { Facebook, Instagram, Youtube, Video } from 'lucide-react';

export const features = [
  {
    icon: 'Book',
    title: "Lire les Khassida",
    description: "Accédez à une collection complète des œuvres de Cheikh Ahmadou Bamba",
    link: "/khassida",
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-500/20"
  },
  {
    icon: 'Headphones',
    title: "Écouter",
    description: "Écoutez les récitations des Khassidas et Podcast",
    link: "/audio",
    gradient: "from-purple-500 to-indigo-600",
    iconBg: "bg-purple-500/20"
  },
  {
    icon: 'Globe',
    title: "Multilingue",
    description: "Disponible en arabe, français, wolof et autres langues",
    link: "/langues",
    gradient: "from-cyan-500 to-blue-600",
    iconBg: "bg-cyan-500/20"
  },
  {
    icon: 'Share2',
    title: "Partager",
    description: "Partagez la lumière des enseignements avec le monde",
    link: "/partager",
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-500/20"
  }
];

export const socialStats = [
  { 
    platform: 'Facebook', 
    followers: '10K', 
    icon: Facebook, 
    color: 'text-blue-400',
    url: 'https://www.facebook.com/share/17AHiBumoA/?mibextid=wwXIfr' 
  },
  { 
    platform: 'Instagram', 
    followers: '40,6K', 
    icon: Instagram, 
    color: 'text-pink-400',
    url: 'https://www.instagram.com/universmurid?igsh=dWd3OTQ2Ym01YXlx&utm_source=qr' 
  },
  { 
    platform: 'YouTube', 
    followers: '628', 
    icon: Youtube, 
    color: 'text-red-400',
    url: 'https://youtube.com/@universmurid?si=LKxuAs1evuxcb-Xr' 
  },
  { 
    platform: 'TikTok', 
    followers: '22,9K', 
    icon: Video, 
    color: 'text-gray-200',
    url: 'https://www.tiktok.com/@univers_murid?_r=1&_t=ZN-91Mb874G0uc' 
  }
];

// Icônes disponibles pour les features
export const iconComponents = {
  Book: 'Book',
  Headphones: 'Headphones',
  Globe: 'Globe',
  Share2: 'Share2'
};