import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";

const notoSans = Noto_Sans({variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://primesolar.co.za'), // Update with your actual domain
  title: {
    default: 'PrimeSolar - Solar Panel Installation & Energy Solutions in South Africa',
    template: '%s | PrimeSolar'
  },
  description: 'Get instant solar panel quotes and estimates for your home in South Africa. Compare solar panels, batteries, and BMS options. Calculate savings and reduce your carbon footprint with PrimeSolar.',
  keywords: ['solar panels South Africa', 'solar installation', 'solar energy', 'battery storage', 'solar quote', 'renewable energy', 'solar configurator', 'BMS', 'solar savings calculator'],
  authors: [{ name: 'PrimeSolar' }],
  creator: 'PrimeSolar',
  publisher: 'PrimeSolar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://primesolar.co.za',
    siteName: 'PrimeSolar',
    title: 'PrimeSolar - Solar Panel Installation & Energy Solutions in South Africa',
    description: 'Get instant solar panel quotes and estimates for your home in South Africa. Calculate your savings and go green with PrimeSolar.',
    images: [
      {
        url: '/og-image.jpg', // Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: 'PrimeSolar - Solar Energy Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrimeSolar - Solar Panel Installation & Energy Solutions',
    description: 'Get instant solar panel quotes and estimates for your home in South Africa.',
    images: ['/twitter-image.jpg'], // Create this image (1200x600px)
    creator: '@primesolar', // Update with your Twitter handle
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
    google: 'your-google-verification-code', // Add after setting up Google Search Console
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: 'https://primesolar.co.za',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSans.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <NuqsAdapter>
          <Header />
          {children}
          <Footer />
           <Toaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}