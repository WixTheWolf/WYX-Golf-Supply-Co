import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Fraunces, Inter } from 'next/font/google';
import { ScrollRevealInit } from '@/components/ScrollRevealInit';
import './globals.css';
import './store.css';
import { CartProvider } from '@/components/CartProvider';
import { EmailSlideIn } from '@/components/EmailSlideIn';
import { Header } from '@/components/Header';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { TrackingScripts } from '@/components/TrackingScripts';
import { supportEmail } from '@/lib/support';

const sansFont = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const displayFont = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['500', '600'], style: ['normal', 'italic'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://wyxgolfsupply.com'),
  applicationName: 'WYX Golf Supply Co.',
  title: { default: 'WYX Golf Supply Co. | Practical Golf Gifts & Bag Upgrades', template: '%s | WYX Golf Supply Co.' },
  description: 'Practical golf gifts, trip gear, and bag upgrades for weekend golfers. Every product passes The Bag Test. WYX10 saves 10% on your first order.',
  keywords: ['golf gifts', 'golf gifts for dad', 'golf trip gear', 'golf bag accessories', 'bachelor party golf gifts', 'scramble prizes', 'golf gifts under 60'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    siteName: 'WYX Golf Supply Co.',
    type: 'website',
    url: 'https://wyxgolfsupply.com',
    title: 'WYX Golf Supply Co.',
    description: 'Practical golf gifts, trip gear, and bag upgrades for weekend golfers — picked using The Bag Test.',
    images: [{ url: '/images/hero-coastal-fairway.png', width: 1200, height: 630, alt: 'WYX Golf Supply Co.' }]
  },
  twitter: { card: 'summary_large_image', title: 'WYX Golf Supply Co.', description: 'Practical golf gifts and bag upgrades that pass The Bag Test.', images: ['/images/hero-coastal-fairway.png'] }
};

export const viewport: Viewport = {
  themeColor: '#10271e'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sansFont.variable} ${displayFont.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <ScrollRevealInit />
        <SeoJsonLd />
        <TrackingScripts />
        <CartProvider>
          <Header />
          <main id="main-content">{children}</main>
          <EmailSlideIn />
          <footer className="site-footer">
            <div>
              <Link className="footer-brand" href="/">WYX <span>Golf Co.</span></Link>
              <p>Practical golf gear that earns a spot in the bag.</p>
              <p className="footer-note">Use <strong>WYX10</strong> for 10% off your first order.</p>
              <p className="footer-note">Support: <a href={`mailto:${supportEmail}`}>{supportEmail}</a></p>
            </div>
            <nav aria-label="Footer navigation">
              <Link href="/weekend-golfer-bag-upgrade-kit">The Kit</Link>
              <Link href="/golf-gifts">Golf Gifts</Link>
              <Link href="/golf-gifts-for-dad">Dad Gifts</Link>
              <Link href="/golf-trip-gear">Trip Gear</Link>
              <Link href="/the-bag-test">The Bag Test</Link>
              <Link href="/products">Shop All</Link>
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