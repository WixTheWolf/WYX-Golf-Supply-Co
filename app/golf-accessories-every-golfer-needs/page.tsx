import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { siteUrl } from '@/lib/feed';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Golf Accessories Every Golfer Needs — The Essential Bag Setup | WYX Golf Supply Co.",
  description: "Golf accessories every golfer needs but rarely buys themselves: a microfiber towel, fresh gloves, alignment sticks, a leather scorecard holder, and a rangefinder. WYX10 saves 10%.",
  alternates: { canonical: '/golf-accessories-every-golfer-needs' },
  openGraph: {
    title: "Golf Accessories Every Golfer Needs | WYX Golf Supply Co.",
    description: "The essential golf bag setup — 6 accessories every golfer needs, uses every round, and almost never buys for themselves. WYX10 saves 10%.",
    url: '/golf-accessories-every-golfer-needs'
  }
};

const essentials = [
  {
    number: '01',
    label: 'Microfiber Clip-On Towel',
    price: '$18',
    href: '/golf-towels',
    reason: 'Dirty grooves = no spin. A microfiber towel clipped to the bag D-ring is the most-used accessory in golf. Wipe the face after every iron shot. After 18 holes the face that started clean stays clean.'
  },
  {
    number: '02',
    label: 'Fresh Cabretta Gloves',
    price: '$32 (3-pack)',
    href: '/golf-gloves',
    reason: 'A worn glove slips at the top of the backswing. Most golfers play 3-4 months past the point where a glove should be replaced. A 3-pack of cabretta leather gloves costs $32 and keeps grip confidence through an entire season.'
  },
  {
    number: '03',
    label: 'Alignment Sticks',
    price: '$24 (2-pack)',
    href: '/golf-training-aids',
    reason: 'Poor aim is the most common swing diagnosis that has nothing to do with the swing. Two sticks placed before a range session confirm ball position, stance width, and club path. 10 minutes of confirmed aim changes how a round feels from the first tee.'
  },
  {
    number: '04',
    label: 'Leather Scorecard Holder',
    price: '$38',
    href: '/golf-scorecard-holder',
    reason: 'A scorecard holder is not decorative — it is the pencil-loop, ball-marker-pocket, course-layout-reference that keeps the essentials in one spot without digging in the bag on every tee. The one most golfers notice in another player\'s bag and never buy for themselves.'
  },
  {
    number: '05',
    label: 'Ball Retriever',
    price: '$24',
    href: '/golf-ball-retriever',
    reason: 'Every golfer hits one into the water per season, on average. A 15-foot telescoping retriever collapses to 26 inches and lives in a side pocket. The accessory with the most obvious ROI of anything in the bag.'
  },
  {
    number: '06',
    label: 'Laser Rangefinder',
    price: '$119',
    href: '/golf-rangefinder',
    reason: 'The upgrade that changes every approach shot. Slope compensation converts the true yardage. Pin-lock vibration confirms the flag. 800-yard range covers any par 5. Every club selection is now based on a number, not a guess. The single most impactful golf accessory purchase available.'
  }
];

const faqs: [string, string][] = [
  ['What golf accessories does every golfer need?', 'Six essentials: (1) microfiber towel ($18 — used every hole), (2) fresh cabretta gloves ($32 for 3-pack — used every round), (3) alignment sticks ($24 — every range session), (4) leather scorecard holder ($38 — every round, all season), (5) ball retriever ($24 — pays for itself in round 1), (6) laser rangefinder ($119 — changes every approach shot). Total for all six: $235. With WYX10 at checkout: $211.50.'],
  ['Which golf accessories should I buy first?', 'Priority order: (1) microfiber towel ($18 — immediate impact on every shot), (2) fresh gloves ($32 — grip confidence), (3) alignment sticks ($24 — the most overlooked practice tool). After those three, add the scorecard holder ($38) for in-round organization and the rangefinder ($119) for yardage precision.'],
  ['What golf accessories make the biggest difference?', 'The rangefinder makes the biggest single-round difference — removes all yardage guesswork from every approach. Alignment sticks make the biggest practice impact — confirms aim before swinging instead of practicing bad alignment. Fresh gloves make the biggest feel impact — grip confidence affects every full swing from the first tee.']
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

export default async function GolfAccessoriesEveryGolferNeedsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => productQualityScore(b) - productQualityScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Accessories Every Golfer Needs',
        url: `${siteUrl}/golf-accessories-every-golfer-needs`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Accessories', item: `${siteUrl}/golf-accessories-every-golfer-needs` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">The Essential Bag Setup</p>
          <h1>Golf Accessories Every Golfer Needs. Six Picks. All Used Every Round.</h1>
          <p>A towel, a fresh glove, alignment sticks, a leather scorecard holder, a ball retriever, and a rangefinder. These are the six accessories a golfer uses every single round — the ones almost everyone knows they should have and almost no one buys for themselves.</p>
          <div className="actions">
            <Link className="button primary" href="#essentials-grid">Shop Essentials</Link>
            <Link className="button secondary dark" href="/golf-rangefinder">See the Rangefinder &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most-Used Accessory</p>
          <h2>Microfiber Towel</h2>
          <p>$18. Used every hole, every round. Clean grooves produce clean contact produce predictable spin. The highest-use accessory in any bag — and one most golfers are still using from two seasons ago.</p>
          <Link className="button primary" href="/golf-towels" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Towel &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf essentials highlights">
        <span>6 essentials from $18 to $119</span>
        <span>All used every round</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="essentials-heading">
        <div className="section-heading">
          <p className="eyebrow">The Essential Six</p>
          <h2 id="essentials-heading">Golf Accessories Every Golfer Needs.</h2>
        </div>
        <div className="care-step-grid">
          {essentials.map((e) => (
            <Link key={e.label} href={e.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.5, fontWeight: 700, display: 'block' }}>{e.number}</small>
              <strong>{e.label} — {e.price}</strong>
              <p>{e.reason}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="essentials-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Essential Golf Accessories.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Every hole</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Every round</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Scorecard Holder — $38</strong><p>Every round for a decade</p></Link>
              <Link href="/golf-rangefinder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rangefinder — $119</strong><p>Every approach shot</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Accessories FAQ.</h2>
        </div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (
            <div key={q} className="care-step-card">
              <strong>{q}</strong>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal" aria-labelledby="more-accessories-heading">
        <div className="section-heading"><p className="eyebrow">More Accessories</p><h2 id="more-accessories-heading">The Niche Picks That Round Out the Bag.</h2></div>
        <div className="care-step-grid">
          <Link href="/golf-compression-socks" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Compression Socks</strong><p>Back nine feels like the front nine</p></Link>
          <Link href="/golf-impact-tape" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Impact Tape</strong><p>See exactly where you're hitting it</p></Link>
          <Link href="/golf-putter-headcovers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Putter Headcovers</strong><p>Protect the club you use most</p></Link>
          <Link href="/golf-water-bottle" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Water Bottle &amp; Flask</strong><p>Stay sharp through 18</p></Link>
          <Link href="/golf-belts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Belts</strong><p>Stretch ratchet and leather, stays through the swing</p></Link>
          <Link href="/golf-travel-bag" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Travel Bag</strong><p>Eight accessories for any golf trip</p></Link>
          <Link href="/golf-tech" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Tech</strong><p>Reduces the mental load of every round</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-accessories-every-golfer-needs"
        campaign="golf_essentials"
        title="The Golf Accessories You Actually Use. All of Them."
        body="Join the WYX list for gear guides, new products, and 10% off your first order with WYX10."
      />
    </>
  );
}
