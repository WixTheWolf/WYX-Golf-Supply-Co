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
  title: "Golf Gifts Under $25 — Five Practical Picks That Get Used Every Round | WYX Golf Supply Co.",
  description: "Golf gifts under $25 that earn a bag spot — hat clip ball markers, microfiber towel, arm sleeves, alignment sticks, and a ball retriever. All under $25. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-under-25' },
  openGraph: {
    title: "Golf Gifts Under $25 | WYX Golf Supply Co.",
    description: "Golf gifts under $25 that get used every round — ball markers, towels, arm sleeves, alignment sticks, ball retrievers. No size guesswork. WYX10 saves 10%.",
    url: '/golf-gifts-under-25'
  }
};

const picks = [
  { label: 'Hat Clip Ball Marker Set', price: '$16', href: '/golf-ball-markers', why: '3 magnetic markers + magnetic hat clip. USGA-compliant, brushed aluminum. One-hand retrieval on the green. The $16 golf gift that upgrades every round permanently.' },
  { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', why: 'Used every hole. Carabiner clip fits any bag D-ring. Dual-sided microfiber — one side scrubs grooves, one side dries the face. The most-used golf accessory under any budget.' },
  { label: 'Golf Arm Sleeves UPF 50+', price: '$22', href: '/golf-arm-sleeves', why: 'A pair of UPF 50+ arm sleeves with moisture-wicking compression fabric. One size fits most. The summer round essential that keeps sunscreen application to the face only.' },
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', why: 'The training tool every instructor uses. Almost no amateur owns them. Two sticks, 10 minutes at the range — aim confirmed, not guessed. He or she will use these every single session.' },
  { label: 'Golf Ball Retriever', price: '$24', href: '/golf-ball-retriever', why: '15-foot telescoping stainless shaft. Collapses to 26 inches. Universal scoop cup grabs any standard ball. The practical golf gift that pays for itself in recovered balls within one round.' }
];

const faqs: [string, string][] = [
  ['What are the best golf gifts under $25?', 'Five picks: hat clip ball marker set ($16), microfiber towel ($18), arm sleeves ($22), alignment sticks ($24), ball retriever ($24). All are practical accessories used every round. Available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf gift under $25 has no size risk?', 'All five picks on this page are completely size-free — ball markers, towels, arm sleeves, alignment sticks, and ball retrievers. No glove size, no shoe size, no equipment brand knowledge required.'],
  ['Can I find a good golf gift for under $25?', 'Yes. The alignment sticks ($24) are used by every tour pro and almost no amateur — a genuinely impactful gift at the lowest golf gift price point available. The microfiber towel ($18) is the bag essential that earns a spot in round 1 and never leaves. Both are better gifts than another sleeve of balls.']
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

function under25Score(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  if (price > 25) return 0;
  let score = productQualityScore(product);
  if (/marker|towel|alignment|retriever|arm sleeve/i.test(product.title)) score += 8;
  if (price <= 20) score += 5;
  return score;
}

export default async function GolfGiftsUnder25Page() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .filter((p) => Number(productPrice(p).amount) <= 25)
    .sort((a, b) => under25Score(b) - under25Score(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts Under $25',
        url: `${siteUrl}/golf-gifts-under-25`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts Under $25', item: `${siteUrl}/golf-gifts-under-25` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Gifts Under $25</p>
          <h1>Golf Gifts Under $25. Five Picks That Earn a Bag Spot.</h1>
          <p>Five practical golf accessories under $25 — all used every round, all completely size-free. From the $16 hat clip ball marker set to the $24 alignment sticks that produce more range improvement than an additional lesson. All ship in 1-3 days.</p>
          <div className="actions">
            <Link className="button primary" href="#under25-grid">Shop Under $25</Link>
            <Link className="button secondary dark" href="/golf-stocking-stuffers">Stocking Stuffers &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off. Stretches the budget further.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Under $25</p>
          <h2>Alignment Sticks</h2>
          <p>$24. Every tour pro uses these. Almost no amateur owns them. Two sticks, 10 minutes — aim confirmed before the first swing. The best golf gift available under $25.</p>
          <Link className="button primary" href="/golf-training-aids" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Alignment Sticks &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf gifts under 25 highlights">
        <span>All under $25</span>
        <span>Zero size guesswork</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Five Picks</p>
          <h2 id="picks-heading">Golf Gifts Under $25.</h2>
        </div>
        <div className="care-step-grid">
          {picks.map((pick) => (
            <Link key={pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <strong>{pick.label} — {pick.price}</strong>
              <p>{pick.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="under25-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts Under $25.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Hat Clip Markers — $16</strong><p>3 magnetic markers + hat clip</p></Link>
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Used every hole</p></Link>
              <Link href="/golf-arm-sleeves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Arm Sleeves UPF 50+ — $22</strong><p>Summer round essential</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>Best practice gift under $25</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gifts Under $25 FAQ.</h2>
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
          <p className="eyebrow">More Budget Tiers</p>
          <h2 id="more-heading">Golf Gifts at Every Budget.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-stocking-stuffers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Stocking Stuffers</strong><p>All the picks that fit in a stocking — $16 to $32</p></Link>
          <Link href="/golf-gifts-under-50" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $50</strong><p>Glove 3-packs, leather scorecard holders, and more</p></Link>
          <Link href="/golf-gifts-under-75" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $75</strong><p>The generous-but-practical budget tier</p></Link>
          <Link href="/best-golf-gifts-under-100" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Under $100</strong><p>The sweet-spot gift budget for any golfer</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-under-25"
        campaign="golf_gifts_under_25"
        title="Golf Gifts Under $25. All Used Every Round."
        body="Join the WYX list for gift guides, stocking stuffer picks, and 10% off your first order with WYX10."
      />
    </>
  );
}
