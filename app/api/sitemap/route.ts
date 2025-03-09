import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API route to serve sitemap files dynamically
 * 
 * This allows us to serve the latest sitemap files without having to rebuild the entire application.
 * It also enables us to generate sitemaps on-demand if needed.
 */
export async function GET(request: NextRequest) {
  try {
    // Get the sitemap type from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'index';
    const locale = searchParams.get('locale') || 'en';
    
    // Determine the sitemap file path based on the type and locale
    let filePath = '';
    
    if (type === 'index') {
      filePath = path.join(process.cwd(), 'public', 'sitemap.xml');
    } else if (type === 'products') {
      filePath = path.join(process.cwd(), 'public', `sitemap-products-${locale}.xml`);
    } else {
      filePath = path.join(process.cwd(), 'public', `sitemap-${locale}.xml`);
    }
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Sitemap not found' },
        { status: 404 }
      );
    }
    
    // Read the sitemap file
    const sitemap = fs.readFileSync(filePath, 'utf8');
    
    // Return the sitemap as XML
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error serving sitemap:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
