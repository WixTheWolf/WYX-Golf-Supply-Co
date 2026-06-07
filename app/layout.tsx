import type { Metadata } from 'next';
import Link from 'next/link';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import './promo.css';
import './kits.css';
import './seo-commerce.css';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { TrackingScripts } from '@/components/TrackingScripts';
import { supportEmail } from '@/lib/support';

const displayFont = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const sansFont = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://wyxgolfsupply.com'),
  applicationName: 'WYX Golf Supply Co.',
  title: { default: 'WYX Golf Supply Co. | Golf Gifts, Hats, Apparel & Bag Gear', template: '%s | WYX Golf Supply Co.' },
  description: 'Shop curated golf gifts, hats, apparel, trip gear, golf accessories, and bag upgrades for weekend golfers, dads, bachelor parties, scramble teams, and golf trips.',
  keywords: ['golf gifts', 'golf trip gear', 'golf hats', 'golf apparel', 'golf gifts under 60', 'golf dad gifts', 'bachelor party golf gifts', 'golf bag upgrades', 'golf towels', 'golf ball markers', 'golf accessories'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    siteName: 'WYX Golf Supply Co.',
    type: 'website',
    url: 'https://wyxgolfsupply.com',
    title: 'WYX Golf Supply Co. | Golf Gifts, Hats, Apparel & Bag Gear',
    description: 'Useful, gift-ready golf gear for the boys, the trip, and the bag.',
    images: [{ url: '/images/hero-coastal-fairway.png', width: 1200, height: 630, alt: 'WYX Golf Supply Co. curated golf gear' }]
  },
  twitter: { card: 'summary_large_image', title: 'WYX Golf Supply Co.', description: 'Curated golf gifts, trip gear, hats, apparel, and bag upgrades.', images: ['/images/hero-coastal-fairway.png'] }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}><body><SeoJsonLd /><TrackingScripts /><CartProvider><Header /><main>{children}</main><footer className="site-footer"><div><Link className="footer-brand" href="/">WYX <span>Golf Co.</span></Link><p>Golf gifts, hats, apparel, trip kits, and bag gear with personality.</p><p className="footer-note">Use <strong>WYX10</strong> at checkout for 10% off your first order.</p><p className="footer-note">Support: <a href={`mailto:${supportEmail}`}>{supportEmail}</a></p></div><nav aria-label="Footer navigation"><Link href="/golf-gifts">Golf Gifts</Link><Link href="/golf-trip-gear">Trip Gear</Link><Link href="/products?category=Headwear">Hats</Link><Link href="/products?category=Apparel">Apparel</Link><Link href="/bag-upgrades">Bag Upgrades</Link><Link href="/kits/dad-gift-kit">Dad Kit</Link><Link href="/kits/golf-trip-kit">Trip Kit</Link><Link href="/golf-gifts-for-dad">Dad Gifts</Link></nav></footer></CartProvider></body></html>;
}
