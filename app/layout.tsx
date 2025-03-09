import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dutch Seed Supply",
  description: "Premium cannabis zaden voor de Nederlandse markt",
  alternates: {
    canonical: 'https://dutchseedsupply.nl',
    languages: {
      'nl': 'https://dutchseedsupply.nl',
      'en': 'https://dutchseedsupply.com',
      'de': 'https://dutchseedsupply.de',
      'fr': 'https://dutchseedsupply.fr',
    },
  },
};

// Import cookies function
import { cookies } from 'next/headers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the locale from the cookie set by middleware
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'nl'; // Default to Dutch
  
  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <ClientProviders>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
