'use client';

import { useClientTranslations } from '@/lib/i18n';
import translations from '@/locale/translations';

// Mapping van taalcodes naar domeinen
const domainMapping = {
  en: 'com',
  nl: 'nl',
  de: 'de',
  fr: 'fr',
};

// Taalvlaggen en namen
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function DomainLanguageSwitcher() {
  const { locale } = useClientTranslations(translations);
  
  // Functie om de huidige URL te converteren naar de URL voor een andere taal
  const getUrlForLanguage = (langCode: string) => {
    // Haal de huidige URL op
    const currentUrl = window.location.href;
    const currentDomain = window.location.hostname;
    
    // Controleer of we op localhost zijn
    if (currentDomain.includes('localhost') || currentDomain.includes('vercel.app')) {
      // Op localhost of vercel.app gebruiken we cookies in plaats van domeinen
      localStorage.setItem('NEXT_LOCALE', langCode);
      document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`;
      return window.location.href; // Zelfde URL, we zullen de pagina herladen
    }
    
    // Bepaal het nieuwe domein op basis van de taalcode
    const targetDomain = domainMapping[langCode as keyof typeof domainMapping];
    
    // Vervang het domein in de URL
    // Bijvoorbeeld: dutchseedsupply.nl -> dutchseedsupply.de
    const domainParts = currentDomain.split('.');
    if (domainParts.length >= 2) {
      // Vervang het laatste deel (TLD)
      domainParts[domainParts.length - 1] = targetDomain;
      const newDomain = domainParts.join('.');
      
      // Vervang het domein in de URL
      return currentUrl.replace(currentDomain, newDomain);
    }
    
    return currentUrl; // Fallback naar de huidige URL
  };
  
  // Functie om naar een ander domein te navigeren
  const switchDomain = (langCode: string) => {
    if (langCode === locale) return; // Geen actie als het dezelfde taal is
    
    const newUrl = getUrlForLanguage(langCode);
    window.location.href = newUrl;
  };
  
  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchDomain(lang.code)}
          className={`flex items-center justify-center w-8 h-8 rounded-full overflow-hidden ${
            locale === lang.code ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
          }`}
          title={lang.name}
          aria-label={`Switch to ${lang.name}`}
        >
          <span className="text-lg">{lang.flag}</span>
        </button>
      ))}
    </div>
  );
}
