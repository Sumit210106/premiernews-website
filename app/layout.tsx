import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ThemeProvider } from "../components/ThemeProvider";
import EmbedsRefresher from "@/components/EmbedsRefresher";
import Script from "next/script"; // <-- 1. Import Next.js Script

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://premierleaguenewsnow.com"),
  title: "Premier League News Now | Latest Football News & Updates",
  description: "Stay up to date with the most exciting stories, breaking news, and exclusive insights from the world of football and the Premier League.",
  keywords: ["Premier League", "Football News", "EPL", "Soccer", "Transfer News", "Latest Updates"],
  authors: [{ name: "Premier League News Now" }],
  icons: {
    icon: "https://premierleaguenewsnow.com/wp-content/uploads/2026/08/premierleaguenewsnow-favicon.png",
    apple: "https://premierleaguenewsnow.com/wp-content/uploads/2026/08/premierleaguenewsnow-favicon.png",
  },
  openGraph: {
    title: "Premier League News Now | Latest Football News & Updates",
    description: "Stay up to date with the most exciting stories, breaking news, and exclusive insights from the world of football and the Premier League.",
    url: "/",
    siteName: "Premier League News Now",
    images: [
      {
        url: "https://premierleaguenewsnow.com/wp-content/uploads/2024/05/Bruno-Guimaraes-Arsenal-Transfer.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premier League News Now | Latest Football News & Updates",
    description: "Stay up to date with the most exciting stories, breaking news, and exclusive insights from the world of football and the Premier League.",
    images: ["https://premierleaguenewsnow.com/wp-content/uploads/2024/05/Bruno-Guimaraes-Arsenal-Transfer.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        {/* Google Auto Ads Script loaded lazily to preserve mobile PageSpeed */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3207230642900815" 
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white dark:bg-black text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <EmbedsRefresher />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}