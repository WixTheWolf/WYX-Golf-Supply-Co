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
  title: "Golf Impact Tape — Face Impact Labels for Irons, Wedges & Driver | WYX Golf Supply Co.",
  description: "Self-adhesive golf impact tape labels that reveal exactly where on the clubface you are striking the ball. 50-pack covering irons, hybrids, and driver. Under $15. WYX10 saves 10%.",
  alternates: { canonical: '/golf-impact-tape' },
  openGraph: {
    title: "Golf Impact Tape | Face Impact Labels | WYX Golf Supply Co.",
    description: "Know exactly where you are hitting the ball on the face. 50 self-adhesive labels for irons, hybrids, and driver. Under $15.",
    url: '/golf-impact-tape'
  }
};

const useCases = [
  { head: 'Identify Heel/Toe Misses', body: 'Impact tape reveals if you are consistently striking the heel or toe — the most common cause of loss of distance and direction. One bucket on the range with labels shows the pattern clearly.' },
  { head: 'Track Progress After Swing Changes', body: 'Apply a fresh label after a lesson. Compare the strike pattern before and after a drill change. Impact tape turns guesswork into visible feedback that you can photograph and track session to session.' },
  { head: 'Check Driver Strike Before a Round', body: 'A driver label applied at the range confirms your strike pattern before you tee off. High on the face = maximum carry distance. Low on the face = ball goes low and spins less efficiently.' },
  { head: 'Wedge Strike Diagnosis', body: 'Wedge impact position affects trajectory and spin. Center-face contact on a wedge produces consistent distance control. Labels show if you are chunking or blading by where the impact mark lands.' }
];

const faqs: [string, string][] = [
  ['What is golf impact tape?', 'Golf impact tape (also called face impact labels or strike tape) is a self-adhesive label applied to the clubface that shows where the ball makes contact on the face during a swing. The label marks on first strike, revealing whether contact is centered, high, low, heel, or toe.'],
  ['Does impact tape affect the shot?', 'Minimally. Impact labels are thin enough not to meaningfully alter feel or ball trajectory. They are used at the range — not during a round — specifically because the difference is negligible at range speeds. Tour players use them in practice and in pre-round warmups.'],
  ['How many shots does each impact label last?', 'One to three shots depending on the force of the strike. Iron labels typically show a clear mark on the first swing. Driver labels can sometimes show two or three impacts if strikes are widely spaced on the face. The 50-pack gives enough for a full range session of diagnostics.'],
  ['What size impact tape label do I need?', 'The WYX 50-pack includes mixed sizes: small for irons and wedges, medium for fairway woods and hybrids, and large for driver. Most packs cover a range session with 3-4 clubs fully diagnosed. Use the large label for the driver, medium for your 3-wood, and small labels for irons.'],
  ['Can I use impact tape on brand new clubs?', 'Yes — the adhesive is designed to remove cleanly without residue on any chrome, steel, or painted club face. Apply to the face only and remove within 30 minutes to avoid any adhesive marking on raw finishes.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function impactScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/impact.tape|face.label|impact.label/i.test(product.title + ' ' + product.handle)) score += 30;
  if (/training|practice|alignment/i.test(product.productType)) score += 5;
  return score;
}

export default async function GolfImpactTapePage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => impactScore(b) - impactScore(a)).slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Impact Tape', url: `${siteUrl}/golf-impact-tape`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Impact Tape', item: `${siteUrl}/golf-impact-tape` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">WYX Golf Supply Co.</p>
          <h1>Golf Impact Tape.</h1>
          <p className="deal-hero-sub">Self-adhesive face labels for irons, wedges, and driver. One session reveals where you are really hitting the ball — and why distance is leaking. 50-pack under $15.</p>
          <div className="actions">
            <Link className="button primary" href="#products">Shop Impact Tape</Link>
            <Link className="button secondary" href="/golf-training-aids">All Training Aids</Link>
          </div>
        </div>
      </section>

      <div className="deal-strip">
        <span>📍 50 labels per pack</span>
        <span>🏌️ Irons + wedges + driver sizes</span>
        <span>💰 Under $15</span>
        <span>🎁 Use WYX10 for 10% off</span>
      </div>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">When To Use Impact Tape</p>
          <h2>Four Range Session Drills.</h2>
        </div>
        <div className="care-step-grid">
          {useCases.map((u) => (
            <div key={u.head} className="care-step">
              <strong>{u.head}</strong>
              <p>{u.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Training Aids</p>
          <h2>Impact Tape & Practice Tools.</h2>
        </div>
        {products.length > 0
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <p>Impact tape ships in 3-5 business days. Check back for updates.</p>}
      </section>

      <section className="section faq-section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><h2 id="faq-heading">Impact Tape Questions.</h2></div>
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
