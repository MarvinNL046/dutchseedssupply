import { NextResponse } from 'next/server';

// Configureer welke paden de middleware moet afhandelen
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// Gebruik een default export in plaats van een named export
export default function middleware() {
  console.log("Middleware is running"); // Check of de middleware überhaupt draait
  return NextResponse.next();
}
