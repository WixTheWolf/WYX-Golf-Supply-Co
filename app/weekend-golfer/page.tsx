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
  title: "Weekend Golfer — Gear for the Player Who Plays When Life Allows | WYX Golf Supply Co.",
  description: "WYX Golf Supply Co. is built for the weekend golfer — practical accessories, bag upgrades, and training tools for the player who plays 20-40 rounds a year and wants to make every one count. Use WYX10 for 10% off.",
  alternates: { canonical: '/weekend-golfer' },
  openGraph: {
    title: "Weekend Golfer Golf Gear | WYX Golf Supply Co.",
    description: "Gear for the golfer who plays 20-40 rounds a year. Practical accessories, training tools, and bag upgrades that earn a permanent bag spot. WYX10 for 10% off.",
    url: '/weekend-golfer'
  }
};

const weekendGolferPicks = [
  {
    label: 'Cabretta Glove 3-Pack',
    price: '$32',
    why: 'The weekend golfer goes through 8-12 gloves a season. A 3-pack means always starting a round with a fresh glove — not the cracked one from 3 rounds ago.',
    href: '/golf-gloves',
    frequency: 'Every round'
  },
  {
    label: 'Alignment Sticks (2-pack)',
    price: '$24',
    why: 'The training aid that makes every range session before a weekend round count. Two sticks, 15 minutes, and the next round starts with the right aim.',
    href: '/golf-training-aids',
    frequency: 'Every range session'
  },
  {
    label: 'Clip-On Microfiber Towel',
    price: '$18',
    why: 'Weekend golfers play 5-8 hours of golf in a day. Clean club faces mean consistent contact from hole 1 through 18. The towel does the work.',
    href: '/golf-towels',
    frequency: 'After every iron'
  },
  {
    label: 'GPS Watch',
    price: '$149',
    why: 'On an unfamiliar course — which is every weekend golf round — the GPS watch removes yardage uncertainty from every approach. The premium weekend golfer upgrade.',
    href: '/golf-gps-watch',
    frequency: 'Every hole'
  },
  {
    label: 'Dual-Sided Club Brush',
    price: '$16',
    why: 'A weekend round means 36-54 iron shots. Clean grooves after every shot means the wedge on hole 17 spins like it did on hole 1.',
    href: '/golf-club-care',
    frequency: 'After every iron'
  },
  {
    label: 'Cord Grip Regrip Kit',
    price: '$48',
    why: 'A weekend golfer plays 30+ rounds on the same grips. After one season, regripping the full bag takes one afternoon and costs under $50. It is the most overlooked performance upgrade.',
    href: '/golf-grips',
    frequency: 'Once per season'
  }
];

const weekendGolferProfile = [
  {
    stat: '20–40',
    label: 'Rounds per year',
    detail: 'Enough to care. Not enough to make it an identity. The weekend golfer plays when work, kids, and the weather align.'
  },
  {
    stat: '12–16',
    label: 'Handicap range',
    detail: 'Consistent enough to break 90 on a good day. Inconsistent enough that the same swing produces both birdies and triple-bogeys.'
  },
  {
    stat: '$0–$100',
    label: 'Per-round gear spend',
    detail: 'The weekend golfer buys new clubs every 5-7 years and spends the rest on greens fees, range balls, and consumables.'
  },
  {
    stat: '3',
    label: 'Gloves per season (minimum)',
    detail: 'Cabretta leather lasts 10-15 rounds. A 20-round season goes through 2 gloves minimum. A 40-round summer goes through 4.'
  }
];

function weekendScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (price <= 60) score += 6;
  if (price <= 35) score += 4;
  if (/glove|towel|alignment|brush|marker|grip|gps/i.test(product.title)) score += 5;
  return score;
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What gear does a weekend golfer need?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A weekend golfer needs: a cabretta glove 3-pack ($32 — always fresh, always needed), alignment sticks ($24 — make every range session count), a clip-on towel ($18 — used every round), a dual-sided club brush ($16 — clean grooves all 18 holes), and a GPS watch ($149 — the premium upgrade that removes yardage uncertainty on unfamiliar courses). The full setup under $160 before WYX10.'
      }
    },
    {
      '@type': 'Question',
      name: 'How many rounds does a weekend golfer play per year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A weekend golfer typically plays 20-40 rounds per year — enough to maintain a handicap and play tournament golf, not enough to practice daily. At 30 rounds per year, a cabretta glove lasts 1-2 rounds, which means going through 15-20 gloves per season. A 3-pack rotation costs $32 and covers 6-8 rounds — the highest-ROI golf purchase for this volume of play.'
      }
    }
  ]
};

export default async function WeekendGolfer() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => weekendScore(b) - weekendScore(a)).slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Built for You</p>
          <h1>The Weekend Golfer.</h1>
          <p>You play when work and weather allow. You track your handicap. You care enough to practice before a round but not enough to make it a second job. WYX is built for exactly that kind of golfer.</p>
          <div className="actions">
            <Link className="button primary" href="#weekend-picks">Shop Weekend Gear</Link>
            <Link className="button secondary dark" href="/golf-gifts">Golf Gifts →</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off your first order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Weekend Profile</p>
          <h2>20–40 rounds/yr</h2>
          <p>Consistent enough to care about equipment. Infrequent enough that consumables (gloves, grips, tees) run out before you notice. WYX stocks exactly that.</p>
          <Link className="button primary" href="#weekend-picks" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Picks →</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Weekend golfer highlights">
        <span>20–40 rounds/year</span>
        <span>Practical picks only</span>
        <span>WYX10 saves 10%</span>
        <span>No gear anxiety</span>
      </section>

      {/* The Profile */}
      <section className="section reveal" aria-labelledby="profile-heading">
        <div className="section-heading">
          <p className="eyebrow">Your Profile</p>
          <h2 id="profile-heading">The Weekend Golfer Numbers.</h2>
        </div>
        <div className="care-step-grid">
          {weekendGolferProfile.map((item) => (
            <div key={item.stat} className="care-step-card">
              <strong style={{ fontSize: '1.5rem' }}>{item.stat}</strong>
              <p><strong>{item.label}</strong></p>
              <p style={{ opacity: 0.8, marginTop: '0.5rem' }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Picks */}
      <section id="weekend-picks" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Weekend Gear</p>
            <h2>The Six Weekend Golfer Picks.</h2>
          </div>
          <Link className="text-link" href="/golf-bag-setup">Bag Setup Guide</Link>
        </div>
        <div className="care-step-grid" style={{ marginBottom: '2rem' }}>
          {weekendGolferPicks.map((pick) => (
            <Link key={pick.href} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
              <small style={{ opacity: 0.65, display: 'block', marginTop: '0.5rem' }}>Used: {pick.frequency}</small>
            </Link>
          ))}
        </div>
        {products.length
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : null
        }
      </section>

      {/* Why WYX for the Weekend Golfer */}
      <section className="section reveal" aria-labelledby="why-heading">
        <div className="section-heading">
          <p className="eyebrow">The WYX Position</p>
          <h2 id="why-heading">Why WYX for the Weekend Golfer.</h2>
        </div>
        <div className="care-step-grid">
          <div className="care-step-card">
            <strong>No Club Advice</strong>
            <p>WYX does not sell drivers, irons, or putters. The weekend golfer already has clubs. What the weekend golfer runs out of: gloves, tees, and clean grips. That is what WYX stocks.</p>
          </div>
          <div className="care-step-card">
            <strong>Consumables at Real Prices</strong>
            <p>A 3-pack of cabretta gloves at $32 is a season&apos;s worth of glove budget done in one purchase. A bamboo tee 500-count at $14 means never running out mid-round again. These prices are real and the products are the same quality as anything at the pro shop.</p>
          </div>
          <div className="care-step-card">
            <strong>Gear That Earns a Bag Spot</strong>
            <p>The WYX standard: every product must earn a permanent spot in the bag. If it would sit in a drawer after one use, it fails the curation test. The weekend golfer&apos;s bag has limited real estate — WYX only puts in what belongs there.</p>
          </div>
          <div className="care-step-card">
            <strong>WYX10 for First Orders</strong>
            <p>Use WYX10 at checkout for 10% off your first order. Secure Shopify checkout. Shipping shown before payment. Returns accepted. No surprises between add-to-cart and confirmation email.</p>
          </div>
        </div>
      </section>

      <EmailCapture
        source="weekend-golfer"
        campaign="weekend_golfer_2026"
        title="Gear for the Weekend Golfer."
        body="Join the WYX list for seasonal picks, gear guides, and 10% off your first order with WYX10."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Weekend Golfer',
        description: 'Golf gear for the weekend golfer — practical accessories, training tools, and bag upgrades for the player who plays 20-40 rounds per year.',
        url: `${siteUrl}/weekend-golfer`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Weekend Golfer', item: `${siteUrl}/weekend-golfer` }
          ]
        }
      }) }} />
    </>
  );
}
