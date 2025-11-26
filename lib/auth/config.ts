export const AUTH_CONFIG = {
  // Configuration des cookies
  cookies: {
    name: 'auth_token',
    maxAge: 24 * 60 * 60, // 24 heures en secondes
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/'
  },

  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'votre-secret-par-defaut-qui-devrait-etre-plus-securise',
    expiresIn: '24h',
    algorithm: 'HS256' as const
  },

  // Configuration de l'autorisation
  authorization: {
    defaultRole: 'user',
    roles: ['user', 'admin', 'moderator'] as const
  }
};