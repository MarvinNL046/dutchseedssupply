// Type for translations
export type Translations = {
  [locale: string]: {
    [key: string]: string | { [key: string]: string };
  };
};

// Server-side functions
export async function getTranslations(translations: Translations) {
  // This function is used in server components
  // We'll use a dynamic import to avoid the "next/headers" error in client components
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'nl';
  
  return {
    t: createTranslationFunction(translations, locale),
    locale,
  };
}

// Client-side functions
export function useClientTranslations(translations: Translations) {
  // In a client component, we should prioritize the cookie value for consistency with SSR
  // This helps prevent hydration mismatches
  let locale = 'nl'; // Default to Dutch
  
  if (typeof window !== 'undefined') {
    // First try to get locale from cookie
    const cookieLocale = getCookieLocale();
    if (cookieLocale) {
      locale = cookieLocale;
    } else {
      // If no cookie, try localStorage
      const localStorageLocale = localStorage.getItem('NEXT_LOCALE');
      if (localStorageLocale) {
        locale = localStorageLocale;
      } else {
        // If no cookie or localStorage, try to determine from domain
        const hostname = window.location.hostname;
        if (!hostname.includes('localhost') && !hostname.includes('vercel.app') && !hostname.includes('127.0.0.1')) {
          const tld = hostname.split('.').pop();
          if (tld) {
            // Map TLD to locale
            const tldToLocale: Record<string, string> = {
              'nl': 'nl',
              'com': 'en',
              'de': 'de',
              'fr': 'fr',
            };
            
            if (tldToLocale[tld]) {
              locale = tldToLocale[tld];
              
              // Set the locale in cookie and localStorage for future use
              document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Strict`;
              localStorage.setItem('NEXT_LOCALE', locale);
            }
          }
        }
      }
    }
  }
  
  return {
    t: createTranslationFunction(translations, locale),
    locale,
  };
}

// Helper function to get locale from cookie on the client side
function getCookieLocale(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'NEXT_LOCALE') {
      return value;
    }
  }
  return null;
}

// Shared translation function logic
function createTranslationFunction(translations: Translations, locale: string) {
  return (key: string, params?: Record<string, string>) => {
    // Get the translation for the current locale or fallback to Dutch
    const translation = translations[locale]?.[key] || translations['nl']?.[key] || key;
    
    // If the translation is a string and we have params, replace placeholders
    if (typeof translation === 'string' && params) {
      return Object.entries(params).reduce(
        (result, [param, value]) => result.replace(`{{${param}}}`, value),
        translation
      );
    }
    
    return translation as string;
  };
}
