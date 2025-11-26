import 'next';

declare module 'next' {
  interface NextRequest {
    user?: {
      id: string;
      email: string;
      role: string;
      [key: string]: any;
    };
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}