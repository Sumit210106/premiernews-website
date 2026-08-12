import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Premier League News Now | Latest Football News & Updates",
    template: "%s | Premier League News Now"
  },
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
    url: "https://premierleaguenewsnow.com",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://premierleaguenewsnow.com/wp-content/uploads/2026/08/premierleaguenewsnow-favicon.png" sizes="32x32" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white dark:bg-black text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Script 
          src="https://static.smartframe.io/embed.js?ver=1.4.5" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}