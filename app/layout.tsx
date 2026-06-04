import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import './promo.css';
import './kits.css';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { TrackingScripts } from '@/components/TrackingScripts';
import { supportEmail } from '@/lib/support';

export const metadata: Metadata = {
  metadataBase: new URL('https://wyx-golf-supply-co.vercel.app'),
  title: { default: 'WYX Golf Supply Co. | Golf Gifts, Trip Gear & Bag Upgrades', template: '%s | WYX Golf Supply Co.' },
  description: 'Shop golf gifts, trip gear, and useful bag upgrades for weekend players, golf dads, bachelor parties, scramble teams, and gift shoppers.',
  keywords: ['golf gifts', 'golf trip gear', 'golf gifts under 60', 'golf dad gifts', 'bachelor party golf gifts', 'golf bag upgrades', 'golf towels', 'golf ball markers'],
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'WYX Golf Supply Co.',
    type: 'website',
    title: 'WYX Golf Supply Co. | Golf Gifts, Trip Gear & Bag Upgrades',
    description: 'Useful golf gear for the round, the trip, and the guys who make both memorable.',
    images: ['/images/hero-coastal-fairway.png']
  },
  twitter: { card: 'summary_large_image', images: ['/images/hero-coastal-fairway.png'] }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><SeoJsonLd /><TrackingScripts /><CartProvider><Header /><main>{children}</main><footer className="site-footer"><div><Link className="footer-brand" href="/">WYX <span>Golf Supply Co.</span></Link><p>Useful golf gear for the round, the trip, and the guys who make both memorable.</p><p className="footer-note">Use <strong>WYX10</strong> at checkout for 10% off your first order.</p><p className="footer-note">Support: <a href={`mailto:${supportEmail}`}>{supportEmail}</a></p></div><nav aria-label="Footer navigation"><Link href="/products">Shop</Link><Link href="/golf-gifts">Golf Gifts</Link><Link href="/golf-trip-gear">Trip Gear</Link><Link href="/golf-gifts-under-60">Gifts Under $60</Link><Link href="/golf-gifts-for-dad">Dad Gifts</Link><Link href="/bachelor-party-golf-gifts">Bachelor Party Gifts</Link><Link href="/bag-upgrades">Bag Upgrades</Link><Link href="/the-roo">The Roo Waitlist</Link><Link href="/first-sale">First Sale</Link><Link href="/journal">Field Notes</Link><Link href="/faq">FAQ</Link><Link href="/shipping-returns">Shipping & Returns</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link></nav></footer></CartProvider></body></html>;
}
