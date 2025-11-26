# 🎮 Page Jeux & Culture Générale – Documentation Technique

## 📌 Vue d'ensemble

La page Jeux & Culture Générale propose une expérience ludique et éducative permettant aux utilisateurs de tester leurs connaissances sur **Cheikh Ahmadou Bamba**, la **culture générale mouridisme**, et l’histoire du **Sénégal religieuse**.

### 🔧 Contenu principal
- Grille de sélection des jeux (3–4 modes)
- Cartes animées pour chaque jeu
- Statistiques utilisateur :  
  - jeux joués  
  - score total  
  - streaks  
- Navigation intuitive et fluide

---

# 1️⃣ Hub des Jeux – `/app/jeux/page.tsx`

### Modules affichés
- Quiz Mode
- Jeu de Mémoire
- Flashcards
- Leaderboard

### UI
- Cartes animées (hover, tilt, shadow)
- Affichage stats perso
- Apparence cohérente avec le thème (orange/bleu, style Mouride)

---

# 2️⃣ Quiz Mode – `/app/jeux/quiz/page.tsx`

## 🎯 Fonctionnalités

### Catégories
- Cheikh Ahmadou Bamba (10–15 questions)
- Culture Générale (10–15 questions)
- Sénégal & Histoire (10–15 questions)

### Types de questions
- QCM (4 choix)
- Vrai / Faux
- Classement (ordre chronologique)

### Scoring
- +10 points / bonne réponse  
- Bonus temps pour réponse rapide  
- Total max : **150 points**

### Feedback
- Bonne réponse → vert  
- Mauvaise réponse → rouge  
- Explication courte incluse

### Flow utilisateur
1. Sélectionner une catégorie  
2. Choisir difficulté (Easy / Medium / Hard)  
3. Répondre aux 10 questions  
4. Voir le résultat final  
5. Partager / Rejouer

---

# 3️⃣ Jeu de Mémoire – `/app/jeux/memory/page.tsx`

### Mécanique
- Grille **4x4** (16 cartes)
- Associer les paires d’images ou de textes
- Timer : 2 minutes

### Thèmes
- Cheikh Ahmadou Bamba
- Personnages historiques du Sénégal

### Scoring
- +5 points / paire trouvée  
- Bonus si terminé en < 1 minute  
- Total max : **80 points**

---

# 4️⃣ Flashcard Mode – `/app/jeux/flashcard/page.tsx`

### Fonctionnalités
- Cartes recto-verso (question ➜ réponse)
- Swipe ou clic pour passer
- Système “Connu / Pas connu”
- Statistiques d’apprentissage

### Contenu
- 50+ flashcards :
  - Biographie de Cheikh Ahmadou Bamba
  - Enseignements
  - Dates importantes
  - Disciples majeurs

---

# 5️⃣ Leaderboard – `/app/jeux/leaderboard/page.tsx`

### Type de classements
- 🌍 Global (Top 100 joueurs)
- 📅 Hebdomadaire
- 👥 Amis (si système amis est implémenté)
- 📌 Position personnelle toujours visible

---

# 📊 Structure des données

## TypeScript Interfaces

### Quiz Question
```ts
interface QuizQuestion {
  id: string;
  category: 'bamba' | 'culture' | 'senegal';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  type: 'mcq' | 'truefalse' | 'ranking';
  options: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}
```

### User Score
```ts
interface UserScore {
  userId: string;
  gameType: 'quiz' | 'memory' | 'flashcard';
  category: string;
  score: number;
  difficulty: string;
  timeSpent: number;
  completedAt: Date;
  answers: Answer[];
}

interface Answer {
  questionId: string;
  selected: string;
  correct: boolean;
  timeSpent: number;
}
```

---

# 🗄️ Base de données Supabase

### Table : Questions
```sql
CREATE TABLE quiz_questions (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  question TEXT NOT NULL,
  type TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  points INTEGER,
  created_at TIMESTAMP
);
```

### Table : Scores
```sql
CREATE TABLE user_scores (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  game_type TEXT,
  category TEXT,
  score INTEGER,
  difficulty TEXT,
  time_spent INTEGER,
  completed_at TIMESTAMP,
  answers JSONB
);
```

### Table : Leaderboard
```sql
CREATE TABLE leaderboard (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  total_score INTEGER,
  games_played INTEGER,
  best_score INTEGER,
  updated_at TIMESTAMP
);
```

---

# 🛠️ API Routes

```
/app/api/jeux/
├── quiz/questions/route.ts     # GET questions
├── quiz/submit/route.ts        # POST réponses
├── scores/route.ts             # GET/POST scores
├── leaderboard/route.ts        # GET leaderboard
└── stats/route.ts              # GET stats utilisateur
```

---

# 🎨 Design & UI

### Palette
| Nom | Couleur | Usage |
|-----|----------|--------|
| Primary | `#FF6B35` | Orange Mouride |
| Secondary | `#004E89` | Bleu culture |
| Success | `#06A77D` | Réponses correctes |
| Error | `#D62828` | Incorrect |
| Background | `#0f172a` | Fond sombre |
| Text | `#f1f5f9` | Texte |

### Composants réutilisables
```
components/jeux/
├── QuizCard.tsx
├── QuestionTimer.tsx
├── ScoreBoard.tsx
├── GameHeader.tsx
├── ResultsModal.tsx
└── LeaderboardItem.tsx
```

---

# 📱 Responsive Design

### Mobile
- Stack vertical
- Touch-friendly

### Tablet
- Grille 2 colonnes

### Desktop
- Plein écran + animations

---

# ⚡ Performance

- Code splitting  
- Lazy loading des jeux  
- Cache local des questions  
- Optimisation d’images  
- Leaderboard paginé  

---

# 📝 Contenu : Cheikh Ahmadou Bamba

### Biographie
- Né en 1853 à Mbacké  
- Mort en 1927  
- Fondateur de la Tariqa Mouride  
- Influence spirituelle majeure au Sénégal  

### Enseignements
- Travail et spiritualité  
- Pacifisme  
- Éducation religieuse  

### Événements importants
- 1895 : Fondation du mouridisme  
- 1895–1902 : Exil au Gabon  
- 1902–1927 : Retour et consolidation  

---

# 🏆 Extensions futures

- Système de badges & achievements  
- Challenges quotidiens  
- Boutique de récompenses  
- Graphiques de progression  
- Partage vidéo  
- Traductions FR / WOLOF / EN  
- Feedback utilisateur intégré  

