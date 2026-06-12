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
  title: "Golf Putter Headcovers — Blade & Mallet Covers | WYX Golf Supply Co.",
  description: "Blade and mallet putter headcovers that protect the face during transport. Magnetic closures, soft fleece lining, neck loops. Under $30. WYX10 saves 10%.",
  alternates: { canonical: '/golf-putter-headcovers' },
  openGraph: {
    title: "Golf Putter Headcovers | Blade & Mallet | WYX Golf Supply Co.",
    description: "Protect your putter face with magnetic-closure headcovers for blade and mallet putters. Soft fleece inner lining, neck loops. Under $30.",
    url: '/golf-putter-headcovers'
  }
};

const faqs: [string, string][] = [
  ['Do I need a putter headcover?', 'Yes — the putter is the most-used club in the bag and its face is the most precision-machined. A single bag drop or club-on-club impact during transport can ding a milled putter face and affect roll quality. A headcover prevents this entirely. Most tours require a headcover on putters for this reason.'],
  ['What is the difference between a blade and mallet putter cover?', 'Blade covers are narrow (standard putter head width, ~350mm long) and fit traditional heel-toe balanced putters. Mallet covers are wider and deeper, designed for large-head spider or two-ball style putters. Check your putter head profile before buying so the cover seats snugly over the face.'],
  ['What size putter headcover do I need?', 'Check your putter head style. Blade putters (traditional, anser, mid-mallet) need a narrower cover. Large mallet putters (Spider, Odyssey Two-Ball, Cleveland Frontline) need a wider, deeper cover. Look for a removable foam insert if your shaft length varies.'],
  ['Do headcovers fit all clubs?', 'Most headcovers are sized for a specific club type — driver, fairway wood, hybrid, or putter — so match the cover to the club you are protecting. A snug fit keeps the cover from sliding off in the bag during transport.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function putterScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/putter.*head|head.*cover.*putt/i.test(product.title)) score += 25;
  if (/headcover/i.test(product.title)) score += 10;
  return score;
}

export default async function GolfPutterHeadcoversPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => putterScore(b) - putterScore(a)).slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Putter Headcovers', url: `${siteUrl}/golf-putter-headcovers`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Putter Headcovers', item: `${siteUrl}/golf-putter-headcovers` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">WYX Golf Supply Co.</p>
          <h1>Golf Putter Headcovers.</h1>
          <p className="deal-hero-sub">Blade and mallet covers that protect the face you rely on most. Magnetic closures. Soft fleece linings. Under $30.</p>
          <div className="actions">
            <Link className="button primary" href="#products">Shop Putter Covers</Link>
            <Link className="button secondary" href="/golf-headcovers">All Headcovers</Link>
          </div>
        </div>
      </section>

      <div className="deal-strip">
        <span>🏌️ Blade &amp; mallet sizing</span>
        <span>🔒 Magnetic closures</span>
        <span>🧵 Soft fleece lining</span>
        <span>🎁 Use WYX10 for 10% off</span>
      </div>

      <section id="products" className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Headcovers</p>
          <h2>Putter Protection.</h2>
        </div>
        {products.length > 0
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <p>Check back soon — our putter covers ship within 3-5 business days.</p>}
      </section>

      <section className="section faq-section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><h2 id="faq-heading">Putter Cover Questions.</h2></div>
        <dl className="faq-list">
          {faqs.map(([q, a]) => (
            <div key={q} className="faq-item">
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <EmailCapture source="golf-putter-headcovers" campaign="headcovers" />
    </>
  );
}
