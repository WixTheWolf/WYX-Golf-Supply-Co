import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import './promo.css';
import './kits.css';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { TrackingScripts } from '@/components/TrackingScripts';

export const metadata: Metadata = {
  metadataBase: new URL('https://wyx-golf-supply-co.vercel.app'),
  title: { default: 'WYX Golf Supply Co. | Golf Accessories, Gifts & Bag Essentials', template: '%s | WYX Golf Supply Co.' },
  description: 'Shop golf accessories, gifts under $60, club-care tools, gloves, grips, towels, golf balls, and bag essentials with secure Shopify checkout.',
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
  return <html lang="en"><body><SeoJsonLd /><TrackingScripts /><CartProvider><Header /><main>{children}</main><footer className="site-footer"><div><Link className="footer-brand" href="/">WYX <span>Golf Supply Co.</span></Link><p>Independent golf finds for the range, the first tee, and the long game.</p></div><nav aria-label="Footer navigation"><Link href="/products">Shop</Link><Link href="/golf-gifts-under-60">Golf Gifts</Link><Link href="/best-golf-accessories">Accessories</Link><Link href="/popular-golf-products-2026">Popular 2026</Link><Link href="/first-sale">First Sale</Link><Link href="/deals">Deals</Link><Link href="/story">Our Story</Link><Link href="/journal">Field Notes</Link><Link href="/shipping-returns">Shipping & Returns</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></nav></footer></CartProvider></body></html>;
}
