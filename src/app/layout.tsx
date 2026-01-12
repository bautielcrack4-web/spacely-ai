import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { SpotlightEffect } from "@/components/ui/spotlight-effect";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spacely AI - Rediseño de interiores con IA",
  description: "Rediseña tu casa o jardín en segundos con inteligencia artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FAFBFC]`}>
        {/* <div className="aurora-container" aria-hidden="true">
          <div className="aurora-blob-1" />
          <div className="aurora-blob-2" />
          <div className="aurora-blob-3" />
        </div> */}
        {/* SpotlightEffect removed as it's for dark mode usually */}
        {/* <SpotlightEffect /> */}
        <div className="relative z-0">
          <ErrorBoundary>
            <LanguageProvider>
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <Toaster richColors position="bottom-right" />
            </LanguageProvider>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
