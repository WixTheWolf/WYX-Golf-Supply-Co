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
  title: "Golf Hats — Performance Baseball Cap & Sun Hats | WYX Golf Supply Co.",
  description: "Golf hats with UPF protection, moisture-wicking sweatbands, and structured fits — performance caps and wide-brim options for sun management on the course. WYX10 saves 10%.",
  alternates: { canonical: '/golf-hats' },
  openGraph: {
    title: "Golf Hats | WYX Golf Supply Co.",
    description: "Golf hats built for the course — UPF protection, moisture-wicking, structured fit. WYX10 saves 10% at WYX Golf Supply Co.",
    url: '/golf-hats'
  }
};

const picks = [
  {
    label: 'Performance Golf Baseball Cap',
    price: '$28',
    href: '/golf-hats',
    tag: 'Most Popular',
    why: 'Structured 5-panel cap with moisture-wicking sweatband and UPF 30 protection. The standard-format golf hat — fits any bag, any style, any course dress code. Adjustable closure fits all head sizes. Machine washable. The hat worn more rounds than any alternative format.'
  },
  {
    label: 'Wide Brim Golf Hat',
    price: '$36',
    href: '/golf-hats',
    tag: 'Max Sun Protection',
    why: 'Full-brim coverage for the golfer playing 36 holes per week in summer sun. UPF 50+, lightweight nylon shell, chin cord for windy days. The sun management hat for the serious player who wants skin protection beyond what a standard cap provides.'
  },
  {
    label: 'Golf Sunglasses Polarized Sport Wrap',
    price: '$42',
    href: '/golf-sunglasses',
    tag: 'Pairs Well',
    why: 'Polarized sport wrap sunglasses eliminate glare on fairways and greens — a hat handles overhead sun, sunglasses handle reflective surface glare. The two-piece sun management system that serious golfers use and most casual golfers have never tried together.'
  }
];

const faqs: [string, string][] = [
  ['What is the best golf hat?', 'A moisture-wicking performance baseball cap ($28) is the standard — structured fit, UPF 30+, machine washable, fits every course dress code. For maximum sun protection, a wide brim golf hat ($36) covers the ears and neck. Both available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['Do golf courses require hats?', 'Most private courses and many public courses have no hat requirement — but the practical benefits (reduced glare, sunburn prevention, moisture management) make a golf hat the default for serious players. Many dress codes specify no novelty logos or athletic brand marks; a clean performance cap satisfies both.'],
  ['Golf hat as a gift — is it a good idea?', 'Only if you know the recipient&apos;s preferred fit and style. Adjustable-back caps reduce size risk significantly — one size fits most with adjustable closures. A safer gift alternative is the hat clip ball marker set ($16) which clips to any hat they already own.']
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

function hatScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/hat|cap|visor/i.test(product.title)) score += 15;
  if (/upf|moisture.wick|wide.brim/i.test(product.title)) score += 5;
  return score;
}

export default async function GolfHatsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => hatScore(b) - hatScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Hats',
        url: `${siteUrl}/golf-hats`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Hats', item: `${siteUrl}/golf-hats` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Hats</p>
          <h1>Golf Hats. Performance Caps &amp; Wide Brim Sun Protection.</h1>
          <p>Sun management starts at the top. Performance baseball caps with UPF 30+ and moisture-wicking sweatbands. Wide brim options for the golfer playing 36+ holes a week in summer sun. Under $40. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#hats-grid">Shop Golf Hats</Link>
            <Link className="button secondary dark" href="/golf-sunglasses">Golf Sunglasses &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Performance Cap</p>
          <h2>Golf Baseball Cap</h2>
          <p>$28. Moisture-wicking sweatband, structured 5-panel fit, UPF 30+, adjustable closure. Machine washable. The golf hat worn for more rounds than any other format — fits every course dress code.</p>
          <Link className="button primary" href="#hats-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Hats &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf hat highlights">
        <span>UPF sun protection</span>
        <span>Moisture-wicking sweatband</span>
        <span>Adjustable fit</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Three Picks</p>
          <h2 id="picks-heading">Golf Hats for Every Round.</h2>
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

      <section id="hats-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Hats</p>
            <h2>Golf Hats.</h2>
          </div>
          <Link className="text-link" href="/golf-apparel">Golf Apparel &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-hats" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Performance Cap — $28</strong><p>Moisture-wicking, UPF 30+</p></Link>
              <Link href="/golf-hats" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Wide Brim Hat — $36</strong><p>Maximum sun coverage</p></Link>
              <Link href="/golf-sunglasses" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Polarized Sunglasses — $42</strong><p>Pairs with any hat</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Hat FAQ.</h2>
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
        source="golf-hats"
        campaign="golf_hats"
        title="Golf Hats Built for the Course."
        body="Join the WYX list for new apparel drops, sun protection guides, and 10% off your first order with WYX10."
      />
    </>
  );
}
