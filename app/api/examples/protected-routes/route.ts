import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole, AuthenticatedRequest } from '../../../../middleware';

// Exemple d'une route API protégée qui nécessite une authentification
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  // L'utilisateur est maintenant disponible dans request.user
  const user = request.user!;
  
  try {
    // Votre logique métier ici
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      // autres données utilisateur
    };

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'Données utilisateur récupérées avec succès'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
});

// Exemple d'une route API avec vérification de rôle
export const POST = withRole(['admin'])(async (request: AuthenticatedRequest) => {
  // Seuls les admins peuvent accéder à cette route
  const user = request.user!;
  
  try {
    const body = await request.json();
    
    // Votre logique d'administration ici
    
    return NextResponse.json({
      success: true,
      message: 'Action d\'administration réussie'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'action d\'administration' },
      { status: 500 }
    );
  }
});

// Exemple avec plusieurs rôles autorisés
export const PUT = withRole(['admin', 'moderator'])(async (request: AuthenticatedRequest) => {
  // Admins et modérateurs peuvent accéder à cette route
  const user = request.user!;
  
  try {
    const body = await request.json();
    
    // Votre logique de modération ici
    
    return NextResponse.json({
      success: true,
      message: 'Action de modération réussie'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'action de modération' },
      { status: 500 }
    );
  }
});