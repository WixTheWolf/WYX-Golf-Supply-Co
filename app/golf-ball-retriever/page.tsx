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
  title: "Golf Ball Retriever — 15-Foot Telescoping Retriever | WYX Golf Supply Co.",
  description: "Golf ball retrievers that pull any ball from any pond — 15-foot telescoping stainless shaft, universal scoop cup, collapses to 26 inches for the bag pocket. Under $30. WYX10 saves 10%.",
  alternates: { canonical: '/golf-ball-retriever' },
  openGraph: {
    title: "Golf Ball Retriever | WYX Golf Supply Co.",
    description: "15-foot telescoping golf ball retriever — collapses to 26 inches, universal cup, stainless shaft. Under $30. WYX10 saves 10%.",
    url: '/golf-ball-retriever'
  }
};

const picks = [
  {
    label: 'Golf Ball Retriever — 15-Foot',
    price: '$24',
    href: '/golf-ball-retriever',
    tag: 'Most Popular',
    why: '15-foot telescoping stainless shaft. Universal scoop cup grabs any standard 1.68-inch golf ball. Collapses to 26 inches for the side pocket of any stand or cart bag. Pays for itself in balls recovered from the first round with a water hazard. The most overlooked $24 investment in golf.'
  },
  {
    label: 'Golf Ball Retriever — 21-Foot',
    price: '$34',
    href: '/golf-ball-retriever',
    tag: 'Deep Water',
    why: '21-foot telescoping shaft for courses with deeper ponds and wider water hazards. Same universal scoop cup, same bag-pocket collapse. The retriever for golfers who play heavy water layouts or courses with retention ponds deeper than 8 feet at the bank edge.'
  }
];

const faqs: [string, string][] = [
  ['What is the best golf ball retriever?', 'A 15-foot telescoping stainless retriever ($24) — reaches any standard pond edge, collapses to 26 inches for any bag pocket, and uses a universal scoop cup that grabs any standard golf ball. Available at wyxgolfsupply.com with WYX10 for 10% off. It pays for itself in recovered balls in the first round.'],
  ['How long should a golf ball retriever be?', '15 feet is the standard for most courses — reaches across typical water hazard banks and shallow pond edges. 21-foot models are available for courses with deep retention ponds or wide creek hazards. When in doubt, the 15-foot model handles 90% of retrieval situations on standard courses.'],
  ['Is a golf ball retriever worth it?', 'At $24, it pays for itself after recovering 2-3 balls — far less than one round for most golfers. Beginners lose 3-5 balls per round, intermediates lose 1-2. A 15-foot retriever eliminates the walk-away-from-the-pond-edge penalty on every water shot that clears the hazard by less than 10 feet.']
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

function retrieverScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/retriever/i.test(product.title)) score += 15;
  if (/telescoping|stainless|scoop/i.test(product.title)) score += 5;
  return score;
}

export default async function GolfBallRetrieverPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => retrieverScore(b) - retrieverScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Ball Retriever',
        url: `${siteUrl}/golf-ball-retriever`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Ball Retriever', item: `${siteUrl}/golf-ball-retriever` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Ball Retriever</p>
          <h1>Golf Ball Retriever. Pays for Itself in Round One.</h1>
          <p>A 15-foot telescoping stainless retriever ($24) recovers any standard golf ball from any standard pond edge. Collapses to 26 inches for the side bag pocket. Used every round with a water hazard — which is every round on most courses. The $24 accessory with the most obvious ROI in golf.</p>
          <div className="actions">
            <Link className="button primary" href="#retriever-grid">Shop Ball Retrievers</Link>
            <Link className="button secondary dark" href="/golf-accessories-every-golfer-needs">All Bag Essentials &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Highest ROI Golf Accessory</p>
          <h2>15-Foot Retriever</h2>
          <p>$24. Recovers any ball from any standard pond. Collapses to 26 inches. Pays for itself after recovering 2-3 balls — which happens in the first round on any course with water. The most practical golf purchase under $30.</p>
          <Link className="button primary" href="#retriever-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Retrievers &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf ball retriever highlights">
        <span>15-foot reach</span>
        <span>Universal scoop cup</span>
        <span>Collapses to 26 inches</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Two Retriever Options</p>
          <h2 id="picks-heading">Golf Ball Retrievers. Standard &amp; Long Reach.</h2>
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

      <section id="retriever-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Ball Retrievers</p>
            <h2>Golf Ball Retrievers.</h2>
          </div>
          <Link className="text-link" href="/golf-accessories-every-golfer-needs">All Bag Essentials &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>15-Foot Retriever — $24</strong><p>Standard reach, most courses</p></Link>
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>21-Foot Retriever — $34</strong><p>Deep water courses</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Ball Retriever FAQ.</h2>
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
        source="golf-ball-retriever"
        campaign="golf_ball_retriever"
        title="Golf Ball Retriever. Pays for Itself in Round One."
        body="Join the WYX list for bag essential picks and 10% off your first order with WYX10."
      />
    </>
  );
}
