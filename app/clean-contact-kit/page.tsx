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
  title: "Clean Contact Kit — Golf Groove Cleaning & Strike Quality Accessories | WYX Golf Supply Co.",
  description: "Clean contact kit for better iron strikes — microfiber towel, groove brush, ball position training aid, and impact tape. Four tools that improve strike quality and groove maintenance. WYX10 saves 10%.",
  alternates: { canonical: '/clean-contact-kit' },
  openGraph: {
    title: "Clean Contact Kit | WYX Golf Supply Co.",
    description: "Golf clean contact kit — towel, groove brush, ball position aid, impact tape. Better strikes through cleaner grooves and better positioning. WYX10 saves 10%.",
    url: '/clean-contact-kit'
  }
};

const items = [
  { step: '01', label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', why: 'The first layer of clean contact — wiping the club face and grooves before each shot. Packed dirt and grass alter launch angle and spin rate on approach shots. A towel is the on-course tool that maintains consistent iron performance from hole 1 to 18.' },
  { step: '02', label: 'Groove Brush with Pick', price: '$12', href: '/clean-contact-kit', why: 'The deep cleaning tool used post-round and on difficult lies. A stiff-bristle brush and pick removes compacted mud and grass that a towel alone cannot reach. Used once per round on problematic lies — extends the functional life of iron grooves across a full season.' },
  { step: '03', label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', why: 'Ball position is the positioning factor that most directly determines strike quality. Two alignment sticks — one at the ball, one at the target line — confirm correct ball position before every iron session. Clean contact comes from correct setup before the swing starts.' },
  { step: '04', label: 'Impact Tape — 10 Sheets', price: '$14', href: '/clean-contact-kit', why: 'Impact tape attaches to the club face and marks the strike location after each shot. A precise visual record of strike pattern — heel, toe, low, high — that self-coaching cannot replicate. 10 sheets covers a range session and reveals the contact pattern most golfers cannot feel accurately.' }
];

const faqs: [string, string][] = [
  ['What is a clean contact kit for golf?', 'Four tools: microfiber towel ($18 — on-course groove care), groove brush ($12 — deep post-round cleaning), alignment sticks ($24 — ball position for correct strike setup), impact tape ($14 — visual strike pattern feedback). Total: $68 before WYX10. All at wyxgolfsupply.com.'],
  ['How do I get cleaner contact with my irons?', 'Three factors: clean grooves (towel + groove brush), correct ball position (alignment sticks), and strike feedback (impact tape). Dirty grooves reduce spin and alter launch. Incorrect ball position causes thin and fat contact. Impact tape reveals the actual strike location vs. the perceived location — most golfers are surprised by the result.'],
  ['Does groove cleaning improve iron shots?', 'Yes — clean grooves produce consistent backspin on approach shots. Packed grooves reduce friction between the ball and face, leading to unpredictable launch and spin variation on short and mid irons. A towel ($18) and groove brush ($12) are the two-item groove maintenance kit that costs less than a range bucket.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function contactScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/towel|groove|alignment|impact tape/i.test(product.title)) score += 12;
  return score;
}

export default async function CleanContactKitPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => contactScore(b) - contactScore(a)).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Clean Contact Kit', url: `${siteUrl}/clean-contact-kit`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Clean Contact Kit', item: `${siteUrl}/clean-contact-kit` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Strike Quality</p>
          <h1>Clean Contact Kit. Cleaner Grooves, Better Ball Position, Cleaner Strikes.</h1>
          <p>A microfiber towel for on-course groove care, a groove brush for deep post-round cleaning, alignment sticks for correct ball position, and impact tape for strike pattern feedback. Four tools that address the three most common causes of inconsistent iron contact. Under $70 complete. WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#contact-grid">Shop Clean Contact</Link>
            <Link className="button secondary dark" href="/golf-training-aids">Training Aids &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>Use <strong>WYX10</strong> at checkout for 10% off every order.</p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Underrated Pick — $14</p>
          <h2>Impact Tape</h2>
          <p>10 sheets that attach to the club face and mark strike location after each shot. A visual record of contact pattern — heel, toe, thin, fat — that most golfers cannot feel accurately. The cheapest feedback tool in the bag. Know exactly where the ball is making contact before trying to change the swing.</p>
          <Link className="button primary" href="/golf-training-aids" style={{ marginTop: '1rem', display: 'inline-block' }}>See Training Aids &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Clean contact kit highlights">
        <span>Groove brush — $12</span><span>Impact tape — $14</span><span>Complete kit — $68 before WYX10</span><span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="contact-picks-heading">
        <div className="section-heading"><p className="eyebrow">Four Tools</p><h2 id="contact-picks-heading">Clean Contact Kit.</h2></div>
        <div className="care-step-grid">
          {items.map((item) => (
            <Link key={item.label} href={item.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{item.step}</small>
              <strong>{item.label} — {item.price}</strong><p>{item.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact-grid" className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">Shop Clean Contact</p><h2>Clean Contact Accessories.</h2></div>
          <Link className="text-link" href="/golf-practice-gear">Practice Gear &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>On-course groove care</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>Ball position</p></Link>
            </div>
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><p className="eyebrow">Questions</p><h2 id="faq-heading">Clean Contact Kit FAQ.</h2></div>
        <div className="care-step-grid">
          {faqs.map(([q, a]) => (<div key={q} className="care-step-card"><strong>{q}</strong><p>{a}</p></div>))}
        </div>
      </section>

      <EmailCapture source="clean-contact-kit" campaign="clean_contact" title="Clean Contact Kit. Cleaner Strikes." body="Join the WYX list for strike improvement guides and 10% off your first order with WYX10." />
    </>
  );
}
