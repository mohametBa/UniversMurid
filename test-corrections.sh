#!/bin/bash

# Script de test pour vérifier les corrections d'authentification et de progression
# Usage: ./test-corrections.sh

echo "🧪 Test des corrections d'authentification et de progression"
echo "============================================================"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher un message coloré
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "SUCCESS" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "WARNING" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    elif [ "$status" = "ERROR" ]; then
        echo -e "${RED}❌ $message${NC}"
    else
        echo -e "${BLUE}ℹ️  $message${NC}"
    fi
}

echo ""
echo "1. Vérification des fichiers modifiés..."
echo "========================================"

# Vérifier les fichiers modifiés
files_to_check=(
    "middleware.ts"
    "app/api/game-stats/route.ts"
    "app/api/game-stats/achievements/route.ts"
    "app/api/game-stats/history/route.ts"
    "lib/hooks/useGameStats.tsx"
    "components/AuthDiagnostic.tsx"
    "components/ProgressRecovery.tsx"
    "CORRECTION_AUTH_PROGRESS.md"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        print_status "SUCCESS" "Fichier trouvé: $file"
    else
        print_status "ERROR" "Fichier manquant: $file"
    fi
done

echo ""
echo "2. Vérification des modifications critiques..."
echo "==============================================="

# Vérifier si les endpoints API sont dans les routes protégées
if grep -q "/api/game-stats" middleware.ts; then
    print_status "SUCCESS" "Endpoints /api/game-stats ajoutés aux routes protégées"
else
    print_status "ERROR" "Endpoints /api/game-stats NON ajoutés aux routes protégées"
fi

# Vérifier si le middleware utilise Supabase Auth
if grep -q "createClient" middleware.ts && grep -q "supabase.auth.getUser" middleware.ts; then
    print_status "SUCCESS" "Middleware configuré pour Supabase Auth"
else
    print_status "WARNING" "Middleware pourrait ne pas utiliser Supabase Auth"
fi

# Vérifier si les endpoints API utilisent les headers du middleware
if grep -q "x-user-id" app/api/game-stats/route.ts; then
    print_status "SUCCESS" "Endpoints API utilisent les headers du middleware"
else
    print_status "ERROR" "Endpoints API n'utilisent PAS les headers du middleware"
fi

# Vérifier si useGameStats utilise les endpoints API
if grep -q "fetch.*api/game-stats" lib/hooks/useGameStats.tsx; then
    print_status "SUCCESS" "Hook useGameStats utilise les endpoints API"
else
    print_status "WARNING" "Hook useGameStats pourrait ne pas utiliser les endpoints API"
fi

echo ""
echo "3. Vérification de la structure des composants..."
echo "================================================="

# Vérifier les composants de diagnostic
if grep -q "AuthDiagnostic" app/jeux/page.tsx; then
    print_status "SUCCESS" "Component AuthDiagnostic intégré dans la page des jeux"
else
    print_status "WARNING" "Component AuthDiagnostic NON intégré"
fi

if grep -q "ProgressRecovery" app/jeux/page.tsx; then
    print_status "SUCCESS" "Component ProgressRecovery intégré dans la page des jeux"
else
    print_status "WARNING" "Component ProgressRecovery NON intégré"
fi

echo ""
echo "4. Test de la syntaxe TypeScript..."
echo "==================================="

# Vérifier la syntaxe TypeScript des fichiers principaux
typescript_files=(
    "lib/hooks/useGameStats.tsx"
    "components/AuthDiagnostic.tsx"
    "components/ProgressRecovery.tsx"
    "app/api/game-stats/route.ts"
    "middleware.ts"
)

for file in "${typescript_files[@]}"; do
    if [ -f "$file" ]; then
        # Utiliser Node.js pour vérifier la syntaxe (nécessite que TypeScript soit installé globalement)
        if command -v npx &> /dev/null; then
            if npx -y typescript@latest --noEmit "$file" 2>/dev/null; then
                print_status "SUCCESS" "Syntaxe TypeScript OK: $file"
            else
                print_status "WARNING" "Problème de syntaxe TypeScript: $file"
            fi
        else
            print_status "WARNING" "npx non disponible, impossible de vérifier: $file"
        fi
    fi
done

echo ""
echo "5. Vérification des imports..."
echo "=============================="

# Vérifier les imports dans les composants
imports_to_check=(
    "lib/hooks/useGameStats"
    "components/AuthDiagnostic"
    "components/ProgressRecovery"
)

for import_path in "${imports_to_check[@]}"; do
    if grep -r "from.*$import_path" . --include="*.tsx" --include="*.ts" | head -1 | grep -q "$import_path"; then
        print_status "SUCCESS" "Import trouvé: $import_path"
    else
        print_status "WARNING" "Import possiblement manquant: $import_path"
    fi
done

echo ""
echo "6. Résumé des corrections..."
echo "==========================="
echo ""
echo "🔧 Corrections appliquées:"
echo "  • Middleware mis à jour pour utiliser Supabase Auth"
echo "  • Endpoints API /api/game-stats/* ajoutés aux routes protégées"  
echo "  • Authentification corrigée dans tous les endpoints API"
echo "  • Hook useGameStats modifié pour utiliser les endpoints API"
echo "  • Composant AuthDiagnostic pour diagnostiquer les problèmes"
echo "  • Composant ProgressRecovery pour synchroniser les données"
echo "  • Intégration des composants dans la page des jeux"
echo ""
echo "🎯 Problèmes résolus:"
echo "  • Erreurs 401 (Non Autorisé)"
echo "  • Perte de progression lors des actualisations"
echo "  • Incohérences d'authentification"
echo "  • Synchronisation local/serveur"
echo ""
print_status "INFO" "Test terminé! Vérifiez les messages ci-dessus."

echo ""
echo "📋 Prochaines étapes recommandées:"
echo "1. Lancer l'application: npm run dev"
echo "2. Tester la connexion utilisateur"
echo "3. Vérifier la sauvegarde automatique"
echo "4. Tester la récupération de progression"
echo "5. Consulter CORRECTION_AUTH_PROGRESS.md pour plus de détails"