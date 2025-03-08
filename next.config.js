/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // Betere compatibiliteit met hosting
  trailingSlash: true,
  
  // Disable server actions om build problemen te voorkomen
  // experimental: {
  //   serverActions: {
  //     allowedOrigins: ['localhost:3000', 'localhost:3001', 'dutchseedsupply.com', 'www.dutchseedsupply.com'],
  //   },
  // },
  
  // Output configuratie voor Vercel
  output: 'standalone',
  
  // Configuratie voor domein
  images: {
    domains: ['dutchseedsupply.com', 'www.dutchseedsupply.nl', 'dutchseedsupply.de', 'www.dutchseedsupply.fr'],
  },
  
  // Configuratie voor i18n
  i18n: {
    locales: ['nl', 'en', 'de'],
    defaultLocale: 'nl',
    localeDetection: false,
  },
};

module.exports = nextConfig;
