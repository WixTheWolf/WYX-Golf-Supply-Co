import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Archivo, Manrope } from 'next/font/google';
import { ScrollRevealInit } from '@/components/ScrollRevealInit';
import './globals.css';
import './store.css';
import './future.css';
import './premium.css';
import './fashion.css';
import './department-store.css';
import './typography.css';
import './polish.css';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { JudgeMeScripts } from '@/components/JudgeMe';
import { TrackingScripts } from '@/components/TrackingScripts';
import { supportEmail } from '@/lib/support';

const sansFont = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const displayFont = Archivo({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const golfEnvironmentImage = 'https://images.unsplash.com/photo-1684599995533-3ffecba8fb81?auto=format&fit=crop&w=1800&q=86';

export const metadata: Metadata = {
  metadataBase: new URL('https://wyxgolfsupply.com'),
  applicationName: 'WYX Golf Supply Co.',
  title: { default: 'The Coolest Golf Gear, Apparel & Accessories | WYX', template: '%s | WYX Golf Supply Co.' },
  description: 'An opinionated multi-brand golf shop for standout apparel, footwear, golf tech, bags, trip gear, gifts and accessories.',
  keywords: ['golf apparel', 'golf polos', 'golf shorts', 'golf pants', 'golf shoes', 'golf tech', 'golf gadgets', 'golf bags', 'golf trip gear', 'golf gifts', 'golf accessories'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    siteName: 'WYX Golf Supply Co.',
    type: 'website',
    url: 'https://wyxgolfsupply.com',
    title: 'WYX Golf Supply Co. | The Good Stuff in Golf.',
    description: 'A sharp multi-brand edit of golf apparel, footwear, tech, bags, accessories and trip gear.',
    images: [{ url: golfEnvironmentImage, width: 1800, height: 1200, alt: 'Golf bag and cart on a golf course at sunset' }]
  },
  twitter: { card: 'summary_large_image', title: 'WYX Golf Supply Co. | The Good Stuff in Golf.', description: 'The golf products worth knowing about, in one place.', images: [golfEnvironmentImage] }
};

export const viewport: Viewport = {
  themeColor: '#111714'
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
              <p>The good stuff in golf. One sharp edit.</p>
              <p className="footer-note">First WYX order? <strong>WYX10</strong> requests 10% off when eligible at Shopify checkout.</p>
              <p className="footer-note">Support: <a href={`mailto:${supportEmail}`}>{supportEmail}</a></p>
            </div>
            <nav aria-label="Shop navigation">
              <Link href="/products">Shop All</Link>
              <Link href="/apparel">Apparel</Link>
              <Link href="/products?category=Golf%20Tech">Golf Tech</Link>
              <Link href="/products?category=Bags">Bags</Link>
              <Link href="/products?category=Accessories">Accessories</Link>
              <Link href="/golf-trip-gear">Trip Gear</Link>
            </nav>
            <nav aria-label="Company navigation">
              <Link href="/the-bag-test">How WYX Picks</Link>
              <Link href="/golf-gifts">Gifts</Link>
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
