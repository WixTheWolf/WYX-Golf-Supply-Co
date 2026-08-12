import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Fraunces, Inter } from 'next/font/google';
import { ScrollRevealInit } from '@/components/ScrollRevealInit';
import './globals.css';
import './store.css';
import './future.css';
import './premium.css';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { JudgeMeScripts } from '@/components/JudgeMe';
import { TrackingScripts } from '@/components/TrackingScripts';
import { supportEmail } from '@/lib/support';

const sansFont = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const displayFont = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['500', '600'], style: ['normal', 'italic'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://wyxgolfsupply.com'),
  applicationName: 'WYX Golf Supply Co.',
  title: { default: 'Modern Golf Gear, Gifts & Bag Upgrades | WYX Golf Supply Co.', template: '%s | WYX Golf Supply Co.' },
  description: 'A tight edit of modern golf gear, gifts, headcovers, gloves, trip gear and bag upgrades selected for real rounds. Less golf shop. More gear drop.',
  keywords: ['modern golf gear', 'golf headcovers', 'golf trip gear', 'golf gifts', 'golf grips', 'golf bag accessories', 'golf gloves'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    siteName: 'WYX Golf Supply Co.',
    type: 'website',
    url: 'https://wyxgolfsupply.com',
    title: 'WYX Golf Supply Co. | Less Golf Shop. More Gear Drop.',
    description: 'Modern golf gear, gifts, trip gear and bag upgrades selected to earn a place in the bag.',
    images: [{ url: '/images/boys-weekend-hero.png', width: 1536, height: 1024, alt: 'WYX Golf Supply Co.' }]
  },
  twitter: { card: 'summary_large_image', title: 'WYX Golf Supply Co. | Less Golf Shop. More Gear Drop.', description: 'A hard edit of modern golf gear for the bag, the trip, and the round.', images: ['/images/boys-weekend-hero.png'] }
};

export const viewport: Viewport = {
  themeColor: '#0a110d'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sansFont.variable} ${displayFont.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <ScrollRevealInit />
        <SeoJsonLd />
        <TrackingScripts />
        <JudgeMeScripts />
        <CartProvider>
          <Header />
          <main id="main-content">{children}</main>
          <footer className="site-footer">
            <div>
              <Link className="footer-brand" href="/">WYX <span>Golf Supply</span></Link>
              <p>Less golf shop. More gear drop.</p>
              <p className="footer-note">First WYX order? <strong>WYX10</strong> requests 10% off when eligible at Shopify checkout.</p>
              <p className="footer-note">Support: <a href={`mailto:${supportEmail}`}>{supportEmail}</a></p>
            </div>
            <nav aria-label="Shop navigation">
              <Link href="/products">Drop 01</Link>
              <Link href="/weekend-golfer-bag-upgrade-kit">The Kit</Link>
              <Link href="/golf-trip-gear">Trip Gear</Link>
              <Link href="/golf-gifts">Gifts</Link>
              <Link href="/the-bag-test">Bag Test</Link>
            </nav>
            <nav aria-label="Company navigation">
              <Link href="/shipping-returns">Shipping & Returns</Link>
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
