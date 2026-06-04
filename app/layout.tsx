import type { Metadata } from 'next';
import Link from 'next/link';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import './promo.css';
import './kits.css';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { TrackingScripts } from '@/components/TrackingScripts';
import { supportEmail } from '@/lib/support';

const displayFont = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const sansFont = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://wyx-golf-supply-co.vercel.app'),
  title: { default: 'WYX Golf Co. | Golf Gifts, Trip Kits & Bag Gear', template: '%s | WYX Golf Co.' },
  description: 'Shop golf gifts, trip kits, and bag gear with personality for weekend players, golf dads, bachelor parties, scramble teams, and gift shoppers.',
  keywords: ['golf gifts', 'golf trip gear', 'golf gifts under 60', 'golf dad gifts', 'bachelor party golf gifts', 'golf bag upgrades', 'golf towels', 'golf ball markers'],
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'WYX Golf Co.',
    type: 'website',
    title: 'WYX Golf Co. | Golf Gifts, Trip Kits & Bag Gear',
    description: 'Useful, funny, and gift-ready golf gear for the boys, the trip, and the bag.',
    images: ['/images/hero-coastal-fairway.png']
  },
  twitter: { card: 'summary_large_image', images: ['/images/hero-coastal-fairway.png'] }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}><body><SeoJsonLd /><TrackingScripts /><CartProvider><Header /><main>{children}</main><footer className="site-footer"><div><Link className="footer-brand" href="/">WYX <span>Golf Co.</span></Link><p>Golf gifts, trip kits, and bag gear with personality.</p><p className="footer-note">Use <strong>WYX10</strong> at checkout for 10% off your first order.</p><p className="footer-note">Support: <a href={`mailto:${supportEmail}`}>{supportEmail}</a></p></div><nav aria-label="Footer navigation"><Link href="/golf-gifts">Golf Gifts</Link><Link href="/golf-trip-gear">Trip Gear</Link><Link href="/bag-upgrades">Bag Upgrades</Link><Link href="/golf-gifts-for-dad">Dad Gifts</Link></nav></footer></CartProvider></body></html>;
}
