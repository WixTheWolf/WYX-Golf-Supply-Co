import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productPrice, siteUrl } from '@/lib/feed';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Best Golf Gifts 2026 — Curated Picks That Actually Get Used | WYX Golf Supply Co.",
  description: "The best golf gifts of 2026: gloves, towels, ball markers, training aids, GPS tech, and bag upgrades that earn a permanent bag spot. Updated for the 2026 season. Use WYX10 for 10% off.",
  alternates: { canonical: '/best-golf-gifts-2026' },
  openGraph: {
    title: "Best Golf Gifts 2026 | WYX Golf Supply Co.",
    description: "The 2026 golf gift guide — curated picks that get used every round. Gloves, towels, markers, training aids, GPS watches. Use WYX10 for 10% off.",
    url: '/best-golf-gifts-2026'
  }
};

const categories = [
  { label: 'Under $25', href: '/golf-gifts-under-25', description: 'Stocking stuffers and everyday-use picks' },
  { label: 'Under $60', href: '/golf-gifts-under-60', description: 'The sweet spot — gloves, towels, markers' },
  { label: 'Under $100', href: '/best-golf-gifts-under-100', description: 'Training aids, premium accessories' },
  { label: 'Under $150', href: '/golf-gifts-under-150', description: 'GPS watch, rangefinder, leather gifts' }
];

const topPicks2026 = [
  { label: 'Cabretta Glove 3-Pack', why: 'Used within 2 rounds. Always needed, never bought.', href: '/golf-gloves', price: '$32' },
  { label: 'Microfiber Clip-On Towel', why: 'Hangs on the bag ring all season. The most-used accessory.', href: '/golf-towels', price: '$18' },
  { label: 'Milled Ball Marker Set', why: 'Every golfer wants one. Almost none buy it for themselves.', href: '/golf-ball-markers', price: '$28' },
  { label: 'Alignment Sticks', why: 'Two sticks fix 4 swing flaws simultaneously. Tour players use them.', href: '/golf-training-aids', price: '$24' },
  { label: 'Groove Sharpener', why: 'Restores wedge spin in 3 minutes. Golfers do not know they need this.', href: '/golf-club-care', price: '$22' },
  { label: 'GPS Watch', why: 'Removes yardage guessing from every round. The premium gift.', href: '/golf-gps-watch', price: '$149' }
];

function bestGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (price <= 60) score += 6;
  if (price <= 35) score += 3;
  if (/glove|towel|marker|alignment|groove|brush|grip|ball|hat/i.test(product.title)) score += 4;
  return score;
}

export default async function BestGolfGifts2026() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => bestGiftScore(b) - bestGiftScore(a)).slice(0, 12);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the best golf gifts in 2026?',
        acceptedAnswer: { '@type': 'Answer', text: 'The best golf gifts in 2026 are: (1) a cabretta glove 3-pack ($32) — used within two rounds, (2) a milled ball marker set ($28) — something every golfer wants but skips buying, (3) alignment sticks ($24) — fix 4 swing flaws immediately, (4) a microfiber clip-on towel ($18) — gets used every round for the whole season, (5) a GPS watch ($149) — the premium gift that changes every round. Available at WYX Golf Supply Co. with WYX10 for 10% off.' }
      },
      {
        '@type': 'Question',
        name: 'What golf accessories do golfers actually use?',
        acceptedAnswer: { '@type': 'Answer', text: 'The golf accessories that get used every single round: a quality clip-on towel (cleans club faces between shots), a ball marker (used on every green), a cabretta glove (needed every round), a groove brush (cleans irons and wedges for consistent contact), and alignment sticks at the range (used during every practice session). These are the high-frequency-use items that belong in any golf gift guide.' }
      },
      {
        '@type': 'Question',
        name: 'What is a good golf gift under $50?',
        acceptedAnswer: { '@type': 'Answer', text: 'The best golf gifts under $50: a cabretta glove 3-pack ($32), a microfiber clip-on towel ($18), alignment sticks ($24), a groove sharpener ($22), or a bamboo tee set ($8) bundled with a ball marker ($28). Use WYX10 for 10% off any first order at WYX Golf Supply Co.' }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">2026 Golf Gift Guide</p>
          <h1>Best Golf Gifts 2026.</h1>
          <p>Updated for the 2026 season — the accessories, training aids, and tech picks that earn a permanent bag spot. No novelty gear. No re-gifts. Just the picks every golfer actually wants.</p>
          <div className="actions">
            <Link className="button primary" href="#gift-grid">Shop 2026 Picks</Link>
            <Link className="button secondary dark" href="/fathers-day-golf-gifts">Father&apos;s Day Guide →</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off your first order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">2026 Top Pick</p>
          <h2>GPS Watch</h2>
          <p>40,000+ courses. Front, mid, back yardages. 18-hole battery. The gift that improves every round from the first time it is worn. Use WYX10 for $14.90 off.</p>
          <Link className="button primary" href="/golf-gps-watch" style={{ marginTop: '1rem', display: 'inline-block' }}>See GPS Watch →</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="2026 gift guide highlights">
        <span>Updated for 2026</span>
        <span>6 curated categories</span>
        <span>WYX10 saves 10%</span>
        <span>No novelty picks</span>
      </section>

      {/* Top 6 Picks */}
      <section className="section reveal" aria-labelledby="top-picks-heading">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Curated List</p>
            <h2 id="top-picks-heading">The 6 Best Golf Gifts of 2026.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts">See All Golf Gifts</Link>
        </div>
        <div className="care-step-grid">
          {topPicks2026.map((pick) => (
            <Link key={pick.href} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop By Budget */}
      <section className="section reveal" aria-labelledby="budget-heading">
        <div className="section-heading">
          <p className="eyebrow">Shop By Budget</p>
          <h2 id="budget-heading">Find The Right Price Fast.</h2>
        </div>
        <div className="care-step-grid">
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{cat.label}</strong>
              <p>{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section id="gift-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Now</p>
            <h2>2026 Golf Gift Picks.</h2>
          </div>
          <Link className="text-link" href="/products">See Full Shop</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : <p>Products loading — check back in a moment or <Link href="/products">browse the full shop</Link>.</p>
        }
      </section>

      {/* What Makes a Good Golf Gift */}
      <section className="section reveal" aria-labelledby="criteria-heading">
        <div className="section-heading">
          <p className="eyebrow">The Criteria</p>
          <h2 id="criteria-heading">How WYX Picks Golf Gifts.</h2>
        </div>
        <div className="care-step-grid">
          <div className="care-step-card">
            <strong>The Bag Test</strong>
            <p>Every WYX pick must earn a permanent spot in the bag. If it would live in a junk drawer, it fails. The test: does the golfer reach for this item every round? Yes = curated. No = rejected.</p>
          </div>
          <div className="care-step-card">
            <strong>The Self-Buy Test</strong>
            <p>The best golf gifts are things golfers want but skip buying for themselves — a milled ball marker, a fresh glove 3-pack, a GPS watch. These land. Generic novelty items do not pass the self-buy test.</p>
          </div>
          <div className="care-step-card">
            <strong>No Sizing Risk</strong>
            <p>WYX avoids apparel gifts that require knowing the recipient&apos;s size, fit preference, and brand loyalty. Accessories, training aids, and tech gifts are size-free. They work every time.</p>
          </div>
          <div className="care-step-card">
            <strong>Real Price Points</strong>
            <p>The WYX catalog runs $14–$149 with transparent prices. Use WYX10 for 10% off your first order. Shipping shown before payment. Secure Shopify checkout. No surprises.</p>
          </div>
        </div>
      </section>

      <EmailCapture
        source="best-golf-gifts-2026"
        campaign="best_gifts_2026"
        title="Get the 2026 Golf Gift Guide."
        body="Join the WYX list for new picks, Father's Day guides, and 10% off your first order with WYX10."
      />
    </>
  );
}
