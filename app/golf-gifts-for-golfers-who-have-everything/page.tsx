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
  title: "Golf Gifts for Golfers Who Have Everything — Creative Picks They Do Not Own | WYX Golf Supply Co.",
  description: "Golf gifts for golfers who have everything — 8 picks they almost certainly do not own: LED balls, a leather scorecard holder, a rangefinder, a regrip kit, and more. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-golfers-who-have-everything' },
  openGraph: {
    title: "Golf Gifts for Golfers Who Have Everything | WYX Golf Supply Co.",
    description: "Creative golf gifts for golfers who have everything — the accessories they know they should have and never buy themselves. WYX10 saves 10%.",
    url: '/golf-gifts-for-golfers-who-have-everything'
  }
};

const picks = [
  {
    label: 'Night Golf LED Ball Set',
    price: '$42',
    href: '/golf-balls',
    oddity: 'They do not own it',
    why: 'A 12-ball set of LED-core golf balls that glow through the air and remain lit on impact. The experience gift for the golfer who has played 1,000 rounds of regular golf and zero rounds of night golf. Completely novel, immediately fun, and no one they know owns a set.'
  },
  {
    label: 'Leather Scorecard Holder',
    price: '$38',
    href: '/golf-scorecard-holder',
    oddity: 'They own everything except this',
    why: 'The bag upgrade most golfers notice in another player\'s bag and never get for themselves. Full-grain leather, pencil loop, ball marker pocket, engraving-ready front panel. More than 80% of golfers — even avid players with premium bags — do not own one.'
  },
  {
    label: 'Cord Grip Regrip Kit',
    price: '$48',
    href: '/golf-grips',
    oddity: 'The performance upgrade they delay indefinitely',
    why: 'Every golfer knows their grips should be replaced annually. Almost none do it. A regrip kit with cord grips, tape, solvent, and a hook tool enables a full-set regrip in an afternoon for under $50. The gift that makes 14 clubs feel new again.'
  },
  {
    label: 'Putting Alignment Mirror',
    price: '$32',
    href: '/golf-training-aids',
    oddity: 'Tour-standard setup check they have never done',
    why: 'Shows eye position, shoulder line, and putter path simultaneously — the same feedback a putting coach charges $100/hour for. Used by every tour pro at some point in their career. Almost no amateur has used one at home.'
  },
  {
    label: 'Backyard Chipping Net',
    price: '$44',
    href: '/golf-training-aids',
    oddity: 'They practice everything except short game',
    why: 'Four-target folding chipping net. 20 minutes in the backyard. Folds flat in 60 seconds. The practice habit that produces more score improvement than hitting driver at the range — and the golfer who has everything almost certainly does not practice chipping at home.'
  },
  {
    label: 'Golf Ball Retriever',
    price: '$24',
    href: '/golf-ball-retriever',
    oddity: 'They have lost hundreds of balls without one',
    why: '15-foot telescoping stainless retriever. Collapses to 26 inches for the bag pocket. They have mentally calculated the money in their local water hazards for years. This retrieves it. The gift with a visible ROI within one round.'
  },
  {
    label: 'Laser Rangefinder',
    price: '$119',
    href: '/golf-rangefinder',
    oddity: 'If they do not own one — this is the gift',
    why: 'The most meaningful golf tech upgrade available. Slope compensation, 800-yard range, pin-lock vibration. If the golfer who "has everything" does not own a rangefinder — or owns one without slope — this is the one clear gift that changes the game.'
  },
  {
    label: 'Golf GPS Watch',
    price: '$149',
    href: '/golf-gps-watch',
    oddity: 'The rangefinder alternative they wear',
    why: '40,000+ courses preloaded, front/middle/back on every hole, shot tracking. The wearable alternative to a rangefinder — no aiming required. If they have a rangefinder but not a GPS watch, this is the complementary piece. Worn every round, mentioned to every playing partner.'
  }
];

const faqs: [string, string][] = [
  ['What do you get a golfer who has everything?', 'The best picks: (1) Night golf LED balls ($42 — the experience gift they have never had), (2) leather scorecard holder ($38 — most avid golfers do not own one), (3) regrip kit ($48 — the performance upgrade they delay every season), (4) putting alignment mirror ($32 — tour-standard setup check no amateur uses at home), (5) laser rangefinder ($119 — if they do not own one, this is the gift). Use WYX10 for 10% off at wyxgolfsupply.com.'],
  ['What golf accessories do even experienced golfers rarely own?', 'A leather scorecard holder (over 80% of golfers do not own one), a putting alignment mirror (nearly universal — even avid golfers have not used one), a regrip kit (most golfers pay a pro shop $10/grip instead of doing it at home), night golf LED balls, and a 15-foot ball retriever (they have been meaning to get one for years).'],
  ['Golf gift for a golfer who does not want more equipment?', 'Stick to consumables and practice tools: the LED night golf balls ($42) are a completely novel experience; the alignment mirror ($32) is a practice tool they have not tried; the regrip kit ($48) enables a maintenance task they know they should do. None of these add more clubs, bags, or gear — they upgrade what they already have.']
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

function hasEverythingScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const title = product.title.toLowerCase();
  let score = productQualityScore(product);
  if (/night|led|glow|scorecard|regrip|alignment mirror|chipping net|retriever|rangefinder|gps watch/i.test(title)) score += 10;
  return score;
}

export default async function GolfGiftsForGolfersWhoHaveEverythingPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => hasEverythingScore(b) - hasEverythingScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for Golfers Who Have Everything',
        url: `${siteUrl}/golf-gifts-for-golfers-who-have-everything`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for Golfers Who Have Everything', item: `${siteUrl}/golf-gifts-for-golfers-who-have-everything` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">For the Golfer Who Has Everything</p>
          <h1>Golf Gifts for Golfers Who Have Everything. Eight Picks They Almost Certainly Do Not Own.</h1>
          <p>The avid golfer with a premium bag, new irons, and a full subscription to Golf Digest almost certainly does not own a leather scorecard holder, has never played night golf, and has been meaning to regrip his clubs for three seasons. These are the gaps.</p>
          <div className="actions">
            <Link className="button primary" href="#has-everything-grid">Shop the List</Link>
            <Link className="button secondary dark" href="/night-golf">Night Golf Guide &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">The Surprise Pick</p>
          <h2>Night Golf LED Balls</h2>
          <p>$42. 12 LED-core balls that glow through the air. The experience gift for the golfer who has played 1,000 day rounds and zero night rounds. Completely novel. No one they know owns a set.</p>
          <Link className="button primary" href="/golf-balls" style={{ marginTop: '1rem', display: 'inline-block' }}>See the LED Balls &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf gifts for golfers who have everything">
        <span>8 picks they probably do not own</span>
        <span>Experience + practice + performance</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Eight Creative Picks</p>
          <h2 id="picks-heading">Golf Gifts for the Golfer Who Has Everything.</h2>
        </div>
        <div className="care-step-grid">
          {picks.map((pick) => (
            <Link key={pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{pick.oddity}</small>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="has-everything-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Gifts for the Golfer Who Has Everything.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-balls" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Night Golf LED Balls — $42</strong><p>The experience they have never had</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Scorecard Holder — $38</strong><p>The upgrade most avid golfers skip</p></Link>
              <Link href="/golf-grips" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Regrip Kit — $48</strong><p>The annual task they never do</p></Link>
              <Link href="/golf-rangefinder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rangefinder — $119</strong><p>If they do not own one, this is the gift</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gift for Golfers Who Have Everything FAQ.</h2>
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

      <section className="section reveal" aria-labelledby="links-heading">
        <div className="section-heading">
          <p className="eyebrow">More Gift Ideas</p>
          <h2 id="links-heading">Golf Gifts by Recipient.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-husband" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Husband</strong><p>Practical picks for the husband who golfs</p></Link>
          <Link href="/golf-gifts-for-men" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Men</strong><p>Practical picks at every budget</p></Link>
          <Link href="/golf-gifts-for-boyfriend" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Boyfriend</strong><p>Picks that feel personal, not generic</p></Link>
          <Link href="/golf-gifts-under-150" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $150</strong><p>The premium tier for the golfer who has it all</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-for-golfers-who-have-everything"
        campaign="golfer_who_has_everything"
        title="Golf Gifts That Still Surprise the Avid Golfer."
        body="Join the WYX list for creative gift guides, new product alerts, and 10% off your first order with WYX10."
      />
    </>
  );
}
