import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Enable experimental features for App Router
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },
    nodeMiddleware: true, // Toevoegen om Node.js middleware te ondersteunen
  },
};

export default nextConfig;
