import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Fraunces, Inter } from 'next/font/google';
import { ScrollRevealInit } from '@/components/ScrollRevealInit';
import './globals.css';
import './store.css';
import './future.css';
import './premium.css';
import './fashion.css';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { JudgeMeScripts } from '@/components/JudgeMe';
import { TrackingScripts } from '@/components/TrackingScripts';
import { supportEmail } from '@/lib/support';

const sansFont = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const displayFont = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['500', '600'], style: ['normal', 'italic'] });
const golfEnvironmentImage = 'https://images.unsplash.com/photo-1684599995533-3ffecba8fb81?auto=format&fit=crop&w=1800&q=86';

export const metadata: Metadata = {
  metadataBase: new URL('https://wyxgolfsupply.com'),
  applicationName: 'WYX Golf Supply Co.',
  title: { default: 'Modern Golf Apparel & Gear | WYX Golf Supply Co.', template: '%s | WYX Golf Supply Co.' },
  description: 'Modern golf apparel and gear for the course, the trip, and everything after the round. Smaller drops, better pieces, and a sharp WYX point of view.',
  keywords: ['modern golf apparel', 'golf clothing', 'golf layers', 'golf belts', 'golf headwear', 'golf trip gear', 'golf gifts', 'golf accessories'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    siteName: 'WYX Golf Supply Co.',
    type: 'website',
    url: 'https://wyxgolfsupply.com',
    title: 'WYX Golf Supply Co. | Golf, Better Dressed.',
    description: 'A smaller, sharper edit of modern golf apparel, headwear, gloves, headcovers and trip gear.',
    images: [{ url: golfEnvironmentImage, width: 1800, height: 1200, alt: 'Golf bag and cart on a golf course at sunset' }]
  },
  twitter: { card: 'summary_large_image', title: 'WYX Golf Supply Co. | Golf, Better Dressed.', description: 'Modern golf apparel and gear for the course, the trip, and the rest of the day.', images: [golfEnvironmentImage] }
};

export const viewport: Viewport = {
  themeColor: '#f2efe7'
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
              <p>Golf, better dressed.</p>
              <p className="footer-note">First WYX order? <strong>WYX10</strong> requests 10% off when eligible at Shopify checkout.</p>
              <p className="footer-note">Support: <a href={`mailto:${supportEmail}`}>{supportEmail}</a></p>
            </div>
            <nav aria-label="Shop navigation">
              <Link href="/apparel">Apparel</Link>
              <Link href="/products">Shop</Link>
              <Link href="/products?category=Headwear">Headwear</Link>
              <Link href="/products?category=Accessories">Accessories</Link>
              <Link href="/golf-trip-gear">Trip Gear</Link>
              <Link href="/golf-gifts">Gifts</Link>
            </nav>
            <nav aria-label="Company navigation">
              <Link href="/the-bag-test">The WYX Edit</Link>
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
