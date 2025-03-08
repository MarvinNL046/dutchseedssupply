import { NextRequest, NextResponse } from 'next/server';

// Configureer welke paden de middleware moet afhandelen
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export default function middleware(request: NextRequest) {
  try {
    // Log de request voor debugging
    console.log(`Processing request for: ${request.nextUrl.pathname}`);
    
    // Gewoon doorgaan met de request zonder wijzigingen
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    
    // Return een meer informatieve error response
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Middleware error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
