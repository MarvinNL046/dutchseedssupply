# SEO and Sitemaps Documentation

This document outlines the SEO strategy and sitemap implementation for the Dutch Seed Supply website.

## Sitemap Implementation

The website uses a comprehensive sitemap strategy to ensure optimal indexing by search engines across all supported languages.

### Sitemap Structure

1. **Main Sitemap Index**: `sitemap.xml`
   - Acts as an index pointing to all language-specific sitemaps
   - Located at the root of each domain (e.g., `https://www.dutchseedsupply.nl/sitemap.xml`)

2. **Language-Specific Sitemaps**:
   - `sitemap-nl.xml` - Dutch pages
   - `sitemap-en.xml` - English pages
   - `sitemap-de.xml` - German pages
   - `sitemap-fr.xml` - French pages

3. **Product Sitemaps**:
   - `sitemap-products-nl.xml` - Dutch product pages
   - `sitemap-products-en.xml` - English product pages
   - `sitemap-products-de.xml` - German product pages
   - `sitemap-products-fr.xml` - French product pages

### Sitemap Generation

Sitemaps are generated automatically during the build process using two Node.js scripts:

1. **`scripts/generate-sitemaps.mjs`**:
   - Generates the main sitemap index and language-specific sitemaps for static pages
   - Creates a robots.txt file if it doesn't exist

2. **`scripts/generate-product-sitemaps.mjs`**:
   - Fetches product data from the Supabase database
   - Generates language-specific sitemaps for product pages
   - Updates the sitemap index to include product sitemaps

These scripts are executed automatically before each build via the `prebuild` script in `package.json`.

### Dynamic Sitemap Access

In addition to the static sitemap files, a dynamic API route is available at `/api/sitemap` to serve the latest sitemap files:

- `/api/sitemap?type=index` - Serves the main sitemap index
- `/api/sitemap?type=products&locale=en` - Serves the English product sitemap
- `/api/sitemap?type=static&locale=nl` - Serves the Dutch static pages sitemap

This allows for on-demand sitemap generation and access without requiring a full site rebuild.

## Multilingual SEO Implementation

### Hreflang Annotations

All sitemaps include `hreflang` annotations to indicate language alternatives for each page:

```xml
<url>
  <loc>https://www.dutchseedsupply.nl/products/</loc>
  <xhtml:link rel="alternate" hreflang="nl" href="https://www.dutchseedsupply.nl/products/" />
  <xhtml:link rel="alternate" hreflang="en" href="https://www.dutchseedsupply.com/products/" />
  <xhtml:link rel="alternate" hreflang="de" href="https://www.dutchseedsupply.de/products/" />
  <xhtml:link rel="alternate" hreflang="fr" href="https://www.dutchseedsupply.fr/products/" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://www.dutchseedsupply.com/products/" />
</url>
```

This helps search engines understand the relationship between different language versions of the same page.

### Domain-Based Language Detection

The website uses domain-based language detection via middleware:

- `dutchseedsupply.nl` - Dutch content
- `dutchseedsupply.com` - English content
- `dutchseedsupply.de` - German content
- `dutchseedsupply.fr` - French content

This approach is preferred over subdirectories or query parameters for SEO purposes.

## SEO Best Practices

### Metadata

Each page should include appropriate metadata:

```tsx
export const metadata = {
  title: 'Page Title | Dutch Seed Supply',
  description: 'Concise description of the page content.',
};
```

### Semantic HTML

Use semantic HTML elements to improve accessibility and SEO:

- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Proper heading hierarchy (`<h1>` through `<h6>`)

### Image Optimization

Use Next.js `<Image>` component for automatic image optimization:

```tsx
import Image from 'next/image';

<Image 
  src="/path/to/image.jpg" 
  alt="Descriptive alt text" 
  width={800} 
  height={600} 
/>
```

### Performance Optimization

- Minimize JavaScript bundle size
- Use server components where possible
- Implement lazy loading for below-the-fold content

## Robots.txt Configuration

The `robots.txt` file is automatically generated and includes references to all sitemaps:

```
# robots.txt for Dutch Seed Supply
User-agent: *
Allow: /

# Sitemaps
Sitemap: https://www.dutchseedsupply.nl/sitemap.xml
Sitemap: https://www.dutchseedsupply.com/sitemap.xml
Sitemap: https://www.dutchseedsupply.de/sitemap.xml
Sitemap: https://www.dutchseedsupply.fr/sitemap.xml
```

## Maintenance and Updates

To update the sitemaps:

1. Run `npm run generate-sitemaps` to regenerate the static page sitemaps
2. Run `npm run generate-product-sitemaps` to regenerate the product sitemaps

These commands are automatically run during the build process, but can be run manually if needed.

When adding new pages to the website, update the `pages` array in `scripts/generate-sitemaps.mjs` to include the new pages.
