import { NextRequest } from 'next/server';
import { domainMiddleware } from './utils/domain-middleware';

// Middleware functie die zowel de taal als de Supabase sessie afhandelt
export async function middleware(request: NextRequest) {
  return await domainMiddleware(request);
}

// Configureer welke paden de middleware moet afhandelen
export const config = {
  matcher: [
    // Exclude statische bestanden, API routes, en Next.js interne routes
    '/((?!_next/static|_next/image|favicon.ico|images|api/webhook).*)',
  ],
};
