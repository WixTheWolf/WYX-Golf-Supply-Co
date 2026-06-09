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
  title: "Scramble Prizes — Golf Tournament Prize Ideas That Players Actually Want | WYX Golf Supply Co.",
  description: "Scramble prize ideas for golf tournaments and outings — accessories, training aids, and gear picks that players actually keep. Budget options for 4-person teams, closest-to-pin, and long drive. Use WYX10 for 10% off.",
  alternates: { canonical: '/scramble-prizes' },
  openGraph: {
    title: "Scramble Prize Ideas | Golf Tournament Prizes | WYX Golf Supply Co.",
    description: "Golf scramble prizes that players actually want to win. Practical accessories and gear picks for every prize category and budget. WYX10 for 10% off.",
    url: '/scramble-prizes'
  }
};

const prizeCategories = [
  {
    category: 'Closest to the Pin',
    budget: '$18–$32',
    picks: [
      { label: 'Milled Ball Marker Set', price: '$28', href: '/golf-ball-markers', note: 'The gift every golfer wants and never buys. Gift-box presentation.' },
      { label: 'Premium Divot Tool Set', price: '$22', href: '/golf-divot-tools', note: 'Magnetic fork-style divot tool with hat-clip marker combo.' },
      { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', note: 'Used every round immediately. Practical wins.' }
    ]
  },
  {
    category: 'Long Drive',
    budget: '$24–$48',
    picks: [
      { label: 'Alignment Sticks (2-pack)', price: '$24', href: '/golf-training-aids', note: 'What every tour pro uses. The one training aid that fixes 4 problems.' },
      { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', note: 'The longest hitters go through gloves fastest. A 3-pack is always welcome.' },
      { label: 'Cord Grip Regrip Kit', price: '$48', href: '/golf-grips', note: '13 grips + solvent + tape. Regrip the full bag at home. Serious prize.' }
    ]
  },
  {
    category: 'Winning Team',
    budget: '$32–$75 per player',
    picks: [
      { label: 'Glove 3-Pack + Towel Bundle', price: '$50', href: '/golf-gloves', note: 'Glove 3-pack ($32) + clip-on towel ($18) = $50/player. Used every round.' },
      { label: 'GPS Watch', price: '$149', href: '/golf-gps-watch', note: 'The premium individual prize. 40,000+ courses. Wins the room.' },
      { label: 'Leather Scorecard Holder', price: '$38', href: '/golf-scorecard-holder', note: 'Elegant practical prize. 10-year lifespan. Memorable gift.' }
    ]
  },
  {
    category: 'Raffle / Participation',
    budget: '$14–$22',
    picks: [
      { label: 'Bamboo Tee 500-Count Pack', price: '$14', href: '/golf-balls', note: 'Solves a problem every golfer has. Always appreciated, always used.' },
      { label: 'Dual-Sided Club Brush', price: '$16', href: '/golf-club-care', note: 'Carabiner clip, stays on bag all season. Under $20.' },
      { label: 'Ball Stamp Set', price: '$22', href: '/golf-ball-markers', note: 'Custom-stamp golf balls. Unique, interactive, useful.' }
    ]
  }
];

const bulkTips = [
  {
    tip: 'Buy per-player, not per-event',
    detail: 'The best scramble prize approach: every player gets the same practical item (a towel, a brush, or a marker set) regardless of finishing position, plus category winners get an upgrade. Everyone goes home with something useful — that is what they remember.'
  },
  {
    tip: 'Practical beats trophy every time',
    detail: 'A $28 milled ball marker set beats a $50 trophy for remembered value. The marker goes in the bag that week. The trophy goes on a shelf and gets forgotten. Prizes that travel home in a golf bag pocket win.'
  },
  {
    tip: 'Size-free picks for group orders',
    detail: 'Accessories eliminate sizing anxiety for event organizers. No shirt size spreadsheet. No glove size chart beyond S/M/L/XL. A ball marker, towel, or training aid fits everyone at every skill level.'
  },
  {
    tip: 'Use WYX10 on group orders',
    detail: 'The WYX10 code works on every order. For group orders, it stretches the prize budget across more players. 10% off 20 towels is $36 back in the prize budget.'
  }
];

function scramblePrizeScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (price <= 75) score += 5;
  if (price <= 40) score += 5;
  if (/marker|towel|brush|glove|alignment|grip|gps|ball|divot|scorecard/i.test(product.title)) score += 5;
  return score;
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are good golf scramble prizes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Good golf scramble prizes by category: Closest-to-pin — milled ball marker set ($28), divot tool combo ($22), or clip-on towel ($18). Long drive — alignment sticks ($24), glove 3-pack ($32), or cord grip kit ($48). Winning team — GPS watch ($149 per player), glove + towel bundle ($50), or leather scorecard holder ($38). Participation raffle — bamboo tee pack ($14) or dual-sided club brush ($16). All available at WYX Golf Supply Co. with WYX10 for 10% off.'
      }
    },
    {
      '@type': 'Question',
      name: 'What golf prizes do players actually want to win?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The golf prizes players most want: a GPS watch (the premium individual prize), a cabretta glove 3-pack (always needed, never bought in advance), a milled ball marker set (the self-buy test), and alignment sticks (practical training aid used every range session). Practical accessories beat trophies in remembered value every time.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much should I budget for golf scramble prizes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Golf scramble prize budgets: Participation/raffle $14-$22 (tees, club brush, ball stamps). Closest-to-pin/long drive $22-$48 (divot tool, towel, alignment sticks, gloves). Winning team $32-$149 per player (glove + towel bundle, scorecard holder, GPS watch). Use WYX10 for 10% off any order at WYX Golf Supply Co.'
      }
    }
  ]
};

export default async function ScramblePrizes() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => scramblePrizeScore(b) - scramblePrizeScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Tournament Prizes</p>
          <h1>Scramble Prizes That Players Actually Want.</h1>
          <p>Closest to the pin, long drive, and winning team prizes that travel home in a golf bag pocket — not trophies that go on a shelf and get forgotten. Four prize categories, every budget.</p>
          <div className="actions">
            <Link className="button primary" href="#prize-grid">Shop Prize Picks</Link>
            <Link className="button secondary dark" href="/scramble-prize-ideas">More Prize Ideas →</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off — stretches the prize budget.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best All-Player Prize</p>
          <h2>$18 Towel</h2>
          <p>Every player gets a clip-on microfiber towel. Everyone goes home with something useful. $18/player × 20 players = $360. Practical, memorable, immediately used.</p>
          <Link className="button primary" href="/golf-towels" style={{ marginTop: '1rem', display: 'inline-block' }}>See Towels →</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Scramble prize highlights">
        <span>4 prize categories</span>
        <span>$14–$149 picks</span>
        <span>WYX10 saves 10%</span>
        <span>Size-free, no hassle</span>
      </section>

      {prizeCategories.map((cat) => (
        <section key={cat.category} className="section reveal" aria-labelledby={`cat-${cat.category.split(' ')[0].toLowerCase()}`}>
          <div className="section-heading">
            <p className="eyebrow">Prize Category</p>
            <h2 id={`cat-${cat.category.split(' ')[0].toLowerCase()}`}>{cat.category} — {cat.budget}</h2>
          </div>
          <div className="care-step-grid">
            {cat.picks.map((pick) => (
              <Link key={pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
                <strong>{pick.label} — {pick.price}</strong>
                <p>{pick.note}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section id="prize-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Prizes</p>
            <h2>All Prize Picks.</h2>
          </div>
          <Link className="text-link" href="/products">See Full Shop</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Marker Sets</strong><p>$28 — Perfect CTP prize</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Clip-On Towels</strong><p>$18 — All-player prize</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Packs</strong><p>$32 — Long drive prize</p></Link>
              <Link href="/golf-gps-watch" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Watch</strong><p>$149 — Team winner prize</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="tips-heading">
        <div className="section-heading">
          <p className="eyebrow">Organizer Tips</p>
          <h2 id="tips-heading">How to Choose Scramble Prizes.</h2>
        </div>
        <div className="care-step-grid">
          {bulkTips.map((item) => (
            <div key={item.tip} className="care-step-card">
              <strong>{item.tip}</strong>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <EmailCapture
        source="scramble-prizes"
        campaign="tournament_organizer"
        title="Planning a Golf Outing or Scramble?"
        body="Join the WYX list for the prize planning checklist, group order tips, and 10% off with WYX10."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Scramble Prizes',
        description: 'Golf tournament and scramble prize ideas — practical accessories and gear picks for closest-to-pin, long drive, team prizes, and participation raffles.',
        url: `${siteUrl}/scramble-prizes`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Scramble Prizes', item: `${siteUrl}/scramble-prizes` }
          ]
        }
      }) }} />
    </>
  );
}
