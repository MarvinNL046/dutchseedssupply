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
  
  // Verwijder i18n configuratie om subdirectories te voorkomen
  // We gebruiken nu domein-gebaseerde taaldetectie via middleware
};

module.exports = nextConfig;
