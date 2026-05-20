import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, Inter, IBM_Plex_Mono } from 'next/font/google';
import clsx from 'clsx';
import Nav from '@/components/Nav/Nav';
import Footer from '@/components/Footer/Footer';
import '@/app/styles/globals.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-display-loaded',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif-loaded',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans-loaded',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-mono-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  ),
  title: {
    default: 'Patek Philippe Equation of Time Archive',
    template: '%s — Patek Philippe Equation of Time Archive',
  },
  description:
    'A scholarly census of all known Patek Philippe pocket watches bearing the équation du temps complication, from 1865 through the Star Calibre 2000.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Patek Philippe Equation of Time Archive',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={clsx(
        playfairDisplay.variable,
        cormorantGaramond.variable,
        inter.variable,
        ibmPlexMono.variable,
      )}
    >
      <body>
        <div className="site">
          <Nav />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
