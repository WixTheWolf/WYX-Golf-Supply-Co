import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

const giftPhoto = 'https://images.unsplash.com/photo-1693163532134-5ea6c80b58a3?auto=format&fit=crop&w=2200&q=86';

export const metadata: Metadata = {
  title: 'Golf Gifts That Actually Get Used | WYX Golf Supply Co.',
  description: 'A hard edit of golf gifts for real rounds and golf trips: headcovers, gloves, hats, markers, games, towels and bag upgrades selected by WYX.',
  alternates: { canonical: '/golf-gifts' },
  openGraph: {
    title: 'Golf Gifts That Actually Get Used | WYX Golf Supply Co.',
    description: 'Golf gifts with a real reason to be in the bag. Shop the current WYX edit.',
    url: '/golf-gifts',
    images: [{ url: giftPhoto }]
  }
};

const budgets = [
  { label: 'Easy Add-Ons', href: '/products?category=Accessories', desc: 'Small golf gifts and bag extras that are useful without requiring club specs.' },
  { label: 'Gifts Under $60', href: '/golf-gifts-under-60', desc: 'Headcovers, markers, gloves and accessories in the easiest gift range.' },
  { label: 'Bag Upgrade Kit', href: '/weekend-golfer-bag-upgrade-kit', desc: 'Five live products grouped into one editable cart, with every item visible before checkout.' },
  { label: 'Shop All WYX', href: '/products', desc: 'The complete current WYX edit, including the pieces we would show a golfer first.' }
];

const occasions = [
  { label: 'Headcovers', href: '/golf-headcovers' },
  { label: 'Golf Gloves', href: '/golf-gloves' },
  { label: 'Golf Trip Gear', href: '/golf-trip-gear' },
  { label: 'Golf Apparel', href: '/apparel' },
  { label: 'Bag Accessories', href: '/products?category=Accessories' },
  { label: 'Shop All WYX', href: '/products' }
];

const giftEditHandles = [
  'evil-ape',
  'augusta-bear-hat',
  'volcanic-ash',
  'topographic-carolina-blue-driver-headcover',
  'dude-abides-v2-mallet-putter-cover',
  'dartee-golf-glove',
  'golf-or-die-game-set',
  'magnet-caddie',
  'three-rail-ball-marker',
  'two-sided-metal-golf-ball-marker-5-color-combo-pack',
  'blue-ridge-golf-co-golf-towels',
  'park-paisley-womens-gold-golf-glove'
];

const faqs: [string, string][] = [
  ['What makes a good golf gift?', 'The safest golf gifts have a clear job or a strong personality and do not require knowing the golfer’s exact club specs. Headcovers, towels, markers, hats, games and bag accessories are usually easier to get right than performance equipment.'],
  ['What should I buy for a golfer who already has everything?', 'Look at the things a golfer sees or touches every round: the top of the bag, the glove, the towel, the marker, the hat, and the small accessories that make a trip easier. Upgrade something familiar instead of inventing a new gadget problem.'],
  ['How do I choose a golf gift without guessing the wrong size?', 'Start with non-sized accessories such as headcovers, towels, markers, games or bag organization. If you choose apparel or gloves, use the product options and fit information before adding it to the bag.']
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a }
  }))
};

export default async function GolfGiftsPage() {
  const curated = coreMerchProducts(availableProducts(await getProducts()));
  const products = giftEditHandles
    .map((handle) => curated.find((product) => product.handle === handle))
    .filter(Boolean) as typeof curated;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts',
        url: `${siteUrl}/golf-gifts`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` }
          ]
        }
      }) }} />

      <section className="trip-photo-hero">
        <Image src={giftPhoto} alt="Golfer walking a golf course carrying a golf bag" fill priority sizes="100vw" />
        <span className="trip-photo-hero-overlay" />
        <div className="trip-photo-hero-copy">
          <p className="eyebrow">GIVE GOLF BETTER</p>
          <h1>BUY THE THING HE&apos;LL ACTUALLY BRING TO THE COURSE.</h1>
          <p>The best golf gift shows up again next Saturday. Start with the visible, useful parts of the game: the headcover, the glove, the marker, the hat, the towel, the trip.</p>
          <div className="actions">
            <Link className="button primary" href="#gifts-grid">SHOP THE GIFT EDIT</Link>
            <Link className="button secondary" href="/golf-gifts-under-60">UNDER $60</Link>
          </div>
        </div>
      </section>

      <section className="section reveal" aria-labelledby="budget-heading">
        <div className="section-heading">
          <p className="eyebrow">SHOP FASTER</p>
          <h2 id="budget-heading">START WITH THE KIND OF GIFT.</h2>
        </div>
        <div className="care-step-grid">
          {budgets.map((budget) => (
            <Link key={budget.label} href={budget.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{budget.label}</strong>
              <p>{budget.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="gifts-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">THE CURRENT GIFT EDIT</p>
            <h2>THE ONES WE&apos;D ACTUALLY WRAP.</h2>
          </div>
          <Link className="text-link" href="/products">Shop All WYX</Link>
        </div>
        {products.length > 0
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <p>Gift picks are being refreshed. Browse the live WYX shop for currently available gear.</p>
        }
      </section>

      <section className="section reveal" aria-labelledby="occasions-heading">
        <div className="section-heading">
          <p className="eyebrow">NEED A SHORTCUT?</p>
          <h2 id="occasions-heading">SHOP BY GIFT TYPE.</h2>
        </div>
        <div className="care-step-grid">
          {occasions.map((occasion) => (
            <Link key={occasion.label} href={occasion.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{occasion.label}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="future-editorial-band gift-editorial-band">
        <p className="eyebrow">THE GIFT TEST</p>
        <h2>WOULD YOU BE EXCITED TO OPEN IT?</h2>
        <p>Useful is not enough. A WYX gift should either look good enough to get an immediate reaction or solve a golf problem the player actually recognizes. Ideally both.</p>
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">QUICK QUESTIONS</p>
          <h2 id="faq-heading">GOLF GIFT FAQ.</h2>
        </div>
        <div className="care-step-grid">
          {faqs.map(([question, answer]) => (
            <div key={question} className="care-step-card">
              <strong>{question}</strong>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <EmailCapture
        source="golf-gifts"
        campaign="golf_gifts"
        title="GET THE BEST NEW GOLF GIFTS FIRST."
        body="New headcovers, trip gear, premium picks, and the pieces worth sending to another golfer."
      />
    </>
  );
}
