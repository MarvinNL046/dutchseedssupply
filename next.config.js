/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // Gebruik statische export om server-side problemen te voorkomen
  output: 'export',
  
  // Disable image optimization omdat dit niet werkt met statische export
  images: {
    unoptimized: true,
  },
  
  // Server Actions zijn niet ondersteund met statische export
  // experimental: {
  //   serverActions: {
  //     allowedOrigins: ['localhost:3000', 'localhost:3001'],
  //   },
  // },
};

module.exports = nextConfig;
