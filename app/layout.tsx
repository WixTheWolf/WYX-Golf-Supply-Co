import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { ScrollRevealInit } from '@/components/ScrollRevealInit';
import './globals.css';
import './store.css';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { TrackingScripts } from '@/components/TrackingScripts';
import { supportEmail } from '@/lib/support';

const sansFont = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://wyxgolfsupply.com'),
  applicationName: 'WYX Golf Supply Co.',
  title: { default: 'WYX Golf Supply Co. | Golf Hats, Apparel, Tech & Practice Gear', template: '%s | WYX Golf Supply Co.' },
  description: 'Curated golf hats, apparel, tech, practice gear, and swing correction tools for weekend players.',
  keywords: ['golf hats', 'golf apparel', 'golf tech', 'golf training aids', 'swing correction', 'golf gifts', 'golf accessories'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    siteName: 'WYX Golf Supply Co.',
    type: 'website',
    url: 'https://wyxgolfsupply.com',
    title: 'WYX Golf Supply Co.',
    description: 'Golf hats, apparel, tech, practice gear, and swing correction — curated and organized.',
    images: [{ url: '/images/hero-coastal-fairway.png', width: 1200, height: 630, alt: 'WYX Golf Supply Co.' }]
  },
  twitter: { card: 'summary_large_image', title: 'WYX Golf Supply Co.', description: 'Curated golf hats, apparel, tech, and practice gear.', images: ['/images/hero-coastal-fairway.png'] }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sansFont.variable}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <ScrollRevealInit />
        <SeoJsonLd />
        <TrackingScripts />
        <CartProvider>
          <Header />
          <main id="main-content">{children}</main>
          <footer className="site-footer">
            <div>
              <Link className="footer-brand" href="/">WYX <span>Golf Co.</span></Link>
              <p>Curated golf hats, apparel, tech, practice gear, and swing correction.</p>
              <p className="footer-note">Use <strong>WYX10</strong> for 10% off your first order.</p>
              <p className="footer-note">Support: <a href={`mailto:${supportEmail}`}>{supportEmail}</a></p>
            </div>
            <nav aria-label="Footer navigation">
              <Link href="/golf-hats">Hats</Link>
              <Link href="/golf-apparel">Apparel</Link>
              <Link href="/golf-tech">Tech</Link>
              <Link href="/golf-training-aids">Practice</Link>
              <Link href="/swing-correction">Swing</Link>
              <Link href="/products">Shop</Link>
            </nav>
            <nav aria-label="Company navigation">
              <Link href="/shipping-returns">Shipping</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy</Link>
            </nav>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}