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
function getLocaleFromDomain(hostname: string, request: NextRequest): string {
  // Standaard taalcode als we geen match vinden
  let locale = 'nl';
  
  // Controleer of we op localhost of een development omgeving zijn
  if (hostname.includes('localhost') || hostname.includes('vercel.app') || hostname.includes('127.0.0.1')) {
    // Op development omgevingen gebruiken we eerst cookies als die er zijn
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale) {
      return cookieLocale;
    }
    
    // Anders proberen we de browser taal te detecteren
    return getBrowserLocale(request) || locale;
  }
  
  // Haal de TLD uit het domein (het deel na de laatste punt)
  const tld = hostname.split('.').pop();
  
  if (tld && domainLocaleMap[tld]) {
    locale = domainLocaleMap[tld];
  }
  
  return locale;
}

// Functie om de browser taal te detecteren
function getBrowserLocale(request: NextRequest): string | null {
  // Haal de Accept-Language header op
  const acceptLanguage = request.headers.get('Accept-Language');
  if (!acceptLanguage) return null;
  
  // Parse de Accept-Language header
  // Format is meestal: nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7
  const languages = acceptLanguage.split(',')
    .map(lang => {
      const [code, weight] = lang.split(';q=');
      return {
        code: code.split('-')[0], // Haal alleen de taalcode (nl, en, etc.)
        weight: weight ? parseFloat(weight) : 1.0
      };
    })
    .sort((a, b) => b.weight - a.weight); // Sorteer op gewicht (hoogste eerst)
  
  // Controleer of een van de browser talen overeenkomt met onze ondersteunde talen
  const supportedLanguages = Object.values(domainLocaleMap);
  
  for (const lang of languages) {
    if (supportedLanguages.includes(lang.code)) {
      return lang.code;
    }
  }
  
  // Als geen enkele taal wordt ondersteund, gebruik dan de standaard taal (nl)
  return null;
}

// Middleware functie die zowel de taal als de Supabase sessie afhandelt
export async function domainMiddleware(request: NextRequest) {
  try {
    // Bepaal de taalcode op basis van het domein
    const locale = getLocaleFromDomain(request.headers.get('host') || '', request);
    
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
