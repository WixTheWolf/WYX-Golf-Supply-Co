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
  title: "Golf Gifts Under $35 — The Sweet Spot for Golf Gifts | WYX Golf Supply Co.",
  description: "The best golf gifts under $35 — the price point that gets used, not regifted. Gloves, towels, ball markers, brushes, and tees that earn a permanent bag spot. WYX10 for 10% off.",
  alternates: { canonical: '/golf-gifts-under-35' },
  openGraph: {
    title: "Golf Gifts Under $35 | WYX Golf Supply Co.",
    description: "Golf gifts under $35 that actually get used. Gloves, towels, ball markers, club brushes. The perfect golf gift at the perfect price. WYX10 for 10% off.",
    url: '/golf-gifts-under-35'
  }
};

const under35Picks = [
  {
    label: 'Microfiber Clip-On Towel',
    price: '$18',
    why: 'Hangs on the bag ring all season. Cleans club faces between shots, grips in rain, ball before a critical putt. Used more than any other accessory.',
    href: '/golf-towels'
  },
  {
    label: 'Dual-Sided Club Brush',
    price: '$16',
    why: 'Nylon bristle face, brass wire side, retractable groove pick. Clips to the bag permanently. Ten seconds per club after every iron shot.',
    href: '/golf-club-care'
  },
  {
    label: 'Alignment Sticks (2-pack)',
    price: '$24',
    why: 'The training aid tour players use every warm-up. Two sticks fix stance, ball position, swing path, and aim simultaneously. Fits in the bag tube.',
    href: '/golf-training-aids'
  },
  {
    label: 'Milled Ball Marker Set',
    price: '$28',
    why: 'Three precision-milled coins plus a magnetic hat clip. The gift every golfer wants but never buys for themselves. Under $30 and used every green.',
    href: '/golf-ball-markers'
  },
  {
    label: 'Stretch Performance Hat',
    price: '$34',
    why: 'Low crown, moisture-wicking sweatband, UPF 30+ fabric. Stays on without a readjust through 18 holes in summer heat.',
    href: '/golf-hats'
  },
  {
    label: 'Bamboo Tee Pack (500-count)',
    price: '$14',
    why: '500 bamboo tees for $14. The lowest-drama golf gift — golfers always run short mid-round. They will use every one.',
    href: '/golf-balls'
  }
];

function under35Score(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (price <= 35) score += 15;
  else if (price <= 40) score += 5;
  else return -100;
  if (/towel|brush|marker|alignment|tee|glove/i.test(product.title)) score += 5;
  return score;
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the best golf gifts under $35?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best golf gifts under $35: (1) microfiber clip-on towel ($18) — used every round all season, (2) dual-sided club brush with groove pick ($16) — essential bag item, (3) alignment sticks ($24) — fix 4 swing flaws immediately, (4) milled ball marker set ($28) — the gift every golfer wants, (5) bamboo tee pack ($14) — 500 tees, always needed. Use WYX10 for 10% off at WYX Golf Supply Co.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is a useful golf gift under $30?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The most useful golf gifts under $30: a microfiber clip-on towel ($18) that hangs on the bag ring all season, a dual-sided club brush ($16) that lives on the bag permanently, or a milled ball marker set ($28) that gets used on every green. These three items are used every single round — not once-in-a-while items.'
      }
    },
    {
      '@type': 'Question',
      name: 'What golf gifts are under $25?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Golf gifts under $25: alignment sticks ($24 — the training aid tour players use every warm-up), a microfiber clip-on towel ($18), a dual-sided club brush with groove pick ($16), or a bamboo tee 500-count pack ($14). These are the highest-frequency-use items in a golf bag at the lowest price point.'
      }
    }
  ]
};

export default async function GolfGiftsUnder35() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .filter(p => Number(productPrice(p).amount) <= 40)
    .sort((a, b) => under35Score(b) - under35Score(a))
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">The Sweet Spot</p>
          <h1>Golf Gifts Under $35.</h1>
          <p>The price range where golf gifts go from "nice thought" to "used every round." Every pick here earns a permanent bag spot without the commitment of a triple-digit purchase.</p>
          <div className="actions">
            <Link className="button primary" href="#under35-grid">Shop Under $35</Link>
            <Link className="button secondary dark" href="/golf-gifts">See All Gifts →</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off. Stack it with the $35 budget.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Under $35</p>
          <h2>Towel + Brush = $34</h2>
          <p>A microfiber clip-on towel ($18) and a dual-sided club brush ($16) — two items used every single round, together under $35 before WYX10. The most practical golf gift combo at this price.</p>
          <Link className="button primary" href="#under35-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Picks →</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Under $35 gift highlights">
        <span>All under $35</span>
        <span>6 curated picks</span>
        <span>WYX10 saves more</span>
        <span>Every-round useful</span>
      </section>

      {/* The 6 Picks */}
      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">The Under $35 List</p>
          <h2 id="picks-heading">Six Picks That Get Used Every Round.</h2>
        </div>
        <div className="care-step-grid">
          {under35Picks.map((pick) => (
            <Link key={pick.href} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section id="under35-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Now</p>
            <h2>Under $35 Picks.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts-under-60">See Under $60 →</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Towels</strong><p>From $18</p></Link>
              <Link href="/golf-club-care" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Club Brushes</strong><p>From $16</p></Link>
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Markers</strong><p>From $28</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks</strong><p>$24</p></Link>
            </div>
          )
        }
      </section>

      {/* Why Under $35 Works */}
      <section className="section reveal" aria-labelledby="why-heading">
        <div className="section-heading">
          <p className="eyebrow">The Logic</p>
          <h2 id="why-heading">Why $35 Is the Best Golf Gift Budget.</h2>
        </div>
        <div className="care-step-grid">
          <div className="care-step-card">
            <strong>High Frequency Use at Low Cost</strong>
            <p>A towel ($18) gets used 40+ times per season — that is less than $0.50 per use. A club brush ($16) gets used after every iron shot. These are not one-time-use gifts; they are daily-use items that happen to cost under $35.</p>
          </div>
          <div className="care-step-card">
            <strong>The Self-Buy Paradox</strong>
            <p>Golfers buy expensive things for themselves (clubs, greens fees, rangefinders) and skip buying the cheap things (fresh gloves, a quality towel, alignment sticks). The under $35 gift hits the exact items a golfer keeps meaning to replace and never does.</p>
          </div>
          <div className="care-step-card">
            <strong>No Sizing Risk</strong>
            <p>Every item on this page is size-free — no need to know the recipient&apos;s glove size, shirt size, or shoe size. A ball marker, towel, or brush works for everyone at every skill level.</p>
          </div>
          <div className="care-step-card">
            <strong>Stack and Save</strong>
            <p>Two under-$35 items together become a stronger gift than either alone. Towel + brush = $34. Ball markers + tees = $42. Alignment sticks + brush = $40. Bundle two and use WYX10 for 10% off the pair.</p>
          </div>
        </div>
      </section>

      {/* More Budget Tiers */}
      <section className="section reveal" aria-labelledby="tiers-heading">
        <div className="section-heading">
          <p className="eyebrow">Other Budgets</p>
          <h2 id="tiers-heading">Find Your Price Range.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-under-25" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $25</strong>
            <p>Tees, brushes, and the smallest-budget picks that still get used every round.</p>
          </Link>
          <Link href="/golf-gifts-under-60" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $60</strong>
            <p>Glove 3-packs, scorecard holders, and the full-range practical gift set.</p>
          </Link>
          <Link href="/best-golf-gifts-under-100" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $100</strong>
            <p>Training aids, premium accessories, and the full bag essentials bundle.</p>
          </Link>
          <Link href="/golf-gifts-under-150" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $150</strong>
            <p>GPS watch, rangefinder, and the premium gift that changes every round.</p>
          </Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-under-35"
        campaign="budget_gifts_2026"
        title="The Full Under-$35 Golf Gift List."
        body="Join the WYX list for new picks, seasonal guides, and 10% off your first order with WYX10."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts Under $35',
        description: 'The best golf gifts under $35 — practical accessories that earn a permanent bag spot. Towels, brushes, markers, alignment sticks, and tees.',
        url: `${siteUrl}/golf-gifts-under-35`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts Under $35', item: `${siteUrl}/golf-gifts-under-35` }
          ]
        }
      }) }} />
    </>
  );
}
