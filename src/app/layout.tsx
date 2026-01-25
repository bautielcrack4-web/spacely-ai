import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { SpotlightEffect } from "@/components/ui/spotlight-effect";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SupportModal } from "@/components/SupportModal";
import { SupportProvider } from "@/contexts/SupportContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RoomCraft.app - AI Interior Design",
    template: "%s | RoomCraft.app"
  },
  description: "Rediseña tu casa o jardín en segundos con inteligencia artificial. Sube una foto y transforma tu espacio al instante. Pruébalo gratis.",
  metadataBase: new URL('https://roomcraft.app'),
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: "RoomCraft.app - Diseña tu hogar con IA",
    description: "Sube una foto y mira cómo la IA transforma tu habitación, jardín o fachada en segundos.",
    url: 'https://roomcraft.app',
    siteName: 'RoomCraft',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RoomCraft AI Interior Design Preview',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "RoomCraft.app - AI Interior Design",
    description: "Transforma tu espacio en segundos con IA.",
    images: ['/og-image.jpg'],
  },
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
          <LanguageProvider>
            <SupportProvider>
              <ErrorBoundary>
                <Navbar />
                <main className="min-h-screen">
                  {children}
                </main>
              </ErrorBoundary>
              <SupportModal />
              <Toaster richColors position="bottom-right" />
            </SupportProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
