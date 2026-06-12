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
  title: "Golf Gifts for Boss — Professional, Practical Picks That Land Right | WYX Golf Supply Co.",
  description: "Golf gifts for a boss who golfs — the leather scorecard holder, a rangefinder, or quality accessories that say you understand the game. Professional and practical. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-boss' },
  openGraph: {
    title: "Golf Gifts for Boss | WYX Golf Supply Co.",
    description: "Golf gifts for a boss who golfs — professional picks that earn real appreciation. Leather accessories, rangefinders, GPS watches. WYX10 saves 10%.",
    url: '/golf-gifts-for-boss'
  }
};

const picks = [
  {
    label: 'Leather Scorecard Holder',
    price: '$38',
    href: '/golf-scorecard-holder',
    register: 'Professional + Practical',
    why: 'Full-grain leather, pencil loop, ball marker pocket, engraving-ready front panel. The professional golf gift that earns a bag spot in round 1 and gets used every round after. Says you understand golf, not just that you found the golf section.'
  },
  {
    label: 'Cabretta Glove 3-Pack',
    price: '$32',
    href: '/golf-gloves',
    register: 'Practical, Used Immediately',
    why: 'Three fresh cabretta gloves — the consumable gift that lands professionally. No size risk at ML for most men. Used within one round. The golf gift that says "I know what you use" rather than "I looked up golf gifts."'
  },
  {
    label: 'Laser Rangefinder',
    price: '$119',
    href: '/golf-rangefinder',
    register: 'Premium Boss Gift',
    why: 'The most impactful golf tech upgrade. Slope compensation, 800-yard range, pin-lock vibration. If the boss does not own one, this is the gift. If they do, upgrade them to slope mode. Appropriate for a formal gift occasion.'
  },
  {
    label: 'GPS Golf Watch',
    price: '$149',
    href: '/golf-gps-watch',
    register: 'Executive Gift Tier',
    why: '40,000+ courses preloaded, shot tracking, 18-hole battery. The executive golf gift that gets worn every round — visible to every playing partner for years. The gift that says thank you at a premium level without overstepping.'
  },
  {
    label: 'Microfiber Clip-On Towel',
    price: '$18',
    href: '/golf-towels',
    register: 'Light Occasion / Add-On',
    why: 'For a lighter gift occasion: a quality microfiber towel is used every hole and replaces one that has probably needed replacing for two seasons. Small, appropriate, specific to the game.'
  },
  {
    label: 'Alignment Sticks 2-Pack',
    price: '$24',
    href: '/golf-training-aids',
    register: 'For the Boss Who Practices',
    why: 'The training tool every scratch player uses and almost no recreational golfer owns. Two sticks, 10 minutes before a round. The specific golf gift that says you know they take the game seriously.'
  }
];

const faqs: [string, string][] = [
  ['What is the best golf gift for a boss?', 'The leather scorecard holder ($38) is the best under-$50 boss gift — engraving-ready, full-grain leather, used every round, says you understand the game. The rangefinder ($119) is the best premium boss gift. The GPS watch ($149) is the executive-tier gift for a formal occasion. Use WYX10 for 10% off at wyxgolfsupply.com.'],
  ['Is a golf gift appropriate for a boss?', 'A golf gift is appropriate for a boss who golfs — it is specific, non-personal, and practical. The leather scorecard holder and glove 3-pack are professional in register and used every round. Avoid anything too personal (engraved without asking), too casual (novelty items), or too inexpensive for the occasion (unless it is a group contribution).'],
  ['What golf gift for a boss is appropriate at the office?', 'The leather scorecard holder ($38) is the most professionally appropriate golf boss gift — it reads as an accessory rather than a hobby item if unwrapped at the office, and is unambiguously high quality. The glove 3-pack ($32) is an equally appropriate runner-up. Both are practical, not novelty, and specific to the game.']
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

function bossGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/scorecard|leather|rangefinder|gps watch|glove/i.test(product.title)) score += 10;
  if (price >= 30 && price <= 60) score += 5;
  return score;
}

export default async function GolfGiftsForBossPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => bossGiftScore(b) - bossGiftScore(a))
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for Boss',
        url: `${siteUrl}/golf-gifts-for-boss`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for Boss', item: `${siteUrl}/golf-gifts-for-boss` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Professional Golf Gifts</p>
          <h1>Golf Gifts for Boss. Professional, Practical, and Actually Used.</h1>
          <p>The leather scorecard holder says you understand golf — not just that you found the golf section. Six picks from $18 to $149, all professionally appropriate and used every round after receiving them. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#boss-grid">Shop Boss Gift Picks</Link>
            <Link className="button secondary dark" href="/golf-corporate-gifts">Corporate Golf Gifts &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Under $40</p>
          <h2>Leather Scorecard Holder</h2>
          <p>$38. Full-grain leather. Engraving-ready. Pencil loop, ball marker pocket. Used every round. The gift that says you understand the game — professionally appropriate for any occasion.</p>
          <Link className="button primary" href="/golf-scorecard-holder" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Holder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf boss gift highlights">
        <span>Professional-register picks</span>
        <span>From $18 to $149</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Professional Picks</p>
          <h2 id="picks-heading">Golf Gifts for Boss at Every Budget.</h2>
        </div>
        <div className="care-step-grid">
          {picks.map((pick) => (
            <Link key={pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{pick.register}</small>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="boss-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts for Boss.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Scorecard Holder — $38</strong><p>Professional + practical</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round</p></Link>
              <Link href="/golf-rangefinder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rangefinder — $119</strong><p>Premium boss gift</p></Link>
              <Link href="/golf-gps-watch" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Watch — $149</strong><p>Executive tier</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gift for Boss FAQ.</h2>
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
        <div className="section-heading"><p className="eyebrow">More Gift Ideas</p><h2 id="links-heading">Golf Gifts for Every Workplace Occasion.</h2></div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-coworkers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Coworkers</strong><p>Group-friendly picks under $35</p></Link>
          <Link href="/golf-tournament-prizes" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Tournament Prizes</strong><p>Six-tier prize structure for any event</p></Link>
          <Link href="/golf-gift-sets" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gift Sets</strong><p>Curated bundles by budget</p></Link>
          <Link href="/golf-gifts-under-150" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts Under $150</strong><p>Serious gifts for serious golfers</p></Link>
          <Link href="/golf-gifts-for-dad" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Dad</strong><p>Practical picks at every budget</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-for-boss"
        campaign="boss_golf_gifts"
        title="Golf Gifts for the Boss Who Golfs."
        body="Join the WYX list for professional gift guides and 10% off your first order with WYX10."
      />
    </>
  );
}
