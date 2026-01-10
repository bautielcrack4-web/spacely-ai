import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { SpotlightEffect } from "@/components/ui/spotlight-effect";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0A0A0A]`}>
        <div className="aurora-container" aria-hidden="true">
          <div className="aurora-blob-1" />
          <div className="aurora-blob-2" />
          <div className="aurora-blob-3" />
        </div>
        <SpotlightEffect />
        <div className="relative z-0">
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
