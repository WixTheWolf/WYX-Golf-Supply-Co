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
  title: "Golf Divot Tools — Magnetic Combo Tools & Switchblade Repair Forks | WYX Golf Supply Co.",
  description: "Golf divot tools that repair greens properly — magnetic marker combo tools, switchblade fork tools, and the prong technique most golfers never learned. Under $20. WYX10 saves 10%.",
  alternates: { canonical: '/golf-divot-tools' },
  openGraph: {
    title: "Golf Divot Tools | WYX Golf Supply Co.",
    description: "Golf divot tools with magnetic markers — combo tools, switchblade forks, and proper repair technique. Under $20. WYX10 saves 10%.",
    url: '/golf-divot-tools'
  }
};

const picks = [
  {
    label: 'Magnetic Divot Tool + Ball Marker Combo',
    price: '$18',
    href: '/golf-divot-tools',
    tag: 'Best Value',
    why: 'A two-prong divot repair tool with a magnetic ball marker recessed in the head. One accessory covers divot repair and ball marking — the two actions that happen at every green approach. The bag essential that replaces two separate items with one slot-sized tool. Fits any pocket.'
  },
  {
    label: 'Switchblade Divot Fork Tool',
    price: '$14',
    href: '/golf-divot-tools',
    tag: 'Classic Pick',
    why: 'Spring-loaded switchblade mechanism deploys the prongs one-handed. The compact format that fits in the back pocket without a clip. Used by golfers who prefer the direct two-prong push-and-rotate technique and want a dedicated tool separate from their ball marker.'
  }
];

const faqs: [string, string][] = [
  ['What is the best golf divot tool?', 'A magnetic combo divot tool and ball marker ($18) — covers divot repair and ball marking in one accessory, fits any pocket. The two-prong push-and-rotate technique heals pitch marks within 24 hours; the claw-and-lift technique takes 3-5 times longer. Use the push-and-rotate method. Available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['How do you properly repair a divot on a golf green?', 'Insert two prongs at the edge of the pitch mark (not the center). Push toward the center while rotating the prong upward, like turning a key. Repeat from multiple edges. Tap flat with the sole of the putter. The push-and-rotate technique heals the damaged grass root structure — the claw-and-lift technique rips roots and delays healing by days.'],
  ['What is a good golf divot tool gift?', 'The magnetic combo tool ($18) — used every green, covers two bag needs in one accessory, under $20, zero size risk. The $18 golf gift with the highest rounds-of-use-per-dollar ratio after ball markers. Every golfer without one will use it immediately.']
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

function divotScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/divot|pitch mark|repair/i.test(product.title)) score += 15;
  if (/magnetic|switchblade|combo/i.test(product.title)) score += 5;
  return score;
}

export default async function GolfDivotToolsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => divotScore(b) - divotScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Divot Tools',
        url: `${siteUrl}/golf-divot-tools`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Divot Tools', item: `${siteUrl}/golf-divot-tools` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Divot Tools</p>
          <h1>Golf Divot Tools. Repair the Green Correctly. Every Time.</h1>
          <p>A magnetic combo divot tool ($18) covers green repair and ball marking in one pocket-sized accessory. Learn the push-and-rotate technique instead of the claw-and-lift — the difference between a green that heals in 24 hours and one that takes 5 days. Under $20, zero size risk.</p>
          <div className="actions">
            <Link className="button primary" href="#divot-grid">Shop Divot Tools</Link>
            <Link className="button secondary dark" href="/golf-ball-markers">Ball Markers &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Combo Tool — $18</p>
          <h2>Magnetic Divot Tool + Marker</h2>
          <p>$18. Two-prong divot repair tool with a magnetic ball marker recessed in the head. One accessory, two greens-side needs, one bag slot. The $18 green kit essential that most golfers have never bothered to buy for themselves.</p>
          <Link className="button primary" href="#divot-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Divot Tools &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf divot tool highlights">
        <span>Magnetic ball marker included</span>
        <span>Two-prong repair design</span>
        <span>Under $20</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Two Divot Tool Picks</p>
          <h2 id="picks-heading">Golf Divot Tools. Combo &amp; Dedicated.</h2>
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

      <section id="divot-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Divot Tools</p>
            <h2>Golf Divot Tools.</h2>
          </div>
          <Link className="text-link" href="/golf-accessories-every-golfer-needs">All Bag Essentials &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-divot-tools" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Magnetic Combo — $18</strong><p>Divot tool + ball marker</p></Link>
              <Link href="/golf-divot-tools" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Switchblade Fork — $14</strong><p>Compact, back pocket friendly</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Divot Tool FAQ.</h2>
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
        source="golf-divot-tools"
        campaign="golf_divot_tools"
        title="Golf Divot Tools. Repair the Green Correctly."
        body="Join the WYX list for bag essential picks, green care guides, and 10% off your first order with WYX10."
      />
    </>
  );
}
