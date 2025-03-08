# Homepage Documentation

This document provides an overview of the homepage structure and how to customize it.

## Overview

The homepage is built using a modular block-based approach, with each section implemented as a separate component. This makes it easy to:

1. Reorder sections
2. Add new sections
3. Remove sections
4. Customize individual sections

## Block Structure

The homepage consists of the following blocks, in order:

1. **Hero Section** - Full-width banner with headline and call-to-action
2. **Featured Products** - Carousel showcasing selected products
3. **Categories Grid** - Visual grid of product categories
4. **Benefits Section** - Highlights the advantages of our seeds
5. **Testimonials** - Customer reviews carousel
6. **Growing Guide** - Step-by-step guide with tabs for each growing stage
7. **Newsletter Signup** - Email capture form with promotional offer
8. **FAQ Section** - Accordion of frequently asked questions

## How to Customize

### Reordering Sections

To change the order of sections, edit `app/page.tsx` and reorder the component imports and their placement in the JSX.

### Adding/Removing Sections

To add or remove sections:

1. Edit `app/page.tsx`
2. Add a new component import or remove an existing one
3. Add or remove the component from the JSX

### Customizing Individual Sections

Each section is implemented as a separate component in the `components/home/` directory:

- `HeroSection.tsx` - Main banner with headline and CTA
- `FeaturedProducts.tsx` - Product carousel
- `CategoriesGrid.tsx` - Category display grid
- `BenefitsSection.tsx` - Benefits cards
- `TestimonialsSection.tsx` - Customer reviews
- `GrowingGuide.tsx` - Growing stages tabs
- `NewsletterSignup.tsx` - Email signup form
- `FaqSection.tsx` - FAQ accordion

To customize a section, edit the corresponding component file.

## Adding Images

The homepage requires several images:

1. Hero background image
2. Category images
3. Product images (optional)

See `public/images/README.md` for details on required images and naming conventions.

## Internationalization

All text content in the homepage components supports internationalization. To add or modify translations:

1. Edit `locale/translations.ts`
2. Add or update the text strings in each language section

## Mobile Responsiveness

All homepage sections are fully responsive and will adapt to different screen sizes:

- Desktop (1024px and above)
- Tablet (768px to 1023px)
- Mobile (below 768px)

The layout will automatically adjust based on the device width.

## Performance Considerations

To ensure optimal performance:

1. Optimize all images before adding them to the `public/images/` directory
2. Lazy load components below the fold (already implemented)
3. Use the Network tab in browser DevTools to monitor loading performance

## Shadcn/UI Components

The homepage uses the following Shadcn/UI components:

- Button
- Card
- Carousel
- Accordion
- Tabs
- Form components
- Avatar

If you need to customize the styling of these components, refer to the Shadcn/UI documentation.
