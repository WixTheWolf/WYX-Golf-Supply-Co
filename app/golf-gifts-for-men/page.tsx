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
  title: "Golf Gifts for Men — Practical Picks from $18 to $149 | WYX Golf Supply Co.",
  description: "Golf gifts for men that get used every round — gloves, leather scorecard holders, alignment sticks, rangefinders, GPS watches. By budget, ships in 1-3 days. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-men' },
  openGraph: {
    title: "Golf Gifts for Men | WYX Golf Supply Co.",
    description: "Golf gifts for men at every budget — practical accessories used every round. Gloves, scorecards, training aids, tech. WYX10 saves 10%.",
    url: '/golf-gifts-for-men'
  }
};

const picks = [
  { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', tag: 'Under $20', why: 'Used every hole of every round. The most-used golf accessory that most men never replace until someone gives them a new one. Dual-sided microfiber, carabiner clip.' },
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', tag: 'Under $25', why: 'Every scratch golfer uses these. Almost no amateur owns them. Two sticks, 10 minutes at the range — confirmed aim changes how a round feels from the first tee.' },
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', tag: 'Under $35', why: 'He burns through gloves fast and never stocks up. Three fresh cabretta gloves means three rounds starting right. Pick ML for most men if size is unclear.' },
  { label: 'Leather Scorecard Holder', price: '$38', href: '/golf-scorecard-holder', tag: 'Under $40', why: 'Full-grain leather, pencil loop, ball marker pocket. Engraving-ready front panel. Used every round, noticed by every playing partner. Lasts a decade.' },
  { label: 'Cord Grip Regrip Kit', price: '$48', href: '/golf-grips', tag: 'Under $50', why: 'The performance upgrade most men delay indefinitely. Full-set regrip at home in an afternoon for under $50. Every club in the bag feels new. Confidence at address.' },
  { label: 'Laser Rangefinder', price: '$119', href: '/golf-rangefinder', tag: 'Best Tech Gift', why: 'The most impactful golf tech upgrade. Slope compensation, pin-lock vibration, 800-yard range. Changes every approach shot permanently. If he does not own one, this is the gift.' },
  { label: 'GPS Golf Watch', price: '$149', href: '/golf-gps-watch', tag: 'Premium Gift', why: '40,000+ courses preloaded, front/middle/back, shot tracking, 18-hole battery. The wearable alternative to a rangefinder. Worn every round, mentioned to every partner.' },
  { label: 'Night Golf LED Balls', price: '$42', href: '/golf-balls', tag: 'Fun Gift', why: '12 LED-core balls that glow through the air and stay lit on impact. The experience gift for a man who has played 500 day rounds and zero night rounds. Completely original.' }
];

const faqs: [string, string][] = [
  ['What are the best golf gifts for men?', 'By budget: under $20 — microfiber towel; under $25 — alignment sticks; under $35 — glove 3-pack; under $40 — leather scorecard holder; under $50 — regrip kit; under $120 — rangefinder; under $150 — GPS watch. All available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf gift for a man has no size risk?', 'Towels ($18), alignment sticks ($24), leather scorecard holders ($38), regrip kits ($48), LED balls ($42), rangefinders ($119), and GPS watches ($149) are all completely size-free. Only the glove 3-pack requires a size — pick ML for most men if unsure.'],
  ['What golf gift for a man is most memorable?', 'The rangefinder ($119) if he does not own one — he mentions it to every playing partner on the first round. The leather scorecard holder ($38) if he does — the elegant, engraving-ready bag upgrade he has never bought himself. The LED night golf balls ($42) for the man who has everything — a completely novel experience.']
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

function menGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/glove|towel|scorecard|alignment|rangefinder|gps watch|regrip|night/i.test(product.title)) score += 8;
  if (price <= 50) score += 4;
  return score;
}

export default async function GolfGiftsForMenPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => menGiftScore(b) - menGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for Men',
        url: `${siteUrl}/golf-gifts-for-men`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for Men', item: `${siteUrl}/golf-gifts-for-men` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Gifts for Men</p>
          <h1>Golf Gifts for Men. Eight Picks He Will Use Every Single Round.</h1>
          <p>From the $18 towel he replaces every two years to the $149 GPS watch he wears to every round. Eight gifts at eight budgets — all the accessories a golfer uses every round and almost never buys for himself.</p>
          <div className="actions">
            <Link className="button primary" href="#men-grid">Shop Golf Gifts for Men</Link>
            <Link className="button secondary dark" href="/golf-gifts-for-golfers-who-have-everything">Golfer Who Has Everything &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Under $40</p>
          <h2>Leather Scorecard Holder</h2>
          <p>$38. Engraving-ready. Full-grain leather, pencil loop, ball marker pocket. Used every round, noticed by every playing partner. The bag upgrade most men never buy for themselves.</p>
          <Link className="button primary" href="/golf-scorecard-holder" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Holder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf gifts for men highlights">
        <span>Eight budget tiers</span>
        <span>No size guesswork on 7 of 8</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Eight Picks</p>
          <h2 id="picks-heading">Golf Gifts for Men at Every Budget.</h2>
        </div>
        <div className="care-step-grid">
          {picks.map((pick) => (
            <Link key={pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{pick.tag}</small>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="men-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts for Men.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Scorecard Holder — $38</strong><p>The bag upgrade</p></Link>
              <Link href="/golf-rangefinder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rangefinder — $119</strong><p>The most impactful upgrade</p></Link>
              <Link href="/golf-gps-watch" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Watch — $149</strong><p>Worn to every round</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gifts for Men FAQ.</h2>
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

      <EmailCapture
        source="golf-gifts-for-men"
        campaign="golf_gifts_men"
        title="Golf Gifts for Men. Practical Picks, Every Budget."
        body="Join the WYX list for gift guides, seasonal picks, and 10% off your first order with WYX10."
      />
    </>
  );
}
