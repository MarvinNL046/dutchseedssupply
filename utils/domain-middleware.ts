import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './supabase/middleware_fixed';

// Mapping van TLD naar taalcode
const domainLocaleMap: Record<string, string> = {
  'nl': 'nl',
  'com': 'en',
  'de': 'de',
  'fr': 'fr',
};

// Functie om de taalcode te bepalen op basis van het domein
function getLocaleFromDomain(hostname: string): string {
  // Standaard taalcode als we geen match vinden
  let locale = 'nl';
  
  // Controleer of we op localhost of een development omgeving zijn
  if (hostname.includes('localhost') || hostname.includes('vercel.app')) {
    // Op development omgevingen gebruiken we cookies
    return locale;
  }
  
  // Haal de TLD uit het domein (het deel na de laatste punt)
  const tld = hostname.split('.').pop();
  
  if (tld && domainLocaleMap[tld]) {
    locale = domainLocaleMap[tld];
  }
  
  return locale;
}

// Middleware functie die zowel de taal als de Supabase sessie afhandelt
export async function domainMiddleware(request: NextRequest) {
  try {
    // Bepaal de taalcode op basis van het domein
    const locale = getLocaleFromDomain(request.headers.get('host') || '');
    
    // Stel de taalcode in als cookie
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 dagen
      sameSite: 'strict',
    });
    
    // Update de Supabase sessie
    const sessionResponse = await updateSession(request);
    
    // Combineer de cookies van beide responses
    sessionResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value);
    });
    
    return response;
  } catch (error) {
    console.error('Error in domainMiddleware:', error);
    return NextResponse.next();
  }
}
