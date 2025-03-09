import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './supabase/middleware_fixed';

// Mapping van TLD naar taalcode en domein ID
const domainMap: Record<string, { locale: string, domainId: string }> = {
  'nl': { locale: 'nl', domainId: 'nl' },
  'com': { locale: 'en', domainId: 'com' },
  'de': { locale: 'de', domainId: 'de' },
  'fr': { locale: 'fr', domainId: 'fr' },
};

// Functie om de domein informatie te bepalen op basis van het domein
function getDomainInfo(hostname: string, request: NextRequest): { locale: string, domainId: string } {
  // Standaard waarden als we geen match vinden
  let locale = 'nl';
  let domainId = 'nl';
  
  // Controleer of we op localhost of een development omgeving zijn
  if (hostname.includes('localhost') || hostname.includes('vercel.app') || hostname.includes('127.0.0.1')) {
    // Op development omgevingen gebruiken we eerst cookies als die er zijn
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const cookieDomainId = request.cookies.get('DOMAIN_ID')?.value;
    
    if (cookieLocale && cookieDomainId) {
      return { locale: cookieLocale, domainId: cookieDomainId };
    }
    
    if (cookieLocale) {
      // Als we alleen locale hebben, proberen we de bijbehorende domainId te vinden
      for (const [tld, info] of Object.entries(domainMap)) {
        if (info.locale === cookieLocale) {
          domainId = info.domainId;
          break;
        }
      }
      return { locale: cookieLocale, domainId };
    }
    
    // Anders proberen we de browser taal te detecteren
    const detectedLocale = getBrowserLocale(request);
    if (detectedLocale) {
      locale = detectedLocale;
      // Zoek de bijbehorende domainId
      for (const [tld, info] of Object.entries(domainMap)) {
        if (info.locale === detectedLocale) {
          domainId = info.domainId;
          break;
        }
      }
    }
    
    return { locale, domainId };
  }
  
  // Haal de TLD uit het domein (het deel na de laatste punt)
  const tld = hostname.split('.').pop();
  
  if (tld && domainMap[tld]) {
    return domainMap[tld];
  }
  
  return { locale, domainId };
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
  const supportedLanguages = Object.values(domainMap).map(info => info.locale);
  
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
    // Bepaal de domein informatie op basis van het domein
    const { locale, domainId } = getDomainInfo(request.headers.get('host') || '', request);
    
    // Log voor debugging
    console.log(`Domain middleware: Host=${request.headers.get('host')}, Detected locale=${locale}, domainId=${domainId}`);
    
    // Update de Supabase sessie
    const sessionResponse = await updateSession(request);
    
    // Stel de taalcode in als cookie op de sessionResponse
    sessionResponse.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 dagen
      sameSite: 'strict',
    });
    
    // Stel de domein ID in als cookie op de sessionResponse
    sessionResponse.cookies.set('DOMAIN_ID', domainId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 dagen
      sameSite: 'strict',
    });
    
    return sessionResponse;
  } catch (error) {
    console.error('Error in domainMiddleware:', error);
    return NextResponse.next();
  }
}
