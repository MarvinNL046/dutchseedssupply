#!/usr/bin/env node

/**
 * Sitemap Generator Script
 * 
 * This script generates language-specific sitemaps and a sitemap index for the Dutch Seed Supply website.
 * It creates separate sitemaps for each supported language/domain and includes hreflang annotations.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

// Ensure the public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Domain and language configuration
const domains = {
  'nl': {
    domain: 'https://www.dutchseedsupply.nl',
    locale: 'nl',
  },
  'com': {
    domain: 'https://www.dutchseedsupply.com',
    locale: 'en',
  },
  'de': {
    domain: 'https://www.dutchseedsupply.de',
    locale: 'de',
  },
  'fr': {
    domain: 'https://www.dutchseedsupply.fr',
    locale: 'fr',
  }
};

// Define the pages to include in the sitemap
// This should be updated whenever new pages are added to the website
const pages = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/products/', changefreq: 'daily', priority: '0.9' },
  { path: '/faq/', changefreq: 'weekly', priority: '0.7' },
  { path: '/contact/', changefreq: 'monthly', priority: '0.6' },
  { path: '/terms/', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy/', changefreq: 'monthly', priority: '0.5' },
  { path: '/shipping/', changefreq: 'monthly', priority: '0.5' },
  { path: '/returns/', changefreq: 'monthly', priority: '0.5' },
  { path: '/cookies/', changefreq: 'monthly', priority: '0.5' },
  { path: '/login/', changefreq: 'monthly', priority: '0.5' },
  { path: '/register/', changefreq: 'monthly', priority: '0.5' },
];

// Get current date in ISO format for lastmod
const currentDate = new Date().toISOString();

// Generate sitemap for each language
for (const [, domainInfo] of Object.entries(domains)) {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Add each page to the sitemap
  for (const page of pages) {
    sitemap += `  <url>
    <loc>${domainInfo.domain}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
`;

    // Add hreflang annotations for each language
    for (const [, otherDomainInfo] of Object.entries(domains)) {
      sitemap += `    <xhtml:link 
      rel="alternate" 
      hreflang="${otherDomainInfo.locale}" 
      href="${otherDomainInfo.domain}${page.path}" />
`;
    }

    // Add a default hreflang="x-default" pointing to the English version
    sitemap += `    <xhtml:link 
      rel="alternate" 
      hreflang="x-default" 
      href="${domains.com.domain}${page.path}" />
`;

    sitemap += `  </url>
`;
  }

  sitemap += `</urlset>`;

  // Write the sitemap to a file
  fs.writeFileSync(path.join(publicDir, `sitemap-${domainInfo.locale}.xml`), sitemap);
  console.log(`Generated sitemap for ${domainInfo.locale}: sitemap-${domainInfo.locale}.xml`);
}

// Generate sitemap index
let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

for (const [, domainInfo] of Object.entries(domains)) {
  sitemapIndex += `  <sitemap>
    <loc>${domainInfo.domain}/sitemap-${domainInfo.locale}.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
`;
}

sitemapIndex += `</sitemapindex>`;

// Write the sitemap index to a file
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex);
console.log('Generated sitemap index: sitemap.xml');

// Create robots.txt file if it doesn't exist
const robotsTxtPath = path.join(publicDir, 'robots.txt');
if (!fs.existsSync(robotsTxtPath)) {
  const robotsTxt = `# robots.txt for Dutch Seed Supply
User-agent: *
Allow: /

# Sitemaps
Sitemap: https://www.dutchseedsupply.nl/sitemap.xml
Sitemap: https://www.dutchseedsupply.com/sitemap.xml
Sitemap: https://www.dutchseedsupply.de/sitemap.xml
Sitemap: https://www.dutchseedsupply.fr/sitemap.xml
`;
  fs.writeFileSync(robotsTxtPath, robotsTxt);
  console.log('Generated robots.txt');
} else {
  console.log('robots.txt already exists, skipping generation');
}

console.log('Sitemap generation completed successfully!');
