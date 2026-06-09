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

const picks = [
  { label: 'Blade Putter Headcover — Quilted Magnetic Closure', price: '$24', href: '/products/blade-putter-headcover-quilted', tag: 'Blade', why: 'Fits all standard blade putters with a magnetic closure that opens with one hand on the green. Quilted PU exterior, microfiber inner lining, and a neck loop keeps it from being left behind.' },
  { label: 'Mallet Putter Headcover — Tour Knit', price: '$26', href: '/products/mallet-putter-headcover-tour-knit', tag: 'Mallet', why: 'Fits all large mallet heads — Spider, Odyssey, Two-Ball, Cleveland. Stretch-knit outer, soft fleece inner, removable foam insert for different shaft lengths. Magnetic snap at the cuff.' }
];

const faqs: [string, string][] = [
  ['Do I need a putter headcover?', 'Yes — the putter is the most-used club in the bag and its face is the most precision-machined. A single bag drop or club-on-club impact during transport can ding a milled putter face and affect roll quality. A headcover ($24-26) prevents this entirely. Most tours require a headcover on putters for this reason.'],
  ['What is the difference between a blade and mallet putter cover?', 'Blade covers are narrow (standard putter head width, ~350mm long) and fit traditional heel-toe balanced putters. Mallet covers are wider and deeper, designed for large-head spider or two-ball style putters. The WYX blade cover fits all standard blade profiles; the mallet cover fits heads up to 6 inches wide.'],
  ['What size putter headcover do I need?', 'Check your putter head style. Blade putters (traditional, anser, mid-mallet): use a blade cover. Large mallet putters (Spider, Odyssey Two-Ball, Cleveland Frontline): use a mallet cover. Both WYX covers include a removable foam insert for shaft length adjustment.'],
  ['Do putter headcovers fit all putters?', 'The WYX blade cover fits any standard blade putter. The WYX mallet cover fits mallet heads up to 6 inches wide, covering Spider, Two-Ball, and most major mallet profiles. The removable foam insert handles shaft hosel length variations across brands.']
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
        <span>🏌️ Blade cover: $24</span>
        <span>⛳ Mallet cover: $26</span>
        <span>🔒 Magnetic closure</span>
        <span>🎁 Use WYX10 for 10% off</span>
      </div>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Blade or Mallet</p>
          <h2>Pick Your Putter Style.</h2>
        </div>
        <div className="care-step-grid">
          {picks.map((pick) => (
            <div key={pick.href} className="care-step">
              <strong>{pick.tag}</strong>
              <p><Link href={pick.href}>{pick.label}</Link> — {pick.price}</p>
              <p>{pick.why}</p>
            </div>
          ))}
        </div>
      </section>

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

      <EmailCapture />
    </>
  );
}
