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
  title: "Golf Tech Gifts — GPS Rangefinder, Swing Analyzer & Golf Technology Gifts | WYX Golf Supply Co.",
  description: "Golf tech gifts for the data-driven golfer — GPS laser rangefinder ($119), swing analyzer clip ($68), and GPS watch ($89). Used on every hole. WYX10 saves 10%.",
  alternates: { canonical: '/golf-tech-gifts' },
  openGraph: {
    title: "Golf Tech Gifts | WYX Golf Supply Co.",
    description: "Golf technology gifts for serious players — GPS rangefinder, swing analyzer, GPS watch. WYX10 saves 10% at WYX Golf Supply Co.",
    url: '/golf-tech-gifts'
  }
};

const picks = [
  {
    label: 'GPS Laser Rangefinder',
    price: '$119',
    href: '/golf-tech-gifts',
    tag: 'Best Golf Tech Gift',
    why: 'Slope compensation, 5-yard accuracy, USB-C rechargeable, 7x optical zoom. The flagship golf tech gift — used on every hole, charged once a week, owned for years. The golfer without one is estimating every approach. The golfer with one is choosing between pin and center. That decision is worth 2-4 strokes per round for most players.'
  },
  {
    label: 'GPS Golf Watch',
    price: '$89',
    href: '/golf-tech-gifts',
    tag: 'Wrist GPS',
    why: 'Front/center/back distances for 40,000+ courses worldwide. Hazard distances, shot measurement, and scorecard tracking on the wrist. No phone required. The tech gift for the golfer who wants course management data without pulling out a phone or rangefinder on every shot — always visible, always ready.'
  },
  {
    label: 'Swing Analyzer Clip',
    price: '$68',
    href: '/golf-tech-gifts',
    tag: 'Data Player Gift',
    why: 'Clips to any club grip, delivers tempo, club speed, and swing path data to the paired app. The practice session upgrade for the golfer who has graduated from feel-based feedback. A gift for the player actively working on their game — not the casual golfer, but the one who watches swing YouTube at 11pm.'
  }
];

const faqs: [string, string][] = [
  ['What is the best golf tech gift?', 'A GPS laser rangefinder ($119) — used on every hole of every round, lasts for years, and eliminates the approach shot estimation that costs most golfers 2-4 strokes per round. Second: a GPS golf watch ($89) for golfers who prefer wrist-accessible distances. Both at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf tech gift is under $100?', 'A GPS golf watch ($89) — 40,000+ courses, front/center/back distances, hazard mapping, shot measurement, and scorecard tracking. No phone required. The wrist GPS gift for the golfer who wants course management data on every tee box without the extra step of pulling out a rangefinder.'],
  ['Is a golf rangefinder a good gift?', 'Yes — a GPS laser rangefinder ($119) is the single most impactful golf gift under $150. Used on every hole, improves approach shot decisions immediately, reduces round decision anxiety, and lasts for years. The most serious golfers use one; most casual golfers know they should own one but have not bought it for themselves.']
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

function techGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/rangefinder|gps watch|swing analyzer/i.test(product.title)) score += 15;
  if (/golf tech|electronics/i.test(product.productType ?? '')) score += 5;
  return score;
}

export default async function GolfTechGiftsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => techGiftScore(b) - techGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Tech Gifts',
        url: `${siteUrl}/golf-tech-gifts`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Tech Gifts', item: `${siteUrl}/golf-tech-gifts` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Technology Gifts</p>
          <h1>Golf Tech Gifts. For the Data-Driven Golfer.</h1>
          <p>Three tech picks for three types of players — the GPS rangefinder for the approach-shot thinker, the GPS watch for the wrist-data preference, and the swing analyzer for the golfer who watches swing mechanics YouTube at 11pm. All under $120. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#tech-gifts-grid">Shop Golf Tech Gifts</Link>
            <Link className="button secondary dark" href="/golf-gifts-under-150">All Premium Gifts &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Golf Tech Gift — $119</p>
          <h2>GPS Laser Rangefinder</h2>
          <p>Slope compensation, 7x zoom, USB-C rechargeable. Used on every hole. The golfer without one is estimating; the golfer with one is deciding. That decision is worth 2-4 strokes per round.</p>
          <Link className="button primary" href="#tech-gifts-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Tech Gifts &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf tech gift highlights">
        <span>GPS rangefinder — $119</span>
        <span>GPS watch — $89</span>
        <span>Swing analyzer — $68</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Three Tech Gift Picks</p>
          <h2 id="picks-heading">Golf Tech Gifts. GPS, Watch &amp; Swing Data.</h2>
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

      <section id="tech-gifts-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Tech Gifts</p>
            <h2>Golf Technology Gifts.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts">All Golf Gifts &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-tech-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Rangefinder — $119</strong><p>Every hole, every round</p></Link>
              <Link href="/golf-tech-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Watch — $89</strong><p>40,000+ courses on the wrist</p></Link>
              <Link href="/golf-tech-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Swing Analyzer — $68</strong><p>Objective practice feedback</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Tech Gift FAQ.</h2>
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
        source="golf-tech-gifts"
        campaign="golf_tech_gifts"
        title="Golf Tech Gifts for the Data-Driven Golfer."
        body="Join the WYX list for golf tech reviews, new products, and 10% off your first order with WYX10."
      />
    </>
  );
}
