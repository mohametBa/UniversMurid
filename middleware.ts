import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AppError, TokenExpiredError, InvalidTokenError } from './lib/errors/AppError';
import { AUTH_CONFIG } from './lib/auth/config';

// Interface pour l'utilisateur authentifié
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  [key: string]: any;
}

// Interface pour la requête augmentée
export interface AuthenticatedRequest extends NextRequest {
  user?: AuthenticatedUser;
}

// Configuration du middleware
const MIDDLEWARE_CONFIG = {
  // Routes qui nécessitent une authentification
  protectedRoutes: [
    '/stats',
    '/api/jeux/scores',
    '/api/jeux/stats',
    '/api/game-progress',
    '/api/game-stats',
    '/api/game-stats/achievements',
    '/api/game-stats/history'
  ],
  // Routes publiques (pas d'authentification requise)
  publicRoutes: [
    '/',
    '/auth',
    '/api/auth',
  ],
  // Redirection pour les routes non authentifiées
  authRedirect: '/auth/login'
};

async function authenticateUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Utiliser Supabase pour vérifier l'authentification
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Récupérer le token d'auth depuis les cookies
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return null;
      }
      
      // Mapper l'utilisateur Supabase au format attendu
      return {
        id: user.id,
        email: user.email!,
        role: 'user', // Rôle par défaut
        ...user.user_metadata
      };
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return null;
    }
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return null;
  }
}

function isProtectedRoute(pathname: string): boolean {
  return MIDDLEWARE_CONFIG.protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
}

function isPublicRoute(pathname: string): boolean {
  return MIDDLEWARE_CONFIG.publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log pour le débogage (à supprimer en production)
  console.log(`[Middleware] Traitement de: ${pathname}`);

  // Les routes publiques ne nécessitent pas d'authentification
  if (isPublicRoute(pathname)) {
    // Pour les routes publiques, vérifier s'il y a une session active
    // et la nettoyer si nécessaire
    const user = await authenticateUser(request);
    if (user && pathname.startsWith('/auth/')) {
      // Si l'utilisateur est déjà connecté et essaie d'accéder aux pages d'auth
      // le laisser passer (il sera redirigé côté client si nécessaire)
      console.log('[Middleware] Utilisateur déjà connecté sur route auth');
    }
    return NextResponse.next();
  }

  // Vérifier si c'est une route protégée
  if (isProtectedRoute(pathname)) {
    try {
      const user = await authenticateUser(request);
      
      if (!user) {
        console.log('[Middleware] Utilisateur non authentifié pour route protégée:', pathname);
        // Rediriger vers la page de connexion si pas authentifié
        const loginUrl = new URL(MIDDLEWARE_CONFIG.authRedirect, request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      console.log('[Middleware] Utilisateur authentifié:', user.email);

      // Ajouter l'utilisateur à la requête pour les API routes
      if (pathname.startsWith('/api/')) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', user.id);
        requestHeaders.set('x-user-role', user.role);
        requestHeaders.set('x-user-email', user.email);
        
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }

      return NextResponse.next();
    } catch (error) {
      console.error('[Middleware] Erreur d\'authentification:', error);
      
      // En cas d'erreur, rediriger vers la connexion
      const loginUrl = new URL(MIDDLEWARE_CONFIG.authRedirect, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Pour toutes les autres routes, continuer normalement
  return NextResponse.next();
}

// Configuration du matcher pour optimiser les performances
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

// Fonctions utilitaires pour utilisation dans les API routes
export async function authMiddleware(request: AuthenticatedRequest): Promise<AuthenticatedUser> {
  try {
    const user = await authenticateUser(request);
    
    if (!user) {
      throw new AppError('UNAUTHORIZED', 'Non autorisé - Token manquant', 401);
    }

    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('AUTH_ERROR', 'Erreur d\'authentification', 401);
  }
}

// Type pour les gestionnaires de routes API
type ApiHandler = (request: AuthenticatedRequest) => Promise<NextResponse>;

// Middleware pour les routes API qui nécessitent une authentification
export function withAuth(handler: ApiHandler): ApiHandler {
  return async (request: AuthenticatedRequest): Promise<NextResponse> => {
    try {
      const user = await authMiddleware(request);
      // Ajoute l'utilisateur à la requête pour une utilisation ultérieure
      request.user = user;
      return handler(request);
    } catch (error: any) {
      const statusCode = error.statusCode || 401;
      const message = error.message || 'Erreur d\'authentification';
      
      return NextResponse.json(
        { 
          success: false, 
          message 
        },
        { status: statusCode }
      );
    }
  };
}

// Type pour les rôles
type Role = typeof AUTH_CONFIG.authorization.roles[number];

// Middleware pour vérifier les rôles
export function withRole(roles: Role[]): (handler: ApiHandler) => ApiHandler {
  return (handler: ApiHandler): ApiHandler => {
    return async (request: AuthenticatedRequest): Promise<NextResponse> => {
      try {
        const user = await authMiddleware(request);
        
        if (!roles.includes(user.role as Role)) {
          throw new AppError(
            'FORBIDDEN',
            'Vous n\'avez pas les permissions nécessaires',
            403
          );
        }

        request.user = user;
        return handler(request);
      } catch (error: any) {
        const statusCode = error.statusCode || 403;
        const message = error.message || 'Accès interdit';
        
        return NextResponse.json(
          { 
            success: false, 
            message 
          },
          { status: statusCode }
        );
      }
    };
  };
}