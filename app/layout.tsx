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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We gebruiken een vaste taal in plaats van cookies() om problemen te voorkomen
  const locale = "nl";
  
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
