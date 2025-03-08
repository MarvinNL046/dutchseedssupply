import { NextResponse } from 'next/server';

// Configureer welke paden de middleware moet afhandelen
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export default function middleware() {
  // Zeer eenvoudige middleware zonder omgevingsvariabelen of complexe logica
  // Dit zou het "No fetch event listeners found" probleem moeten oplossen
  return NextResponse.next();
}
