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
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  
  return {
    t: createTranslationFunction(translations, locale),
    locale,
  };
}

// Client-side functions
export function useClientTranslations(translations: Translations) {
  // In a client component, we should prioritize the cookie value for consistency with SSR
  // This helps prevent hydration mismatches
  const locale = typeof window !== 'undefined' 
    ? getCookieLocale() || localStorage.getItem('NEXT_LOCALE') || 'en'
    : 'en';
  
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
    // Get the translation for the current locale or fallback to English
    const translation = translations[locale]?.[key] || translations['en']?.[key] || key;
    
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
