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
  title: "How to Set Up a Golf Bag — The Complete Bag Setup Guide | WYX Golf Supply Co.",
  description: "The complete golf bag setup guide: what goes in each pocket, the right accessories for every ring and clip, and how to organize a bag so it is ready every round. Use WYX10 for 10% off.",
  alternates: { canonical: '/golf-bag-setup' },
  openGraph: {
    title: "Golf Bag Setup Guide | How to Organize a Golf Bag | WYX Golf Supply Co.",
    description: "What goes in each golf bag pocket, how to clip accessories correctly, and the accessories every organized bag needs. The complete setup guide.",
    url: '/golf-bag-setup'
  }
};

const bagSetup = [
  {
    zone: 'Bag Ring (D-Ring)',
    accessory: 'Clip-On Towel',
    why: 'The D-ring on the bag\'s front panel is purpose-built for a clip-on towel. It stays accessible between shots — left hand reach while walking — and dries on the move between holes.',
    href: '/golf-towels',
    price: '$18'
  },
  {
    zone: 'Bag Ring (Second Ring)',
    accessory: 'Club Brush',
    why: 'A carabiner-clip club brush hangs on the secondary bag ring. After every iron shot: 3 seconds with the nylon side, groove pick for packed dirt. The brush stays on the bag all season.',
    href: '/golf-club-care',
    price: '$16'
  },
  {
    zone: 'Hat or Glove Hand',
    accessory: 'Ball Marker (Hat Clip)',
    why: 'A magnetic hat-clip marker lives on the hat brim all round. One click to remove, one click back. No fumbling for a coin at the green.',
    href: '/golf-ball-markers',
    price: '$28'
  },
  {
    zone: 'Front Zipper Pocket',
    accessory: 'Tees + Divot Tool',
    why: 'The front zipper pocket: 10-15 tees, a divot tool, a pencil. Accessible by either hand on the tee box without opening the main pockets.',
    href: '/golf-divot-tools',
    price: '$14–$22'
  },
  {
    zone: 'Apparel Pocket',
    accessory: 'Golf Glove(s)',
    why: 'The lined apparel pocket protects cabretta leather from bag abrasion. Store the spare gloves sealed in their packaging — only the active glove lives loose.',
    href: '/golf-gloves',
    price: '$32/3-pack'
  },
  {
    zone: 'Ball Pocket (Large)',
    accessory: 'Golf Balls + Ball Marker Coins',
    why: 'The large ball pocket: 6-12 balls plus the backup coin markers. Keep a full sleeve of the same ball model in rotation — no mixing compression ratings mid-round.',
    href: '/golf-balls',
    price: '$34'
  },
  {
    zone: 'Side Pockets',
    accessory: 'Scorecard Holder + Yardage Book',
    why: 'A leather scorecard holder protects the card from sweat and rain. Fits flat in the side pocket with the course yardage guide. The organized bag has a system for every piece of paper.',
    href: '/golf-scorecard-holder',
    price: '$38'
  },
  {
    zone: 'Club Tube (beside shafts)',
    accessory: 'Alignment Sticks',
    why: 'Two alignment sticks slide down beside the clubs — they fit in any bag without a dedicated tube. Pull them for range warm-up, return before the round. Takes 10 seconds.',
    href: '/golf-training-aids',
    price: '$24'
  }
];

const bagOrganizationRules = [
  {
    rule: 'Clean the bag every 30 rounds',
    detail: 'Remove everything from all pockets, shake out the debris (tee shards, dirt, grass), and check expiry on anything perishable (energy gel, lip balm). A clean bag is a fast bag.'
  },
  {
    rule: 'Driver and woods at the top',
    detail: 'Large grips belong at the top of the bag (near the strap handles) so the long shafts do not tangle with short irons. Most 14-way bags have dedicated top slots — use them.'
  },
  {
    rule: 'Keep the bag weight balanced',
    detail: 'A bag that leans right or left on the stand indicates uneven pocket weight. Distribute heavy items (water, balls, rangefinder) across both side pockets. An unbalanced bag tips on slopes.'
  },
  {
    rule: 'One system, repeated every round',
    detail: 'The advantage of a consistent bag setup: no searching for tees, no fumbling for the ball marker. Every item in the same pocket, every round. It becomes automatic within 3 rounds.'
  }
];

function bagSetupScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (price <= 50) score += 8;
  if (/towel|brush|marker|alignment|glove|grip|ball|divot/i.test(product.title)) score += 6;
  return score;
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do you set up a golf bag?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Set up a golf bag in zones: (1) D-ring: clip a microfiber towel, (2) secondary ring: clip a club brush, (3) hat brim: magnetic ball marker, (4) front zipper pocket: tees and divot tool, (5) apparel pocket: golf gloves in packaging, (6) large ball pocket: 6-12 balls plus spare markers, (7) side pocket: scorecard holder and yardage book, (8) beside clubs: alignment sticks. One system, every round — no searching for anything.'
      }
    },
    {
      '@type': 'Question',
      name: 'What accessories does every golf bag need?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every golf bag needs: a clip-on towel (used between every iron shot), a club brush (clean grooves for consistent spin), a ball marker or hat-clip marker (used on every green), tees in the front pocket (always running short), a golf glove in the apparel pocket, and 6+ balls in the ball pocket. The total setup cost for these essentials at WYX Golf Supply Co. is under $100 before WYX10.'
      }
    },
    {
      '@type': 'Question',
      name: 'Where does the towel go on a golf bag?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A golf towel goes on the D-ring on the front panel of the bag. A clip-on towel with a carabiner or clip hangs on this ring — it swings freely, dries in the air between holes, and is accessible by either hand without opening a pocket. Never stuff a towel into a pocket — it stays wet and makes the pocket unavailable for other items.'
      }
    },
    {
      '@type': 'Question',
      name: 'What goes in a golf bag side pocket?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Golf bag side pockets work best for flat items: a leather scorecard holder, the course yardage guide, a GPS watch charger, a rain glove, lip balm, and a small first aid kit. Heavy items (water bottles, rangefinder) belong in the large side pockets — one on each side for weight balance. Keep the ball pocket separate from general gear.'
      }
    }
  ]
};

export default async function GolfBagSetup() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => bagSetupScore(b) - bagSetupScore(a)).slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Bag Organization</p>
          <h1>How to Set Up a Golf Bag.</h1>
          <p>Every pocket has a purpose. Every ring has a job. The organized golf bag means no fumbling for tees on the tee box, no searching for the ball marker on the green, and no wet towel stuffed into a pocket that should hold six balls.</p>
          <div className="actions">
            <Link className="button primary" href="#bag-zones">See the Setup Guide</Link>
            <Link className="button secondary dark" href="/bag-upgrades">Bag Upgrades →</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off your first order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">The Essentials Total</p>
          <h2>Under $100</h2>
          <p>Towel + club brush + ball marker + glove 3-pack + alignment sticks = the complete bag setup under $100 before WYX10. Five items, used every round.</p>
          <Link className="button primary" href="#setup-products" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Setup Gear →</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Bag setup highlights">
        <span>8 bag zones covered</span>
        <span>One system, every round</span>
        <span>Under $100 complete</span>
        <span>WYX10 saves 10%</span>
      </section>

      {/* The 8 Zones */}
      <section id="bag-zones" className="section reveal" aria-labelledby="zones-heading">
        <div className="section-heading">
          <p className="eyebrow">Zone by Zone</p>
          <h2 id="zones-heading">What Goes Where — 8 Bag Zones.</h2>
        </div>
        <div className="care-step-grid">
          {bagSetup.map((zone) => (
            <Link key={zone.zone} href={zone.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{zone.zone}: {zone.accessory} — {zone.price}</strong>
              <p>{zone.why}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section id="setup-products" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Setup Gear</p>
            <h2>Everything For the Organized Bag.</h2>
          </div>
          <Link className="text-link" href="/bag-upgrades">See Bag Upgrades</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Towels</strong><p>From $18</p></Link>
              <Link href="/golf-club-care" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Club Brushes</strong><p>From $16</p></Link>
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Markers</strong><p>From $28</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gloves</strong><p>3-Pack $32</p></Link>
            </div>
          )
        }
      </section>

      {/* Organization Rules */}
      <section className="section reveal" aria-labelledby="rules-heading">
        <div className="section-heading">
          <p className="eyebrow">The Rules</p>
          <h2 id="rules-heading">Four Bag Organization Principles.</h2>
        </div>
        <div className="care-step-grid">
          {bagOrganizationRules.map((item) => (
            <div key={item.rule} className="care-step-card">
              <strong>{item.rule}</strong>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal Link Grid */}
      <section className="section reveal" aria-labelledby="gear-heading">
        <div className="section-heading">
          <p className="eyebrow">Shop By Zone</p>
          <h2 id="gear-heading">Fill Every Bag Spot.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Golf Towels</strong>
            <p>Clip-on microfiber for the D-ring. Used between every iron shot.</p>
          </Link>
          <Link href="/golf-club-care" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Club Brushes</strong>
            <p>Brass wire + nylon bristle + groove pick. Lives on the bag ring.</p>
          </Link>
          <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Ball Markers</strong>
            <p>Magnetic hat-clip marker. Used every green, every round.</p>
          </Link>
          <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Golf Gloves</strong>
            <p>Cabretta 3-pack for the apparel pocket. Always have a fresh one.</p>
          </Link>
          <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Alignment Sticks</strong>
            <p>Slide beside the clubs. Pull for every range warm-up.</p>
          </Link>
          <Link href="/golf-divot-tools" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Divot Tools</strong>
            <p>Front zipper pocket. Use it every green you damage — course etiquette.</p>
          </Link>
          <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Scorecard Holders</strong>
            <p>Leather holder for the side pocket. Protects cards from sweat and rain.</p>
          </Link>
          <Link href="/golf-balls" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Golf Balls</strong>
            <p>Large ball pocket: 6-12 of one model. No mixing compression ratings.</p>
          </Link>
        </div>
      </section>

      <EmailCapture
        source="golf-bag-setup"
        campaign="bag_setup_guide"
        title="The Complete Bag Setup Checklist."
        body="Join the WYX list for the printable bag setup checklist, seasonal gear updates, and 10% off your first order with WYX10."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Set Up a Golf Bag',
        description: 'A step-by-step guide to organizing a golf bag — what goes in each pocket, what clips to each ring, and how to set up a system that works every round.',
        url: `${siteUrl}/golf-bag-setup`,
        step: bagSetup.map((zone, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: zone.zone,
          text: zone.why
        }))
      }) }} />
    </>
  );
}
