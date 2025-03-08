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
};

module.exports = nextConfig;
