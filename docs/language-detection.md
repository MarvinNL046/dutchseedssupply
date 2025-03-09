# Language Detection and Internationalization

This document explains how language detection works in the Dutch Seed Supply website and how to set up the domains for production.

## Overview

The website supports multiple languages through domain-based language detection. Each language has its own top-level domain (TLD):

- Dutch (nl): dutchseedsupply.nl
- English (en): dutchseedsupply.com
- German (de): dutchseedsupply.de
- French (fr): dutchseedsupply.fr

## How Language Detection Works

The language detection logic is implemented in the `utils/domain-middleware.ts` file. Here's how it works:

1. **Domain-based detection**: The primary method of language detection is based on the domain's TLD. For example, if a user visits `dutchseedsupply.nl`, they will see the Dutch version of the website.

2. **Browser language detection**: On development environments (localhost, vercel.app), the system first checks for a language cookie. If no cookie is found, it tries to detect the user's preferred language from their browser's `Accept-Language` header.

3. **Fallback**: If no language can be determined, the system defaults to Dutch (nl).

## Language Switching

Users can switch languages using the language switcher component in the navigation bar and footer. When a user switches languages:

1. The system redirects them to the appropriate domain (e.g., from dutchseedsupply.nl to dutchseedsupply.com)
2. The language preference is stored in a cookie for future visits

## Setting Up Domains for Production

To ensure the language detection works correctly in production, follow these steps:

1. **DNS Configuration**:
   - Configure all domains (dutchseedsupply.nl, dutchseedsupply.com, dutchseedsupply.de, dutchseedsupply.fr) to point to your hosting provider
   - Set up proper A records or CNAME records as required by your hosting provider

2. **SSL Certificates**:
   - Obtain SSL certificates for all domains
   - Configure your hosting provider to use these certificates

3. **Hosting Configuration**:
   - Configure your hosting provider to accept requests for all domains
   - Ensure that all domains serve the same application

4. **Vercel Configuration** (if using Vercel):
   - Add all domains in the Vercel dashboard under your project's "Domains" settings
   - Vercel will automatically handle SSL certificates

## Testing Language Detection

A test script is provided to verify that language detection works correctly:

```bash
node scripts/test_language_detection.mjs
```

This script simulates requests from different domains and with different browser languages to ensure the language detection logic works as expected.

## SEO Considerations

The website includes proper `hreflang` tags in the HTML head to help search engines understand the relationship between the different language versions of the website. These tags are added in the `app/layout.tsx` file.

Example:

```html
<link rel="alternate" hreflang="nl" href="https://dutchseedsupply.nl" />
<link rel="alternate" hreflang="en" href="https://dutchseedsupply.com" />
<link rel="alternate" hreflang="de" href="https://dutchseedsupply.de" />
<link rel="alternate" hreflang="fr" href="https://dutchseedsupply.fr" />
```

## Troubleshooting

If language detection is not working correctly:

1. Check that the domains are properly configured and pointing to the correct server
2. Verify that the middleware is correctly detecting the domain
3. Clear browser cookies and try again
4. Run the test script to verify the language detection logic
