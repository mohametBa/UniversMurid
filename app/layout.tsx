import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "@/lib/auth/context";
import Navbar from "./components/Navbar";
import ServiceWorker from "./components/ServiceWorker";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import StatusBarConfig from "./components/StatusBarConfig";
import SessionManager from "./components/SessionManager";
import BackgroundEffects from "./components/BackgroundEffects";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Khassida - Les Œuvres de Cheikh Ahmadou Bamba",
  description: "Plateforme spirituelle pour découvrir, lire et écouter les Khassida de Cheikh Ahmadou Bamba dans plusieurs langues",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Univers Murid",
  },
  applicationName: "Khassida",
  keywords: ["Khassidas", "Cheikh Ahmadou Bamba", "spiritualité", "islam", "lecture", "audio"],
  authors: [{ name: "Équipe UniversMurid" }],
};

export const viewport = {
  themeColor: "#1F2937",
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            color-scheme: light dark;
          }
          html {
            scroll-behavior: smooth;
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BackgroundEffects />
          
          <AuthProvider>
            {/* Zone de contenu principal */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <ServiceWorker />
              <PWAInstallPrompt />
              <StatusBarConfig />

              <Navbar />

              {/* Zone de contenu principal */}
              <main className="flex-1">
                {children}
              </main>
            </div>

            {/* Gestionnaire de session - couche supérieure */}
            <SessionManager />
            
            {/* Diagnostic de session - pour le débogage */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}