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
  title: "Golf Gifts Under $75 — Generous Gift Range for Any Golf Occasion | WYX Golf Supply Co.",
  description: "The best golf gifts under $75 — generous enough for a serious occasion, practical enough to get used every round. Glove bundles, leather holders, premium training aids, and more. WYX10 for 10% off.",
  alternates: { canonical: '/golf-gifts-under-75' },
  openGraph: {
    title: "Golf Gifts Under $75 | WYX Golf Supply Co.",
    description: "Golf gifts under $75 that feel generous and get used every round. Glove bundles, scorecard holders, premium accessories. WYX10 for 10% off.",
    url: '/golf-gifts-under-75'
  }
};

const under75Picks = [
  {
    label: 'Glove 3-Pack + Clip-On Towel Bundle',
    price: '$50',
    why: 'The combination gift: cabretta glove 3-pack ($32) + microfiber clip-on towel ($18) = $50. Two items used every round, together. Under $75 with room for a third pick.',
    href: '/golf-gloves'
  },
  {
    label: 'Cord Grip Regrip Kit (13 grips)',
    price: '$48',
    why: 'Regrip a full bag at home in an afternoon. Everything included: 13 cord grips + solvent + tape + vice clamp. The practical gear-improvement gift that most golfers never buy for themselves.',
    href: '/golf-grips'
  },
  {
    label: 'Leather Scorecard Holder',
    price: '$38',
    why: 'Full-grain leather. Holds scorecard, pencil, and spare sleeves. The bag side pocket upgrade that golfers always notice and almost never buy. Ten-year lifespan.',
    href: '/golf-scorecard-holder'
  },
  {
    label: 'Milled Ball Marker Set + Alignment Sticks',
    price: '$52 combined',
    why: 'A ball marker set ($28) and alignment sticks ($24) together — the training tool and the daily-use marker at one price point. Both earn permanent bag spots.',
    href: '/golf-ball-markers'
  },
  {
    label: 'Stretch Performance Hat + Glove 3-Pack',
    price: '$66 combined',
    why: 'A stretch-fit performance hat ($34) and a cabretta glove 3-pack ($32) — the gear combo for the golfer who plays through summer. Both used every single round.',
    href: '/golf-hats'
  },
  {
    label: 'Full Bag Essentials Bundle',
    price: '$70',
    why: 'Towel ($18) + club brush ($16) + ball markers ($28) + alignment sticks ($24) = $86 (use WYX10 for 10% off = ~$77). The complete bag essentials in one order.',
    href: '/golf-bag-setup'
  }
];

function under75Score(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (price > 75) return -100;
  if (price <= 50) score += 10;
  if (price <= 35) score += 5;
  if (/glove|towel|marker|alignment|scorecard|grip|brush/i.test(product.title)) score += 5;
  return score;
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a good golf gift for $75?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best golf gifts for $75: (1) glove 3-pack + clip-on towel bundle ($50 — two items used every round), (2) cord grip regrip kit ($48 — regrip a full bag at home), (3) leather scorecard holder ($38 — elegant, practical, 10-year lifespan), (4) ball markers + alignment sticks combined ($52 — training aid and daily-use marker). Use WYX10 for 10% off at WYX Golf Supply Co.'
      }
    },
    {
      '@type': 'Question',
      name: 'What golf gifts work for Father\'s Day under $75?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The best Father's Day golf gifts under $75: a glove 3-pack + towel bundle ($50 — used every round, used within 2 rounds of receiving), a leather scorecard holder ($38 — the elegant practical gift), or alignment sticks + ball marker set combo ($52). All ship standard and arrive before June 21. Use WYX10 for 10% off."
      }
    }
  ]
};

export default async function GolfGiftsUnder75() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .filter(p => Number(productPrice(p).amount) <= 75)
    .sort((a, b) => under75Score(b) - under75Score(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Generous Gift Range</p>
          <h1>Golf Gifts Under $75.</h1>
          <p>The budget for a serious golf gift — high enough to feel generous, practical enough to get used every round. Bundles, leather accessories, training aids, and the picks that earn permanent bag spots.</p>
          <div className="actions">
            <Link className="button primary" href="#under75-grid">Shop Under $75</Link>
            <Link className="button secondary dark" href="/fathers-day-golf-gifts">Father&apos;s Day →</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off — stretches the $75 budget further.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best $75 Pick</p>
          <h2>Gloves + Towel</h2>
          <p>Cabretta glove 3-pack ($32) + microfiber clip-on towel ($18) = $50. Two items used every single round, together under $75 with budget left for a third pick. Use WYX10 for 10% off.</p>
          <Link className="button primary" href="/golf-gloves" style={{ marginTop: '1rem', display: 'inline-block' }}>See Gloves →</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Under $75 golf gift highlights">
        <span>All under $75</span>
        <span>Bundle picks included</span>
        <span>WYX10 saves 10%</span>
        <span>Every-round useful</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">The Under $75 List</p>
          <h2 id="picks-heading">Six Golf Gifts Under $75 That Earn a Bag Spot.</h2>
        </div>
        <div className="care-step-grid">
          {under75Picks.map((pick) => (
            <Link key={pick.href + pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="under75-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Now</p>
            <h2>Under $75 Picks.</h2>
          </div>
          <Link className="text-link" href="/best-golf-gifts-under-100">See Under $100 →</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gloves 3-Pack</strong><p>$32</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Scorecard Holder</strong><p>$38</p></Link>
              <Link href="/golf-grips" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Cord Grip Kit</strong><p>$48</p></Link>
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Marker Set</strong><p>$28</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="tiers-heading">
        <div className="section-heading">
          <p className="eyebrow">Other Budgets</p>
          <h2 id="tiers-heading">All Price Ranges.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-under-35" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $35</strong>
            <p>The sweet spot for practical everyday-use picks.</p>
          </Link>
          <Link href="/golf-gifts-under-50" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $50</strong>
            <p>Glove 3-packs, markers, alignment sticks, and the complete bag tier.</p>
          </Link>
          <Link href="/golf-gifts-under-60" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $60</strong>
            <p>Everything in the $35 range plus leather accessories.</p>
          </Link>
          <Link href="/best-golf-gifts-under-100" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $100</strong>
            <p>Full bag essentials bundle, premium training aids, GPS accessories.</p>
          </Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-under-75"
        campaign="budget_gifts_under75"
        title="The Full Under-$75 Golf Gift List."
        body="Join the WYX list for new picks, bundle ideas, and 10% off your first order with WYX10."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts Under $75',
        description: 'The best golf gifts under $75 — generous enough for any occasion, practical enough for every round.',
        url: `${siteUrl}/golf-gifts-under-75`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts Under $75', item: `${siteUrl}/golf-gifts-under-75` }
          ]
        }
      }) }} />
    </>
  );
}
