// data/content.ts

export interface Khassida {
  id: string;
  title: string;
  titleArabic?: string;
  author: string;
  reciteur?: string;
  category: string;
  language: string;
  description: string;
  duration: string;
  rating: number;
  views: number;
  isBookmarked: boolean;
  isLiked: boolean;
  pdfUrl?: string;
  audios?: {title: string, url: string, duration: string}[];
  publishedDate: string;
  verses?: number;
  theme?: string;
}

export const khassidaCategories = [
  'Tous',
  'Éloge du Prophète',
  'Guidance Spirituelle',
  'Soufisme',
  'Éducation',
  'Prières',
  'Tawhid'
];

export const languages = [
  'Toutes',
  'Arabe/عربي',
  'Français',
  'Wolof',
  'Anglais',
  'Peul/Pulaar'
];

export const khassidaData: Khassida[] = [
  {
    id: '1',
    title: 'Adiabani Rabou',
    author: 'Cheikh Ahmadou Bamba',
    reciteur: 'Hizbut-Tarqiyyah',
    category: 'Audio',
    language: 'Arabe/عربي',
    description: 'Récitation de Adiabani Rabou.',
    duration: '10:55',
    rating: 5.0,
    views: 10000,
    isBookmarked: false,
    isLiked: true,
    audios: [
      { title: 'Adiabani Rabou', url: '/khassidaAudio/Adiabani-Rabou.mp3', duration: '10:55' }
    ],
    publishedDate: '2023',
    theme: 'Récitation'
  },
  {
    id: '2',
    title: 'Chakawtou Magal',
    author: 'Cheikh Ahmadou Bamba',
    reciteur: 'Hizbut-Tarqiyyah',
    category: 'Audio',
    language: 'Arabe/عربي',
    description: 'Récitation de Chakawtou Magal.',
    duration: '3:55',
    rating: 5.0,
    views: 10000,
    isBookmarked: false,
    isLiked: true,
    audios: [
      { title: 'Chakawtou Magal', url: '/khassidaAudio/Chakawtou-Magal.mp3', duration: '3:55' }
    ],
    publishedDate: '2023',
    theme: 'Récitation'
  },
  {
    id: '3',
    title: 'Hamdi Wasoukri',
    author: 'Cheikh Ahmadou Bamba',
    reciteur: 'Hizbut-Tarqiyyah',
    category: 'Audio',
    language: 'Arabe/عربي',
    description: 'Récitation de Hamdi Wasoukri.',
    duration: '1:19',
    rating: 5.0,
    views: 10000,
    isBookmarked: false,
    isLiked: true,
    audios: [
      { title: 'Hamdi Wasoukri', url: '/khassidaAudio/hamdi-wasoukri.mp3', duration: '1:19' }
    ],
    publishedDate: '2023',
    theme: 'Récitation'
  },
  {
    id: '4',
    title: 'Ilal Moustapha',
    author: 'Cheikh Ahmadou Bamba',
    reciteur: 'Hizbut-Tarqiyyah',
    category: 'Audio',
    language: 'Arabe/عربي',
    description: 'Récitation de Ilal Moustapha.',
    duration: '4:47',
    rating: 5.0,
    views: 10000,
    isBookmarked: false,
    isLiked: true,
    audios: [
      { title: 'Ilal Moustapha', url: '/khassidaAudio/ilal-moustapha.mp3', duration: '4:47' }
    ],
    publishedDate: '2023',
    theme: 'Récitation'
  },
  {
    id: '5',
    title: 'Lamyadou Magal',
    author: 'Cheikh Ahmadou Bamba',
    reciteur: 'Hizbut-Tarqiyyah',
    category: 'Audio',
    language: 'Arabe/عربي',
    description: 'Récitation de Lamyadou Magal.',
    duration: '3:06',
    rating: 5.0,
    views: 10000,
    isBookmarked: false,
    isLiked: true,
    audios: [
      { title: 'Lamyadou Magal', url: '/khassidaAudio/Lamyadou-magal.mp3', duration: '3:06' }
    ],
    publishedDate: '2023',
    theme: 'Récitation'
  },
  {
    id: '6',
    title: 'Rabbi',
    author: 'Cheikh Ahmadou Bamba',
    reciteur: 'Hizbut-Tarqiyyah',
    category: 'Audio',
    language: 'Arabe/عربي',
    description: 'Récitation de Rabbi.',
    duration: '3:02',
    rating: 5.0,
    views: 10000,
    isBookmarked: false,
    isLiked: true,
    audios: [
      { title: 'Rabbi', url: '/khassidaAudio/Rabbi.mp3', duration: '3:02' }
    ],
    publishedDate: '2023',
    theme: 'Récitation'
  },
  {
    id: '7',
    title: 'Waajahatnii',
    author: 'Cheikh Ahmadou Bamba',
    reciteur: 'Hizbut-Tarqiyyah',
    category: 'Audio',
    language: 'Arabe/عربي',
    description: 'Récitation de Waajahatnii.',
    duration: '3:25',
    rating: 5.0,
    views: 10000,
    isBookmarked: false,
    isLiked: true,
    audios: [
      { title: 'Waajahatnii', url: '/khassidaAudio/Waajahatnii.mp3', duration: '3:25' }
    ],
    publishedDate: '2023',
    theme: 'Récitation'
  },
  {
    id: '8',
    title: 'Ya Khayra Dayfine',
    author: 'Cheikh Ahmadou Bamba',
    reciteur: 'Hizbut-Tarqiyyah',
    category: 'Audio',
    language: 'Arabe/عربي',
    description: 'Récitation de Ya Khayra Dayfine.',
    duration: '4:46',
    rating: 5.0,
    views: 10000,
    isBookmarked: false,
    isLiked: true,
    audios: [
      { title: 'Ya Khayra Dayfine', url: '/khassidaAudio/Ya-khayra-dayfine.mp3', duration: '4:46' }
    ],
    publishedDate: '2023',
    theme: 'Récitation'
  }
];

// Fonction utilitaire pour obtenir les Khassida par catégorie
export const getKhassidaByCategory = (category: string): Khassida[] => {
  if (category === 'Tous') return khassidaData;
  return khassidaData.filter(k => k.category === category);
};

// Fonction utilitaire pour obtenir les Khassida par langue
export const getKhassidaByLanguage = (language: string): Khassida[] => {
  if (language === 'Toutes') return khassidaData;
  return khassidaData.filter(k => k.language.includes(language.split('/')[0]));
};

// Fonction utilitaire pour rechercher
export const searchKhassida = (searchTerm: string): Khassida[] => {
  const term = searchTerm.toLowerCase();
  return khassidaData.filter(k => 
    k.title.toLowerCase().includes(term) ||
    k.titleArabic?.includes(term) ||
    k.description.toLowerCase().includes(term) ||
    k.author.toLowerCase().includes(term) ||
    k.theme?.toLowerCase().includes(term)
  );
};