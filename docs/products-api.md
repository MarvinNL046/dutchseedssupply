# Products API Documentation

This document describes the products database schema and API routes for the Dutch Seed Supply website.

## Database Schema

The products database consists of the following tables:

### Products Table

The main table that stores product information.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  stock_status TEXT NOT NULL DEFAULT 'in_stock', -- in_stock, low_stock, out_of_stock
  featured BOOLEAN DEFAULT false,
  images JSONB DEFAULT '[]'::jsonb,
  thc_content DECIMAL(5, 2),
  cbd_content DECIMAL(5, 2),
  flowering_time INTEGER, -- in days
  height TEXT, -- e.g. "100-150cm"
  yield TEXT, -- e.g. "400-500g/m²"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Product Translations Table

Stores translations for product descriptions in different languages.

```sql
CREATE TABLE product_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL, -- nl, de, fr, en
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, language_code)
);
```

### Categories Table

Stores product categories.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Product Categories Table

Junction table that links products to categories (many-to-many relationship).

```sql
CREATE TABLE product_categories (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);
```

## API Routes

### Products API

#### GET /api/products

Fetches a list of products with pagination, filtering, and sorting.

**Query Parameters:**
- `category` (optional): Filter products by category slug
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of products per page (default: 12)
- `featured` (optional): Filter featured products (true/false)
- `search` (optional): Search products by name

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "sku": "DSS-001",
      "name": "Northern Lights",
      "slug": "northern-lights",
      "price": 29.99,
      "sale_price": null,
      "stock_quantity": 100,
      "stock_status": "in_stock",
      "featured": true,
      "images": [{"url": "northern-lights-1.jpg", "alt": "Northern Lights"}],
      "thc_content": 18.5,
      "cbd_content": 0.2,
      "flowering_time": 56,
      "height": "100-120cm",
      "yield": "450-550g/m²",
      "description": "Northern Lights is one of the most famous indica strains of all time.",
      "meta_title": "Northern Lights Seeds",
      "meta_description": "Buy Northern Lights seeds online.",
      "categories": [
        {
          "id": "uuid",
          "name": "Indica",
          "slug": "indica"
        },
        {
          "id": "uuid",
          "name": "Feminized",
          "slug": "feminized"
        }
      ]
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "totalPages": 9
  }
}
```

#### GET /api/products/[id]

Fetches a single product by ID.

**Response:**
```json
{
  "product": {
    "id": "uuid",
    "sku": "DSS-001",
    "name": "Northern Lights",
    "slug": "northern-lights",
    "price": 29.99,
    "sale_price": null,
    "stock_quantity": 100,
    "stock_status": "in_stock",
    "featured": true,
    "images": [{"url": "northern-lights-1.jpg", "alt": "Northern Lights"}],
    "thc_content": 18.5,
    "cbd_content": 0.2,
    "flowering_time": 56,
    "height": "100-120cm",
    "yield": "450-550g/m²",
    "description": "Northern Lights is one of the most famous indica strains of all time.",
    "meta_title": "Northern Lights Seeds",
    "meta_description": "Buy Northern Lights seeds online.",
    "categories": [
      {
        "id": "uuid",
        "name": "Indica",
        "slug": "indica"
      },
      {
        "id": "uuid",
        "name": "Feminized",
        "slug": "feminized"
      }
    ],
    "translations": {
      "en": {
        "description": "Northern Lights is one of the most famous indica strains of all time.",
        "meta_title": "Northern Lights Seeds",
        "meta_description": "Buy Northern Lights seeds online."
      },
      "nl": {
        "description": "Northern Lights is een van de meest bekende indica-soorten aller tijden.",
        "meta_title": "Northern Lights Zaden",
        "meta_description": "Koop Northern Lights zaden online."
      }
    }
  },
  "relatedProducts": [
    {
      "id": "uuid",
      "name": "White Widow",
      "slug": "white-widow",
      "price": 24.99,
      "sale_price": null,
      "images": [{"url": "white-widow-1.jpg", "alt": "White Widow"}],
      "stock_status": "in_stock"
    }
  ]
}
```

#### POST /api/products (Admin only)

Creates a new product.

**Request Body:**
```json
{
  "sku": "DSS-002",
  "name": "White Widow",
  "slug": "white-widow",
  "price": 24.99,
  "stock_quantity": 50,
  "stock_status": "in_stock",
  "featured": false,
  "images": [{"url": "white-widow-1.jpg", "alt": "White Widow"}],
  "thc_content": 20.0,
  "cbd_content": 0.1,
  "flowering_time": 60,
  "height": "80-120cm",
  "yield": "400-500g/m²",
  "translations": {
    "en": {
      "description": "White Widow is a classic hybrid strain known for its balanced effects.",
      "meta_title": "White Widow Seeds",
      "meta_description": "Buy White Widow seeds online."
    },
    "nl": {
      "description": "White Widow is een klassieke hybride soort bekend om zijn gebalanceerde effecten.",
      "meta_title": "White Widow Zaden",
      "meta_description": "Koop White Widow zaden online."
    }
  },
  "categories": ["uuid-of-hybrid-category", "uuid-of-feminized-category"]
}
```

**Response:**
```json
{
  "product": {
    "id": "uuid",
    "sku": "DSS-002",
    "name": "White Widow",
    "slug": "white-widow",
    "price": 24.99,
    "sale_price": null,
    "stock_quantity": 50,
    "stock_status": "in_stock",
    "featured": false,
    "images": [{"url": "white-widow-1.jpg", "alt": "White Widow"}],
    "thc_content": 20.0,
    "cbd_content": 0.1,
    "flowering_time": 60,
    "height": "80-120cm",
    "yield": "400-500g/m²",
    "created_at": "2025-03-09T14:53:33.000Z",
    "updated_at": "2025-03-09T14:53:33.000Z"
  },
  "message": "Product created successfully"
}
```

#### PUT /api/products/[id] (Admin only)

Updates an existing product.

**Request Body:**
Same as POST /api/products, but only include the fields you want to update.

**Response:**
```json
{
  "product": {
    "id": "uuid",
    "sku": "DSS-002",
    "name": "White Widow",
    "slug": "white-widow",
    "price": 24.99,
    "sale_price": 19.99,
    "stock_quantity": 50,
    "stock_status": "in_stock",
    "featured": false,
    "images": [{"url": "white-widow-1.jpg", "alt": "White Widow"}],
    "thc_content": 20.0,
    "cbd_content": 0.1,
    "flowering_time": 60,
    "height": "80-120cm",
    "yield": "400-500g/m²",
    "created_at": "2025-03-09T14:53:33.000Z",
    "updated_at": "2025-03-09T15:00:00.000Z"
  },
  "message": "Product updated successfully"
}
```

#### DELETE /api/products/[id] (Admin only)

Deletes a product.

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

### Categories API

#### GET /api/categories

Fetches all categories.

**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Indica",
      "slug": "indica",
      "created_at": "2025-03-09T14:53:33.000Z"
    },
    {
      "id": "uuid",
      "name": "Sativa",
      "slug": "sativa",
      "created_at": "2025-03-09T14:53:33.000Z"
    },
    {
      "id": "uuid",
      "name": "Hybrid",
      "slug": "hybrid",
      "created_at": "2025-03-09T14:53:33.000Z"
    },
    {
      "id": "uuid",
      "name": "Autoflowering",
      "slug": "autoflowering",
      "created_at": "2025-03-09T14:53:33.000Z"
    },
    {
      "id": "uuid",
      "name": "Feminized",
      "slug": "feminized",
      "created_at": "2025-03-09T14:53:33.000Z"
    },
    {
      "id": "uuid",
      "name": "CBD",
      "slug": "cbd",
      "created_at": "2025-03-09T14:53:33.000Z"
    }
  ]
}
```

#### POST /api/categories (Admin only)

Creates a new category.

**Request Body:**
```json
{
  "name": "High THC",
  "slug": "high-thc"
}
```

**Response:**
```json
{
  "category": {
    "id": "uuid",
    "name": "High THC",
    "slug": "high-thc",
    "created_at": "2025-03-09T15:00:00.000Z"
  },
  "message": "Category created successfully"
}
```

## Setting Up the Products Database

To set up the products database, run the following script:

```bash
node scripts/setup_products_schema.mjs
```

This script will:
1. Create the necessary tables
2. Set up triggers and functions
3. Configure Row Level Security policies
4. Insert default categories
5. Insert a sample product with translations

## Multilingual Support

The products API supports multiple languages through the `product_translations` table. When fetching products, the API will return the translation for the current locale, which is determined by:

1. The domain extension (.com, .nl, .de, .fr)
2. The NEXT_LOCALE cookie (for localhost and development environments)

The supported languages are:
- English (en) - .com domain
- Dutch (nl) - .nl domain
- German (de) - .de domain
- French (fr) - .fr domain
