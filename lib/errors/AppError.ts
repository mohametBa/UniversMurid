export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(code: string, message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Erreurs d'authentification prédéfinies
export class AuthError extends AppError {
  constructor(message: string = 'Erreur d\'authentification') {
    super('AUTH_ERROR', message, 401);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Non autorisé') {
    super('UNAUTHORIZED', message, 401);
  }
}

export class TokenExpiredError extends AppError {
  constructor(message: string = 'Token expiré') {
    super('TOKEN_EXPIRED', message, 401);
  }
}

export class InvalidTokenError extends AppError {
  constructor(message: string = 'Token invalide') {
    super('INVALID_TOKEN', message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Accès interdit') {
    super('FORBIDDEN', message, 403);
  }
}