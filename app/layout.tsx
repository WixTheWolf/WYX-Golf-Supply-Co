import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import { Suspense } from 'react';
import { ScrollRevealInit } from '@/components/ScrollRevealInit';
import './globals.css';
import './store.css';
import './future.css';
import './premium.css';
import './fashion.css';
import './department-store.css';
import './typography.css';
import './polish.css';
import './luxury.css';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { JudgeMeScripts } from '@/components/JudgeMe';
import { TrackingScripts } from '@/components/TrackingScripts';
import { RouteViewTracker } from '@/components/RouteViewTracker';
import { TrustBar } from '@/components/TrustBar';
import { MotionProvider, PageTransition } from '@/components/MotionProvider';
import { supportEmail } from '@/lib/support';

const golfEnvironmentImage = 'https://images.unsplash.com/photo-1684599995533-3ffecba8fb81?auto=format&fit=crop&w=1800&q=86';

const wyxDisplay = localFont({
  src: '../public/fonts/wyx-display-condensed.otf',
  variable: '--font-wyx-display',
  display: 'swap',
  preload: true
});

const wyxSans = localFont({
  src: [
    { path: '../public/fonts/wyx-sans-regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/wyx-sans-bold.otf', weight: '700', style: 'normal' }
  ],
  variable: '--font-wyx-sans',
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  metadataBase: new URL('https://wyxgolfsupply.com'),
  applicationName: 'WYX Golf Supply Co.',
  title: { default: 'Premium Golf Apparel, Headcovers & Accessories | WYX', template: '%s' },
  description: 'A sharp multi-brand golf edit of apparel, headcovers, gloves, trip gear, gifts and accessories worth owning.',
  keywords: ['golf apparel', 'golf headcovers', 'golf gloves', 'golf trip gear', 'golf gifts', 'golf accessories', 'premium golf gear'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    siteName: 'WYX Golf Supply Co.',
    type: 'website',
    url: 'https://wyxgolfsupply.com',
    title: 'WYX Golf Supply Co. | The Good Stuff in Golf.',
    description: 'A sharp multi-brand edit of golf apparel, headcovers, gloves, accessories and trip gear.',
    images: [{ url: golfEnvironmentImage, width: 1800, height: 1200, alt: 'Golf bag and cart on a golf course at sunset' }]
  },
  twitter: { card: 'summary_large_image', title: 'WYX Golf Supply Co. | The Good Stuff in Golf.', description: 'The golf products worth knowing about, in one place.', images: [golfEnvironmentImage] }
};

export const viewport: Viewport = {
  themeColor: '#111714'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${wyxDisplay.variable} ${wyxSans.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <ScrollRevealInit />
        <SeoJsonLd />
        <TrackingScripts />
        <Suspense fallback={null}><RouteViewTracker /></Suspense>
        <JudgeMeScripts />
        <MotionProvider>
          <CartProvider>
            <Header />
            <main id="main-content"><PageTransition>{children}</PageTransition></main>
            <TrustBar compact />
            <footer className="lux-footer">
              <div className="lux-footer__lead">
                <Link className="lux-footer__brand" href="/">WYX<span>Golf Supply Co.</span></Link>
                <p>Golf&apos;s good stuff.<br />One sharp edit.</p>
              </div>
              <nav aria-label="Shop navigation">
                <strong>Shop</strong>
                <Link href="/products">The Current Edit</Link>
                <Link href="/apparel">Apparel</Link>
                <Link href="/golf-headcovers">Headcovers</Link>
                <Link href="/products?category=Accessories">Accessories</Link>
                <Link href="/golf-trip-gear">Trip Gear</Link>
              </nav>
              <nav aria-label="Company navigation">
                <strong>WYX</strong>
                <Link href="/about">About</Link>
                <Link href="/journal">The Edit</Link>
                <Link href="/the-bag-test">The Standard</Link>
                <Link href="/shipping-returns">Shipping & Returns</Link>
                <Link href="/faq">FAQ</Link>
                <a href={`mailto:${supportEmail}`}>Contact</a>
              </nav>
              <div className="lux-footer__fine">
                <p>© {new Date().getFullYear()} WYX Golf Supply Co.</p>
                <p>Secure checkout by Shopify · WYX10 for eligible first orders.</p>
                <Link href="/privacy">Privacy</Link>
              </div>
            </footer>
          </CartProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
