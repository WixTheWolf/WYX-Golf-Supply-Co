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
  title: "Golf Gifts Under $50 — The Most-Used Price Point for Golf Gifts | WYX Golf Supply Co.",
  description: "The best golf gifts under $50 — the sweet spot for a golf gift that feels real without overthinking. Gloves, towels, ball markers, alignment sticks. WYX10 for 10% off.",
  alternates: { canonical: '/golf-gifts-under-50' },
  openGraph: {
    title: "Golf Gifts Under $50 | WYX Golf Supply Co.",
    description: "Golf gifts under $50 that earn a permanent bag spot. Gloves, towels, markers, alignment sticks. The right budget for any occasion. WYX10 for 10% off.",
    url: '/golf-gifts-under-50'
  }
};

const under50Picks = [
  {
    label: 'Cabretta Glove 3-Pack',
    price: '$32',
    why: 'The highest-ROI golf gift at the $50 budget. Used every round, always needed, never bought in advance. Cabretta leather — what tour caddies keep in their bags for the player.',
    href: '/golf-gloves'
  },
  {
    label: 'Clip-On Microfiber Towel',
    price: '$18',
    why: 'Hangs on the bag D-ring. Clean club faces between iron shots, wipe grips in drizzle, clean the ball before a pressure putt. Used every round from the first time it is attached.',
    href: '/golf-towels'
  },
  {
    label: 'Milled Ball Marker Set',
    price: '$28',
    why: 'Three milled coins plus a magnetic hat clip in a gift box. Every golfer wants one. The self-buy test: a quality ball marker is something every golfer notices others using and thinks "I should get that." Almost none do.',
    href: '/golf-ball-markers'
  },
  {
    label: 'Alignment Sticks (2-pack)',
    price: '$24',
    why: 'Tour players warm up with two fiberglass rods on the ground — and so does every teaching professional. The best training aid at any price, under $25.',
    href: '/golf-training-aids'
  },
  {
    label: 'Cord Grip Regrip Kit (13 grips)',
    price: '$48',
    why: 'Regrip a full bag at home in an afternoon for under $50. 13 cord grips + solvent + tape + vice clamp. Worn grips are the most common equipment problem most golfers never fix.',
    href: '/golf-grips'
  },
  {
    label: 'Leather Scorecard Holder',
    price: '$38',
    why: 'Full-grain leather. Holds scorecard, pencil, and 4-6 sleeves of balls. The side pocket upgrade that most golfers want and almost none buy for themselves.',
    href: '/golf-scorecard-holder'
  }
];

function under50Score(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (price > 50) return -100;
  if (price <= 35) score += 10;
  if (price <= 25) score += 5;
  if (/glove|towel|marker|alignment|grip|scorecard|brush/i.test(product.title)) score += 5;
  return score;
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the best golf gifts under $50?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Best golf gifts under $50: (1) cabretta glove 3-pack ($32 — used every round, always needed), (2) milled ball marker set ($28 — the gift every golfer wants and never buys), (3) alignment sticks ($24 — what tour pros warm up with), (4) microfiber clip-on towel ($18 — used every round all season), (5) leather scorecard holder ($38 — practical bag upgrade). All available at WYX Golf Supply Co. with WYX10 for 10% off.'
      }
    },
    {
      '@type': 'Question',
      name: 'What golf gift should I buy for $40-$50?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best golf gifts in the $40-$50 range: a cord grip regrip kit ($48 — regrip a full bag at home), a leather scorecard holder ($38 — elegant practical gift), or a cabretta glove 3-pack ($32 — the highest-frequency-use golf gift at this price). Use WYX10 for 10% off your first order at WYX Golf Supply Co.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is a good golf gift for Father\'s Day under $50?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The best Father's Day golf gifts under $50: a cabretta glove 3-pack ($32) — he always runs out, a milled ball marker set ($28) — the gift he wants but won't buy himself, and alignment sticks ($24) — what tour players warm up with. Stack the gloves + marker set for a $60 gift combo. Use WYX10 for 10% off. Father's Day is June 21."
      }
    }
  ]
};

export default async function GolfGiftsUnder50() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .filter(p => Number(productPrice(p).amount) <= 50)
    .sort((a, b) => under50Score(b) - under50Score(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Gifts Under $50</p>
          <h1>The $50 Golf Gift Zone.</h1>
          <p>The price point where golf gifts feel real. Under $50 covers gloves, towels, ball markers, alignment sticks, and scorecard holders — the everyday-use accessories that earn a permanent bag spot without the commitment of a triple-digit purchase.</p>
          <div className="actions">
            <Link className="button primary" href="#under50-grid">Shop Under $50</Link>
            <Link className="button secondary dark" href="/fathers-day-golf-gifts">Father&apos;s Day →</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off. Makes the $50 stretch further.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Top Pick Under $50</p>
          <h2>Glove 3-Pack</h2>
          <p>$32 for three cabretta leather gloves. The most-used, always-needed, never-in-advance-purchased golf gift at this price. He will open this and use one within two rounds.</p>
          <Link className="button primary" href="/golf-gloves" style={{ marginTop: '1rem', display: 'inline-block' }}>See Gloves →</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Under $50 golf gift highlights">
        <span>All under $50</span>
        <span>6 top picks</span>
        <span>WYX10 saves more</span>
        <span>Every-round useful</span>
      </section>

      {/* 6 Picks */}
      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">The Under $50 List</p>
          <h2 id="picks-heading">Six Golf Gifts Under $50 That Get Used Every Round.</h2>
        </div>
        <div className="care-step-grid">
          {under50Picks.map((pick) => (
            <Link key={pick.href} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section id="under50-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Now</p>
            <h2>Under $50 Picks.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts-under-60">See Under $60 →</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gloves 3-Pack</strong><p>$32</p></Link>
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Milled Ball Markers</strong><p>$28</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks</strong><p>$24</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Clip-On Towel</strong><p>$18</p></Link>
            </div>
          )
        }
      </section>

      {/* Price Tier Navigation */}
      <section className="section reveal" aria-labelledby="tiers-heading">
        <div className="section-heading">
          <p className="eyebrow">Other Budgets</p>
          <h2 id="tiers-heading">Find Your Price Range.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-under-25" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $25</strong>
            <p>Tees, brushes, and the entry-level practical picks. High frequency use at minimal cost.</p>
          </Link>
          <Link href="/golf-gifts-under-35" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $35</strong>
            <p>The sweet spot where $18–$34 picks cover the full bag essentials.</p>
          </Link>
          <Link href="/golf-gifts-under-60" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $60</strong>
            <p>Glove 3-packs, scorecard holders, and the premium-accessory tier.</p>
          </Link>
          <Link href="/best-golf-gifts-under-100" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $100</strong>
            <p>Training aids, premium leather gifts, and the full bag setup in one purchase.</p>
          </Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-under-50"
        campaign="budget_gifts_under50"
        title="Get the Under-$50 Golf Gift List."
        body="Join the WYX list for new picks, Father's Day guides, and 10% off your first order with WYX10."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts Under $50',
        description: 'The best golf gifts under $50 — gloves, towels, ball markers, alignment sticks, and scorecard holders that earn a permanent bag spot.',
        url: `${siteUrl}/golf-gifts-under-50`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts Under $50', item: `${siteUrl}/golf-gifts-under-50` }
          ]
        }
      }) }} />
    </>
  );
}
