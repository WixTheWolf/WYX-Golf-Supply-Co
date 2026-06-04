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
  title: { default: 'WYX Golf Supply Co. | Golf Accessories, Gifts & Bag Essentials', template: '%s | WYX Golf Supply Co.' },
  description: 'Shop golf accessories, gifts under $60, club-care tools, gloves, grips, towels, golf balls, and bag essentials for weekend golfers.',
  keywords: ['golf accessories', 'golf gifts under 60', 'golf towels', 'golf gloves', 'golf ball markers', 'club care tools', 'putting mirror', 'golf tees'],
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'WYX Golf Supply Co.',
    type: 'website',
    title: 'WYX Golf Supply Co. | Golf Accessories, Gifts & Bag Essentials',
    description: 'Useful golf gear, gifts, and bag upgrades selected for fast checkout.',
    images: ['/images/hero-coastal-fairway.png']
  },
  twitter: { card: 'summary_large_image', images: ['/images/hero-coastal-fairway.png'] }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><SeoJsonLd /><TrackingScripts /><CartProvider><Header /><main>{children}</main><footer className="site-footer"><div><Link className="footer-brand" href="/">WYX <span>Golf Supply Co.</span></Link><p>Useful golf gear for weekend players, golf dads, range rats, and gift shoppers.</p><p className="footer-note">Use <strong>WYX10</strong> for 10% off your first bag upgrade.</p><p className="footer-note">Support: <a href={`mailto:${supportEmail}`}>{supportEmail}</a></p></div><nav aria-label="Footer navigation"><Link href="/products">Shop</Link><Link href="/golf-gifts">Golf Gifts</Link><Link href="/bag-essentials">Bag Essentials</Link><Link href="/golf-gifts-for-dad">Dad Gifts</Link><Link href="/deals">Deals</Link><Link href="/popular-golf-products-2026">Popular 2026</Link><Link href="/first-sale">First Sale</Link><Link href="/journal">Field Notes</Link><Link href="/story">Story</Link><Link href="/faq">FAQ</Link><Link href="/shipping-returns">Shipping & Returns</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link></nav></footer></CartProvider></body></html>;
}
