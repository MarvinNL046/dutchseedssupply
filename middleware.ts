import { NextResponse } from 'next/server';

// Minimale middleware functie die niets doet behalve de request doorsturen
export function middleware() {
  // Gewoon de request doorsturen zonder wijzigingen
  return NextResponse.next();
}

// Configureer welke paden de middleware moet afhandelen
// We gebruiken een patroon dat geen enkele route matcht
export const config = {
  matcher: ['/api/___dummy___route___that___does___not___exist___'],
};
