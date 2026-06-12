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
  title: "Golf Gifts for Husband — Practical Picks He Will Actually Use | WYX Golf Supply Co.",
  description: "Golf gifts for your husband that earn a permanent bag spot — fresh gloves, leather accessories, a rangefinder, and the training tools he would never buy himself. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-husband' },
  openGraph: {
    title: "Golf Gifts for Husband | WYX Golf Supply Co.",
    description: "Golf gifts for husband that get used every round — not the shelf. Gloves, leather holders, rangefinders, training aids. WYX10 saves 10%.",
    url: '/golf-gifts-for-husband'
  }
};

const byBudget = [
  {
    tier: 'Under $25',
    picks: [
      { label: 'Alignment Sticks 2-Pack — $24', href: '/golf-training-aids', why: 'The training tool every instructor uses. Two sticks, 10 minutes before a round. He will use these every range session and wonder why he waited.' },
      { label: 'Clip-On Microfiber Towel — $18', href: '/golf-towels', why: 'Used every round from hole 1 through 18. No size risk. The most overlooked bag essential.' }
    ]
  },
  {
    tier: 'Under $40',
    picks: [
      { label: 'Cabretta Glove 3-Pack — $32', href: '/golf-gloves', why: 'He goes through 8-15 gloves a season and almost never buys in bulk. A 3-pack means 3 fresh gloves waiting — not the cracked one from two months ago.' },
      { label: 'Leather Scorecard Holder — $38', href: '/golf-scorecard-holder', why: 'Full-grain leather with pencil loop and ball marker pocket. The bag upgrade that lasts a decade. Engraving-ready for initials.' }
    ]
  },
  {
    tier: 'Under $60',
    picks: [
      { label: 'Cord Grip Regrip Kit — $48', href: '/golf-grips', why: 'Regrip a full set at home in an afternoon for under $50. The performance upgrade he never bothers to do. Everything included.' },
      { label: 'Backyard Chipping Net — $44', href: '/golf-training-aids', why: 'Four-target folding chipping net. 20 minutes in the backyard before dinner. Folds flat in 60 seconds. The short game practice he will actually do.' }
    ]
  },
  {
    tier: 'Under $120',
    picks: [
      { label: 'Laser Rangefinder — $119', href: '/golf-rangefinder', why: 'The most impactful golf tech upgrade. Slope compensation, pin-lock vibration, 800-yard range. If he does not own one, this is the gift. If he owns one without slope, upgrade him.' },
      { label: 'GPS Golf Watch — $149', href: '/golf-gps-watch', why: '40,000+ courses, front/middle/back on every hole, shot tracking, 18-hole battery. He mentions it every round to his playing partners.' }
    ]
  }
];

const faqs: [string, string][] = [
  ['What is the best golf gift for a husband who has everything?', 'A laser rangefinder ($119) if he does not own one — the most impactful upgrade in golf. A leather scorecard holder ($38) if he does — the elegant practical gift he would never buy himself. A cord regrip kit ($48) if his grips are older than a year — the performance upgrade most golfers delay indefinitely.'],
  ['What golf gift has no sizing risk?', 'Towels ($18), alignment sticks ($24), ball markers ($28), leather scorecard holders ($38), rangefinders ($119), GPS watches ($149). All of these are completely size-free. Gloves come in S/M/ML/L — pick ML if unsure, it fits the widest range.'],
  ['Best golf gift for a husband birthday?', 'By budget: under $25 — alignment sticks ($24); under $40 — glove 3-pack ($32); under $60 — regrip kit ($48) or chipping net ($44); under $150 — rangefinder ($119) or GPS watch ($149). All available at wyxgolfsupply.com with WYX10 for 10% off.']
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

function husbandGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/glove|towel|marker|alignment|scorecard|rangefinder|gps watch|regrip|chipping net/i.test(product.title)) score += 8;
  if (price <= 50) score += 5;
  return score;
}

export default async function GolfGiftsForHusbandPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => husbandGiftScore(b) - husbandGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for Husband',
        url: `${siteUrl}/golf-gifts-for-husband`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for Husband', item: `${siteUrl}/golf-gifts-for-husband` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">For the Husband Who Golfs</p>
          <h1>Golf Gifts for Husband. The Picks That Earn a Bag Spot.</h1>
          <p>Not the shelf, not the closet — the bag. These are the accessories he uses every round and the upgrades he always delays buying for himself. Size-free picks for every budget, from $18 to $149.</p>
          <div className="actions">
            <Link className="button primary" href="#husband-grid">Shop All Picks</Link>
            <Link className="button secondary dark" href="/golf-rangefinder">See the Rangefinder &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Gift Under $40</p>
          <h2>Glove 3-Pack</h2>
          <p>$32. He goes through 8-15 gloves a season and almost never stocks up. Three fresh cabretta gloves ready in the bag — used within one round of receiving them. No size risk with ML.</p>
          <Link className="button primary" href="/golf-gloves" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Gloves &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf husband gift highlights">
        <span>By budget tier</span>
        <span>No sizing guesswork</span>
        <span>WYX10 saves 10%</span>
        <span>Used every round</span>
      </section>

      <section className="section reveal" aria-labelledby="budget-heading">
        <div className="section-heading">
          <p className="eyebrow">Shop by Budget</p>
          <h2 id="budget-heading">Golf Gifts for Husband at Every Price.</h2>
        </div>
        {byBudget.map((tier) => (
          <div key={tier.tier} style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', opacity: 0.7 }}>{tier.tier}</h3>
            <div className="care-step-grid">
              {tier.picks.map((pick) => (
                <Link key={pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
                  <strong>{pick.label}</strong>
                  <p>{pick.why}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section id="husband-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts for Husband.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round, never in stock</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Scorecard Holder — $38</strong><p>The elegant bag upgrade</p></Link>
              <Link href="/golf-rangefinder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Laser Rangefinder — $119</strong><p>Most impactful golf tech upgrade</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>Every range session, every pro uses them</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Common Questions</p>
          <h2 id="faq-heading">Golf Gift for Husband FAQ.</h2>
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
          <Link href="/golf-gifts-for-men" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Men</strong><p>Practical picks at every budget</p></Link>
          <Link href="/golf-gifts-for-golfers-who-have-everything" className="care-step-card" style={{ textDecoration: 'none' }}><strong>For the Golfer Who Has Everything</strong><p>Creative picks beyond the obvious gifts</p></Link>
          <Link href="/golf-gifts-for-anniversary" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Anniversary Gifts</strong><p>Elevated picks for a milestone occasion</p></Link>
          <Link href="/best-golf-gifts-under-100" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $100</strong><p>Rangefinders, regrip kits, and full bag upgrades</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-for-husband"
        campaign="husband_golf_gifts"
        title="Golf Gifts for the Husband Who Golfs."
        body="Join the WYX list for gift guides, seasonal picks, and 10% off your first order with WYX10."
      />
    </>
  );
}
