import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import './promo.css';
import './kits.css';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';
import { TrackingScripts } from '@/components/TrackingScripts';

export const metadata: Metadata = {
  metadataBase: new URL('https://wyx-golf-supply-co.vercel.app'),
  title: { default: 'WYX Golf Supply Co. | Find Your Edge', template: '%s | WYX Golf Supply Co.' },
  description: 'Discover supplier-backed golf gear, accessories, gloves, grips, towels, and golf balls with live inventory and secure Shopify checkout.',
  openGraph: { siteName: 'WYX Golf Supply Co.', type: 'website' },
  twitter: { card: 'summary_large_image' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><TrackingScripts /><CartProvider><Header /><main>{children}</main><footer className="site-footer"><div><Link className="footer-brand" href="/">WYX <span>Golf Supply Co.</span></Link><p>Independent golf finds for the range, the first tee, and the long game.</p></div><nav aria-label="Footer navigation"><Link href="/products">Shop</Link><Link href="/first-sale">First Sale</Link><Link href="/deals">Deals</Link><Link href="/story">Our Story</Link><Link href="/journal">Field Notes</Link><Link href="/shipping-returns">Shipping & Returns</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></nav></footer></CartProvider></body></html>;
}
