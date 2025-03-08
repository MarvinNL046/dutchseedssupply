import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Dezelfde mapping die je al in next-i18next.config.js hebt
const domainToLocale = { 'com': 'en', 'nl': 'nl', 'de': 'de', 'fr': 'fr' };

// Configureer welke paden de middleware moet afhandelen
export const config = {
  matcher: [
    // Pas middleware toe op alle paden behalve API routes, static files, etc.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default function middleware(req: NextRequest) {
  // Maak een nieuwe response aan
  const response = NextResponse.next();
  
  // Haal de host op uit de headers
  const host = req.headers.get('host');
  if (!host) return response;
  
  // Extraheer het domein-deel (com, nl, de, fr)
  // Voor localhost, gebruik een default
  let domainPart: string = 'com'; // Default voor lokale ontwikkeling
  if (host.includes('localhost')) {
    // Gebruik default
  } else {
    // Haal het laatste deel van het domein op (bijv. 'nl' van 'example.nl')
    const parts = host.split('.');
    if (parts.length > 0) {
      const lastPart = parts.pop();
      if (lastPart) domainPart = lastPart;
    }
  }
  
  // Bepaal de locale op basis van het domein
  const locale = domainToLocale[domainPart as keyof typeof domainToLocale] || 'en';
  
  // Stel een cookie in voor de locale die 24 uur geldig is
  response.cookies.set('NEXT_LOCALE', locale, { 
    path: '/', 
    maxAge: 60 * 60 * 24,
    sameSite: 'strict'
  });
  
  // Stel ook een cookie in voor domain_id voor gebruik met de database
  response.cookies.set('DOMAIN_ID', domainPart, {
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: 'strict'
  });
  
  // Voeg custom headers toe die je in je componenten kunt gebruiken
  response.headers.set('x-locale', locale);
  response.headers.set('x-domain-id', domainPart);
  
  return response;
}
