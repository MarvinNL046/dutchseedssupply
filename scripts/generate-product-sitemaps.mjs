#!/usr/bin/env node

/**
 * Product Sitemap Generator Script
 * 
 * This script generates language-specific sitemaps for product pages by fetching
 * product data from the database and creating sitemap entries for each product.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

// Ensure the public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or key not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

// Get current date in ISO format for lastmod
const currentDate = new Date().toISOString();

async function generateProductSitemaps() {
  try {
    // Fetch all products from the database
    const { data: products, error } = await supabase
      .from('products')
      .select('id, slug');

    if (error) {
      throw error;
    }

    if (!products || products.length === 0) {
      console.log('No products found in the database');
      return;
    }

    console.log(`Found ${products.length} products`);

    // Generate sitemap for each language
    for (const [, domainInfo] of Object.entries(domains)) {
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

      // Add each product to the sitemap
      for (const product of products) {
        const productPath = `/products/${product.slug}/`;
        
        sitemap += `  <url>
    <loc>${domainInfo.domain}${productPath}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
`;

        // Add hreflang annotations for each language
        for (const [, otherDomainInfo] of Object.entries(domains)) {
          sitemap += `    <xhtml:link 
      rel="alternate" 
      hreflang="${otherDomainInfo.locale}" 
      href="${otherDomainInfo.domain}${productPath}" />
`;
        }

        // Add a default hreflang="x-default" pointing to the English version
        sitemap += `    <xhtml:link 
      rel="alternate" 
      hreflang="x-default" 
      href="${domains.com.domain}${productPath}" />
`;

        sitemap += `  </url>
`;
      }

      sitemap += `</urlset>`;

      // Write the sitemap to a file
      fs.writeFileSync(path.join(publicDir, `sitemap-products-${domainInfo.locale}.xml`), sitemap);
      console.log(`Generated product sitemap for ${domainInfo.locale}: sitemap-products-${domainInfo.locale}.xml`);
    }

    // Update the sitemap index to include product sitemaps
    const sitemapIndexPath = path.join(publicDir, 'sitemap.xml');
    if (fs.existsSync(sitemapIndexPath)) {
      let sitemapIndex = fs.readFileSync(sitemapIndexPath, 'utf8');
      
      // Check if the sitemap index already contains product sitemaps
      if (!sitemapIndex.includes('sitemap-products-')) {
        // Insert product sitemap entries before the closing tag
        const insertPosition = sitemapIndex.lastIndexOf('</sitemapindex>');
        
        let productSitemapEntries = '';
        for (const [, domainInfo] of Object.entries(domains)) {
          productSitemapEntries += `  <sitemap>
    <loc>${domainInfo.domain}/sitemap-products-${domainInfo.locale}.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
`;
        }
        
        sitemapIndex = sitemapIndex.slice(0, insertPosition) + productSitemapEntries + sitemapIndex.slice(insertPosition);
        
        fs.writeFileSync(sitemapIndexPath, sitemapIndex);
        console.log('Updated sitemap index with product sitemaps');
      }
    }

    console.log('Product sitemap generation completed successfully!');
  } catch (error) {
    console.error('Error generating product sitemaps:', error);
    process.exit(1);
  }
}

// Run the function
generateProductSitemaps();
