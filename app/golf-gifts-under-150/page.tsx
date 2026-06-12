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
  title: "Golf Gifts Under $150 — Serious Golf Gifts for the Serious Golfer | WYX Golf Supply Co.",
  description: "Golf gifts under $150 for the serious golfer — GPS rangefinder, leather scorecard holder, putting mat, premium glove packs, and the full practice setup. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-under-150' },
  openGraph: {
    title: "Golf Gifts Under $150 | WYX Golf Supply Co.",
    description: "Golf gifts under $150 that match serious players — GPS rangefinder, leather accessories, full practice setup. WYX10 saves 10%.",
    url: '/golf-gifts-under-150'
  }
};

const picks = [
  {
    label: 'GPS Laser Rangefinder',
    price: '$119',
    href: '/golf-tech-gifts',
    tag: 'Premium Pick',
    why: 'The flagship golf gift under $150. Slope compensation, 5-yard accuracy, rechargeable via USB-C. Reduces the mental load of every approach shot — no more estimating, no more pacing. The serious golfer who does not own one is leaving shots on the table.'
  },
  {
    label: 'Leather Scorecard Holder',
    price: '$79',
    href: '/golf-gifts-for-men',
    tag: 'Prestige Pick',
    why: 'Full-grain leather scorecard holder with magnetic closure and front pocket for tees and markers. Engraving panel on the back for personalization. The golf gift that signals occasion-level thoughtfulness — not the standard accessory purchase, but a deliberate gift with weight.'
  },
  {
    label: 'Putting Mat + Alignment Mirror Bundle',
    price: '$86',
    href: '/golf-putting-mat',
    tag: 'Practice Set',
    why: 'A 9-foot velvet putting mat ($54) and a folding alignment mirror ($32) — the complete home putting studio. 10 minutes before dinner, tour-level setup feedback, auto-return mechanism. 40% of strokes come on the green; this bundle attacks the area of the game with the highest ROI.'
  },
  {
    label: 'Chipping Net + Alignment Sticks Bundle',
    price: '$68',
    href: '/golf-training-aids',
    tag: 'Short Game Setup',
    why: 'A 4-target backyard chipping net ($44) and alignment sticks 2-pack ($24) — the full home short game setup. 20 minutes before dinner, four chipping targets, aim confirmed before every chip. The practice setup that produces more score improvement than any additional range time.'
  },
  {
    label: 'Cabretta Glove 3-Pack',
    price: '$32',
    href: '/golf-gloves',
    tag: 'Add-On Gift',
    why: 'Three cabretta leather gloves — the consumable gift that pairs well with any item in this list. A rangefinder gift plus a glove 3-pack ($151 total, $136 with WYX10) is the complete serious player gift combination under $150 per item.'
  }
];

const faqs: [string, string][] = [
  ['What are the best golf gifts under $150?', 'Five picks: GPS laser rangefinder ($119 — the flagship practical golf gift), leather scorecard holder ($79 — prestige gift for the serious player), putting mat + alignment mirror ($86 bundle), chipping net + alignment sticks ($68 bundle), or glove 3-pack ($32 as an add-on). All at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['Is a golf rangefinder a good gift under $150?', 'Yes — a GPS laser rangefinder ($119) is the single best practical golf gift under $150. It eliminates approach shot guessing, reduces round time, and is used on every hole of every round. Most serious golfers who do not own one are actively thinking about buying one.'],
  ['What golf gift is appropriate for the serious golfer who has most accessories?', 'The leather scorecard holder ($79) for prestige — most golfers do not own one even after years of play. Or the GPS rangefinder ($119) — the serious upgrade that most golfers have delayed purchasing for themselves. Both are at wyxgolfsupply.com with WYX10 for 10% off.']
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

function under150Score(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  if (price > 150) return 0;
  let score = productQualityScore(product);
  if (/rangefinder|scorecard|putting mat|leather|glove/i.test(product.title)) score += 10;
  if (price >= 50) score += 5;
  return score;
}

export default async function GolfGiftsUnder150Page() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .filter((p) => Number(productPrice(p).amount) <= 150)
    .sort((a, b) => under150Score(b) - under150Score(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts Under $150',
        url: `${siteUrl}/golf-gifts-under-150`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts Under $150', item: `${siteUrl}/golf-gifts-under-150` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Premium Golf Gifts</p>
          <h1>Golf Gifts Under $150. Serious Gifts for Serious Golfers.</h1>
          <p>Five picks for the golfer who already has the basics — a GPS laser rangefinder, a leather scorecard holder, the complete practice setup, and the bundles that produce visible handicap improvement within two weeks. All under $150. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#under150-grid">Shop Premium Picks</Link>
            <Link className="button secondary dark" href="/golf-tech-gifts">Golf Tech Gifts &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Premium Pick — $119</p>
          <h2>GPS Laser Rangefinder</h2>
          <p>Slope compensation, 5-yard accuracy, USB-C rechargeable. The serious golfer without one is leaving shots on the table. The golf gift that is used on every hole of every round — the most impactful single purchase under $150.</p>
          <Link className="button primary" href="/golf-tech-gifts" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Rangefinder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf gifts under 150 highlights">
        <span>All under $150</span>
        <span>GPS rangefinder available</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Five Premium Picks</p>
          <h2 id="picks-heading">Golf Gifts Under $150.</h2>
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

      <section id="under150-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Premium Golf Gifts</p>
            <h2>Golf Gifts Under $150.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts">All Golf Gifts &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-tech-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Rangefinder — $119</strong><p>The flagship gift under $150</p></Link>
              <Link href="/golf-gifts-for-men" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Scorecard Holder — $79</strong><p>Prestige gift for serious golfers</p></Link>
              <Link href="/golf-putting-mat" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Putting Mat — $54</strong><p>Home putting studio</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Chipping Net + Alignment Sticks — $68</strong><p>Full short game setup</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gifts Under $150 FAQ.</h2>
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

      <section className="section reveal" aria-labelledby="more-heading">
        <div className="section-heading">
          <p className="eyebrow">More Budget Guides</p>
          <h2 id="more-heading">Golf Gifts at Every Budget.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-under-25" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $25</strong><p>Five practical picks all used every round</p></Link>
          <Link href="/golf-gifts-under-60" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $60</strong><p>Easy gift picks and useful bag upgrades</p></Link>
          <Link href="/best-golf-gifts-under-100" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $100</strong><p>The sweet-spot gift budget for any golfer</p></Link>
          <Link href="/golf-corporate-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Corporate Golf Gifts</strong><p>Client gifts, tournament prizes, group orders</p></Link>
          <Link href="/golf-tournament-prizes" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Tournament Prizes</strong><p>Six-tier prize structure for any event</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-under-150"
        campaign="golf_gifts_under_150"
        title="Serious Golf Gifts for the Serious Golfer."
        body="Join the WYX list for premium gift guides, new products, and 10% off every order with WYX10."
      />
    </>
  );
}
