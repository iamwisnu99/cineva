import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cineva — Stream with Comfortable | Original Films & Series',
  description:
    'Cineva is a premiere dark cinematic streaming platform featuring original productions, AI-assisted animated films, and exclusive sci-fi series with direct CDN delivery.',
  keywords: [
    'Cineva',
    'Streaming',
    'Original Films',
    'Sci-Fi',
    'AI Animation',
    'Indie Movies',
    'Stream with Comfortable',
  ],
  authors: [{ name: 'Cineva Studios' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Cineva — Stream with Comfortable',
    description: 'Premiere streaming platform for original films and series.',
    siteName: 'Cineva',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full dark antialiased`}>
      <body className="min-h-full flex flex-col bg-[#07080b] text-[#f8fafc] font-sans">
        {children}
      </body>
    </html>
  );
}
