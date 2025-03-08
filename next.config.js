/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // Enable experimental features for App Router
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },
  },
};

module.exports = nextConfig;
