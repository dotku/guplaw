import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PayPalProvider from "@/components/PayPalProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GPULaw - AI-Powered Legal Assistance | Attorney Network",
  description: "GPULaw combines advanced AI legal assistance with licensed attorneys. Get instant legal guidance across Family Law, Consumer & Debt, Housing, Immigration, and more. 24/7 AI support with attorney consultation available.",
  keywords: ["legal AI", "attorney consultation", "legal assistance", "AI lawyer", "legal help", "family law", "immigration lawyer", "consumer debt", "GPULaw"],
  authors: [{ name: "GPULaw Technologies, Inc." }],
  creator: "GPULaw Technologies, Inc.",
  publisher: "GPULaw Technologies, Inc.",
  applicationName: "GPULaw",
  generator: "Next.js",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "GPULaw - AI-Powered Legal Assistance",
    description: "Affordable legal membership combining AI tools with experienced attorneys",
    url: '/',
    siteName: "GPULaw",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPULaw - AI-Powered Legal Assistance",
    description: "Get instant legal guidance with AI + attorney access",
    creator: "@gpulaw",
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e40af' },
    { media: '(prefers-color-scheme: dark)', color: '#1e3a8a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PayPalProvider>
          {children}
        </PayPalProvider>
      </body>
    </html>
  );
}
