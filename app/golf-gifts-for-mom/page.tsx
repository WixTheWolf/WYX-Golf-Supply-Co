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
  title: "Golf Gifts for Mom — Practical Picks for the Golfer in Your Life | WYX Golf Supply Co.",
  description: "Golf gifts for Mom that actually get used: gloves, towels, leather accessories, alignment sticks, and the bag upgrades she would never buy herself. Under $50. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-mom' },
  openGraph: {
    title: "Golf Gifts for Mom | WYX Golf Supply Co.",
    description: "Golf gifts for the mom who golfs — practical picks she uses every round and the accessories she would never buy herself. Under $50. WYX10 saves 10%.",
    url: '/golf-gifts-for-mom'
  }
};

const momPicks = [
  {
    label: 'Cabretta Glove 3-Pack',
    price: '$32',
    why: 'The glove a golfer uses the most and buys the least. A 3-pack means starting the next three rounds with a fresh glove — not the cracked one from last spring. Universal S/M/ML/L sizing. Used within one round.',
    href: '/golf-gloves',
    tag: 'Under $35'
  },
  {
    label: 'Clip-On Microfiber Towel',
    price: '$18',
    why: 'The bag essential that gets used every round from hole 1 through 18. Carabiner clip attaches to any bag D-ring. 16x24 microfiber — one side scrubs, one side dries. Under $20 and immediately useful.',
    href: '/golf-towels',
    tag: 'Under $20'
  },
  {
    label: 'Leather Scorecard Holder',
    price: '$38',
    why: 'The elegant bag upgrade. Full-grain leather with pencil loop and ball marker pocket. The gift she uses every round and keeps for a decade. Engraving-ready front panel for initials or a short note.',
    href: '/golf-scorecard-holder',
    tag: 'Under $40'
  },
  {
    label: 'Alignment Sticks 2-Pack',
    price: '$24',
    why: 'The training tool every instructor uses and almost no amateur owns. Two sticks, 10 minutes before a round, and aim and alignment are confirmed — not guessed. Used every range session from that round forward.',
    href: '/golf-training-aids',
    tag: 'Under $25'
  },
  {
    label: 'Stretch Performance Hat',
    price: '$34',
    why: 'A low-crown structured stretch-fit hat with UPF 30+ and a moisture-wicking sweatband. The summer round essential. No brim adjustments, no size risk — stretch fit accommodates any ponytail.',
    href: '/golf-hats',
    tag: 'Under $35'
  },
  {
    label: 'Putting Alignment Mirror',
    price: '$32',
    why: 'The home putting tool that shows eye position, shoulder line, and putter path simultaneously — the same feedback a coach charges $100/hour for. Fits in any bag pocket. Used on any surface.',
    href: '/golf-training-aids',
    tag: 'Under $35'
  }
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the best golf gifts for Mom?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The best golf gifts for Mom: (1) Cabretta glove 3-pack ($32 — used within one round, no sizing guesswork), (2) clip-on microfiber towel ($18 — used every hole), (3) leather scorecard holder ($38 — elegant, practical, engraving-ready), (4) alignment sticks ($24 — the training tool she doesn't own), (5) stretch performance hat ($34 — summer essential, no size risk). All available at wyxgolfsupply.com. Use WYX10 for 10% off."
      }
    },
    {
      '@type': 'Question',
      name: "What golf gifts work if I don't know Mom's equipment?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Stick to size-free accessories: a towel ($18), alignment sticks ($24), a leather scorecard holder ($38), or a ball marker set ($28). All of these work regardless of whether she uses a cart bag or stand bag, irons or hybrids, Titleist or Callaway. No club head size knowledge required. No shaft flex required."
      }
    }
  ]
};

function momGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (price > 80) score -= 10;
  if (price <= 40) score += 8;
  if (/glove|towel|marker|alignment|scorecard|hat|cap|mirror/i.test(product.title)) score += 5;
  return score;
}

export default async function GolfGiftsForMomPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => momGiftScore(b) - momGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for Mom',
        description: 'Golf gifts for Mom that actually get used — practical accessories, bag upgrades, and training tools she would never buy herself.',
        url: `${siteUrl}/golf-gifts-for-mom`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for Mom', item: `${siteUrl}/golf-gifts-for-mom` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">For the Mom Who Golfs</p>
          <h1>Golf Gifts for Mom That Actually Get Used.</h1>
          <p>Not another novelty. Not something that ends up in the garage. These are the accessories a golfer uses every round — the ones she would never think to buy for herself, which is exactly what makes them work as gifts.</p>
          <div className="actions">
            <Link className="button primary" href="#mom-gift-grid">Shop Gifts for Mom</Link>
            <Link className="button secondary dark" href="/golf-gifts-for-women">Golf Gifts for Women &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off. No sizing risk on accessories.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Gift Under $40</p>
          <h2>Leather Scorecard Holder</h2>
          <p>Full-grain leather with pencil loop and ball marker pocket. The bag upgrade she notices every round but has never ordered. Engraving-ready front panel. Under $40 with WYX10.</p>
          <Link className="button primary" href="/golf-scorecard-holder" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Holder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf gift highlights for mom">
        <span>All under $50</span>
        <span>No sizing guesswork</span>
        <span>WYX10 saves 10%</span>
        <span>Used every round</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Picks for Mom</p>
          <h2 id="picks-heading">Golf Gifts She Will Use Every Single Round.</h2>
        </div>
        <div className="care-step-grid">
          {momPicks.map((pick) => (
            <Link key={pick.href + pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.65, display: 'block' }}>{pick.tag}</small>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="mom-gift-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Now</p>
            <h2>Golf Gifts for Mom.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts-for-women">All Women&apos;s Golf Gifts &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack</strong><p>$32 — Used every round</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Clip-On Towel</strong><p>$18 — Used every hole</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Scorecard Holder</strong><p>$38 — Engraving-ready</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks</strong><p>$24 — Every range session</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="occasions-heading">
        <div className="section-heading">
          <p className="eyebrow">When to Give</p>
          <h2 id="occasions-heading">Golf Gifts for Mom — Every Occasion.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-women" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Mother&apos;s Day</strong>
            <p>The leather scorecard holder and glove 3-pack together ($70) is the complete Mother&apos;s Day golf gift — elegant and practical in the same order.</p>
          </Link>
          <Link href="/golf-birthday-gifts" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Birthday</strong>
            <p>A hat + glove 3-pack + towel combo ($84 before WYX10) covers the full summer playing kit in one order. Everything she needs for the next 20 rounds.</p>
          </Link>
          <Link href="/golf-gifts-under-35" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $35</strong>
            <p>Glove 3-pack ($32) or alignment sticks ($24) — the two gifts under $35 that get used every round and earn a permanent bag spot.</p>
          </Link>
          <Link href="/golf-gifts-under-50" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $50</strong>
            <p>Leather scorecard holder ($38) or glove 3-pack + towel combo ($50) — the generous tier that feels like a considered gift, not a last-minute pick.</p>
          </Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-for-mom"
        campaign="mom_golf_gifts"
        title="Golf Gifts for the Mom Who Golfs."
        body="Join the WYX list for seasonal gift guides, bundle ideas, and 10% off your first order with WYX10."
      />
    </>
  );
}
