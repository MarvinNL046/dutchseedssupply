'use client';

import { useClientTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';
import ReactCountryFlag from 'react-country-flag';

// Mapping van taalcodes naar domeinen
const domainMapping = {
  en: 'com',
  nl: 'nl',
  de: 'de',
  fr: 'fr',
};

// Taalvlaggen en namen
const languages = [
  { code: 'en', name: 'English', countryCode: 'GB' },
  { code: 'nl', name: 'Nederlands', countryCode: 'NL' },
  { code: 'de', name: 'Deutsch', countryCode: 'DE' },
  { code: 'fr', name: 'Français', countryCode: 'FR' },
];

export default function DomainLanguageSwitcher() {
  const { locale } = useClientTranslations(translations);
  
  // Functie om de huidige URL te converteren naar de URL voor een andere taal
  const getUrlForLanguage = (langCode: string) => {
    // Haal de huidige URL op
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentDomain = window.location.hostname;
    
    // Controleer of we op localhost of een development omgeving zijn
    if (currentDomain.includes('localhost') || 
        currentDomain.includes('vercel.app') || 
        currentDomain.includes('127.0.0.1')) {
      // Op localhost of vercel.app gebruiken we cookies in plaats van domeinen
      localStorage.setItem('NEXT_LOCALE', langCode);
      document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Strict`;
      
      // Voeg een timestamp toe aan de URL om een refresh te forceren
      const separator = currentSearch ? '&' : '?';
      return `${currentPath}${currentSearch}${separator}_ts=${Date.now()}`;
    }
    
    // Bepaal het nieuwe domein op basis van de taalcode
    const targetTLD = domainMapping[langCode as keyof typeof domainMapping];
    
    // Bouw de nieuwe URL op met de juiste TLD
    // Bijvoorbeeld: dutchseedsupply.nl -> dutchseedsupply.de
    const protocol = window.location.protocol;
    return `${protocol}//dutchseedsupply.${targetTLD}${currentPath}${currentSearch}`;
  };
  
  // Functie om naar een ander domein te navigeren
  const switchLanguage = (langCode: string) => {
    if (langCode === locale) return; // Geen actie als het dezelfde taal is
    
    const newUrl = getUrlForLanguage(langCode);
    window.location.href = newUrl;
  };
  
  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLanguage(lang.code)}
          className={`flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border ${
            locale === lang.code 
              ? 'ring-2 ring-green-500 border-green-500' 
              : 'opacity-70 hover:opacity-100 border-gray-300 dark:border-gray-600'
          }`}
          title={lang.name}
          aria-label={`Switch to ${lang.name}`}
        >
          <ReactCountryFlag
            countryCode={lang.countryCode}
            svg
            style={{
              width: '1.5em',
              height: '1.5em',
            }}
            title={lang.name}
          />
        </button>
      ))}
    </div>
  );
}
