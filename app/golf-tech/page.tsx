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
  title: "Golf Tech — GPS Rangefinders, Shot Trackers & Golf Technology | WYX Golf Supply Co.",
  description: "Golf technology that reduces the mental load of every round — GPS laser rangefinders, shot tracking devices, and the tech accessories every serious golfer needs. WYX10 saves 10%.",
  alternates: { canonical: '/golf-tech' },
  openGraph: {
    title: "Golf Tech | WYX Golf Supply Co.",
    description: "Golf technology for serious players — GPS rangefinders, shot trackers, and tech accessories. WYX10 saves 10% at WYX Golf Supply Co.",
    url: '/golf-tech'
  }
};

const picks = [
  {
    label: 'GPS Laser Rangefinder',
    price: '$119',
    href: '/golf-tech-gifts',
    tag: 'Most Impactful',
    why: 'Slope compensation, 5-yard accuracy, USB-C rechargeable, 7x optical zoom. Eliminates approach shot estimation on every hole. The golfer who does not own one is making every approach with one variable they could eliminate for $119. Used on every hole, charged weekly, owned for years. The golf tech purchase with the most obvious ROI per use.'
  },
  {
    label: 'Golf Swing Analyzer Clip',
    price: '$68',
    href: '/golf-tech-gifts',
    tag: 'Data Player',
    why: 'Magnetometer-powered swing analyzer that clips to any club and delivers tempo, club speed, and swing path data to the paired app. The practice session tool for the golfer who has graduated from feel-based feedback and wants objective data on what their swing is actually doing.'
  },
  {
    label: 'Smart Golf Scorecard App Holder',
    price: '$32',
    href: '/golf-tech',
    tag: 'Cart Essential',
    why: 'Silicone phone mount for any cart rail — converts the phone into a visible GPS display, music controller, and scorecard tracker for the round. The modern caddie setup for the golfer who already uses a smartphone app for course management and wants hands-free access.'
  }
];

const faqs: [string, string][] = [
  ['What golf tech is worth buying?', 'A GPS laser rangefinder ($119) is the single most impactful golf tech purchase — eliminates approach shot estimation, reduces round decision time, and is used on every hole. After that: a swing analyzer clip ($68) for golfers who want objective data on their swing mechanics. Both at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['Is a golf rangefinder worth it?', 'Yes. A GPS laser rangefinder ($119) pays for itself in confidence on every approach shot. Tour pros use rangefinders in practice — amateur golfers playing without one are making every 150-yard approach with a guess. The rangefinder eliminates the guess and adds a decision point (pin vs. center) that consistently improves scoring.'],
  ['What is the best golf tech gift under $150?', 'A GPS laser rangefinder ($119) — used on every hole of every round, lasts for years, and dramatically reduces the approach shot uncertainty that costs casual golfers 2-4 strokes per round. See the full golf tech gift guide at wyxgolfsupply.com/golf-tech-gifts with WYX10 for 10% off.']
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

function techScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/rangefinder|gps|swing analyzer|tracker|tech/i.test(product.title)) score += 12;
  if (/golf tech|electronics/i.test(product.productType ?? '')) score += 5;
  return score;
}

export default async function GolfTechPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => techScore(b) - techScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Tech',
        url: `${siteUrl}/golf-tech`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Tech', item: `${siteUrl}/golf-tech` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Technology</p>
          <h1>Golf Tech That Reduces the Mental Load of Every Round.</h1>
          <p>Three tech picks for three types of data golfers — the GPS rangefinder for every approach shot, the swing analyzer for objective practice feedback, and the cart mount for hands-free course management. Used on every hole, charged weekly, owned for years.</p>
          <div className="actions">
            <Link className="button primary" href="#tech-grid">Shop Golf Tech</Link>
            <Link className="button secondary dark" href="/golf-tech-gifts">Golf Tech Gifts &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most Impactful Golf Tech</p>
          <h2>GPS Laser Rangefinder</h2>
          <p>$119. Slope compensation, 5-yard accuracy, USB-C rechargeable. The golfer without one is estimating every approach. The golfer with one is deciding between pin and center. That decision is worth 2-4 strokes per round.</p>
          <Link className="button primary" href="/golf-tech-gifts" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Rangefinder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf tech highlights">
        <span>GPS rangefinders</span>
        <span>Swing analyzers</span>
        <span>Course management tools</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Three Tech Picks</p>
          <h2 id="picks-heading">Golf Technology That Actually Improves Your Round.</h2>
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

      <section id="tech-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Tech</p>
            <h2>Golf Technology.</h2>
          </div>
          <Link className="text-link" href="/golf-tech-gifts">Golf Tech Gifts &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-tech-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Rangefinder — $119</strong><p>Every approach shot, every round</p></Link>
              <Link href="/golf-tech-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Swing Analyzer — $68</strong><p>Objective swing data</p></Link>
              <Link href="/golf-tech" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Cart Phone Mount — $32</strong><p>Hands-free GPS display</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Tech FAQ.</h2>
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
        source="golf-tech"
        campaign="golf_tech"
        title="Golf Technology That Reduces the Mental Load."
        body="Join the WYX list for golf tech reviews, new products, and 10% off your first order with WYX10."
      />
    </>
  );
}
