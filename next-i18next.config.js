/**
 * Configuration for next-i18next
 * This is used by the middleware.ts file for domain-based locale detection
 */
module.exports = {
  i18n: {
    locales: ['nl', 'en', 'de', 'fr'],
    defaultLocale: 'nl',
    // Mapping van TLD naar taalcode
    domains: [
      {
        domain: 'dutchseedsupply.nl',
        defaultLocale: 'nl',
      },
      {
        domain: 'dutchseedsupply.com',
        defaultLocale: 'en',
      },
      {
        domain: 'dutchseedsupply.de',
        defaultLocale: 'de',
      },
      {
        domain: 'dutchseedsupply.fr',
        defaultLocale: 'fr',
      },
    ],
  },
};
