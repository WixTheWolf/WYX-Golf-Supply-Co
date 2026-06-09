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
  title: "Golf Belts — Stretch Fabric Ratchet Belts & Leather Golf Belts | WYX Golf Supply Co.",
  description: "Golf belts that stay through a full swing — stretch fabric ratchet belts with micro-adjust buckles and clean leather options for dress code rounds. Under $35. WYX10 saves 10%.",
  alternates: { canonical: '/golf-belts' },
  openGraph: {
    title: "Golf Belts | WYX Golf Supply Co.",
    description: "Golf belts that stay through the swing — stretch fabric ratchet belts, leather dress options. Under $35. WYX10 saves 10%.",
    url: '/golf-belts'
  }
};

const picks = [
  { label: 'Stretch Fabric Ratchet Belt', price: '$24', href: '/golf-belts', tag: 'Best Seller', why: 'Stretch woven fabric with a micro-adjust ratchet buckle — no holes, infinite adjustment within the range. Stays through a full swing without the bulk or rigidity of a leather dress belt. Machine washable, fits any standard pant loop. The modern golf belt format used by most tour players.' },
  { label: 'Leather Golf Belt — Clean Profile', price: '$32', href: '/golf-belts', tag: 'Dress Code Option', why: 'Smooth leather belt with a low-profile pin buckle. For private courses and formal member-guest events where the dress code calls for a traditional leather belt. Clean, minimal, available in black and tan.' }
];

const faqs: [string, string][] = [
  ['What is the best golf belt?', 'A stretch fabric ratchet belt ($24) — micro-adjust buckle, no holes, stays through the full swing without creating restriction. More comfortable than leather for 18+ holes, machine washable, fits any standard pant loop. Available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['Do golf courses require a belt?', 'Some private courses and formal member-guest events require a belt as part of their dress code. Stretch belts and leather belts both satisfy standard dress code requirements. A clean ratchet belt ($24) is accepted at nearly every course that requires one.'],
  ['Is a golf belt a good gift?', 'Only if you know the recipient&apos;s waist size. A ratchet belt removes some of that guesswork — the micro-adjust mechanism fits a range of sizes without specific hole alignment. If size is uncertain, a safer alternative is the alignment sticks ($24) or a microfiber towel ($18) — same price, zero size risk.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function beltScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/belt/i.test(product.title)) score += 15;
  if (/ratchet|stretch|leather belt/i.test(product.title)) score += 5;
  return score;
}

export default async function GolfBeltsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => beltScore(b) - beltScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Belts', url: `${siteUrl}/golf-belts`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Belts', item: `${siteUrl}/golf-belts` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Belts</p>
          <h1>Golf Belts. Stretch Ratchet &amp; Leather. Stays Through the Swing.</h1>
          <p>A stretch fabric ratchet belt ($24) with micro-adjust buckle stays through the full swing without the bulk of a leather dress belt. Clean leather options for formal courses. Under $35 each. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#belts-grid">Shop Golf Belts</Link>
            <Link className="button secondary dark" href="/golf-apparel">Golf Apparel &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Seller — $24</p>
          <h2>Stretch Ratchet Belt</h2>
          <p>Micro-adjust buckle, stretch woven fabric, machine washable. No holes — infinite adjustment in the range. Stays in place through a full driver swing. The modern golf belt format most tour players use.</p>
          <Link className="button primary" href="#belts-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Belts &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf belt highlights">
        <span>Stretch ratchet — $24</span><span>Leather — $32</span><span>Micro-adjust fit</span><span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading"><p className="eyebrow">Two Belt Options</p><h2 id="picks-heading">Golf Belts. Stretch &amp; Leather.</h2></div>
        <div className="care-step-grid">
          {picks.map((p) => (
            <Link key={p.label} href={p.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{p.tag}</small>
              <strong>{p.label} — {p.price}</strong><p>{p.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="belts-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Golf Belts</p><h2>Golf Belts.</h2></div>
          <Link className="text-link" href="/golf-apparel">Golf Apparel &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-belts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Stretch Ratchet — $24</strong><p>Micro-adjust, swing-friendly</p></Link>
              <Link href="/golf-belts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Belt — $32</strong><p>Clean profile, dress codes</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Golf Belt FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="golf-belts" campaign="golf_belts" title="Golf Belts That Stay Through the Swing." body="Join the WYX list for apparel picks and 10% off your first order with WYX10." />
    </>
  );
}
