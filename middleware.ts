import { NextRequest, NextResponse } from 'next/server';
import { geolocation } from '@vercel/functions';

// Configureer welke paden de middleware moet afhandelen
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export default function middleware(request: NextRequest) {
  try {
    // Log de request voor debugging
    console.log(`Processing request for: ${request.nextUrl.pathname}`);
    
    // Haal geolocatie informatie op (werkt alleen in productie)
    const { country = 'Unknown' } = geolocation(request);
    console.log(`Request from country: ${country}`);
    
    // Voeg custom headers toe met geolocatie informatie
    const response = NextResponse.next();
    response.headers.set('x-country', country);
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // Return een meer informatieve error response
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Middleware error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
