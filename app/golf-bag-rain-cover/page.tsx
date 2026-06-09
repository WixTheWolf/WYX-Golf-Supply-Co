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
  title: "Golf Bag Rain Cover — Universal Waterproof Hood | WYX Golf Supply Co.",
  description: "Universal-fit waterproof golf bag rain cover. Fits stand, cart, and staff bags. Taped seams, D-ring clip, packs into its own pocket. Under $30. WYX10 saves 10%.",
  alternates: { canonical: '/golf-bag-rain-cover' },
  openGraph: {
    title: "Golf Bag Rain Cover | Universal Waterproof | WYX Golf Supply Co.",
    description: "Pulls over any stand or cart bag in seconds. Fully taped seams, D-ring wind clip, packs into its own zip pocket. Under $30.",
    url: '/golf-bag-rain-cover'
  }
};

const reasons = [
  { head: 'Grips Stay Dry', body: 'Wet grips add unpredictability to every swing. A rain cover keeps the top of the bag dry so you are pulling dry grips out in wet conditions — not wiping them on your shirt between shots.' },
  { head: 'Protects Headcovers and Valuables', body: 'Rangefinders, wallets, and phone pockets sit near the top of the bag. A rain cover shields every top pocket from direct rain during transit on the cart, not just the clubs themselves.' },
  { head: 'Packs Into Its Own Pocket', body: 'The cover folds into a built-in zip pocket the size of a baseball. Sits in any side bag pocket until the weather turns. Deploys in 15 seconds over any stand or cart bag profile.' },
  { head: 'Fits All Bag Styles', body: 'The elastic hem and D-ring clip fit stand bags, cart bags, and most staff bag profiles. One cover works across your whole bag rotation — no need to buy a separate cover per bag.' }
];

const faqs: [string, string][] = [
  ['Do I need a golf bag rain cover?', 'If you play in variable weather, yes. A rain cover ($26) keeps grips, headcovers, and bag pockets dry during cart transit and standing rain — the conditions where grip performance matters most. It packs small enough to live in the bag permanently without adding meaningful weight.'],
  ['What size rain cover do I need for my golf bag?', 'The WYX Universal rain cover fits stand bags (7-inch top), cart bags (9-inch top), and most staff bag profiles. The elastic hem stretches to accommodate any bag diameter, and the D-ring clip prevents wind from lifting it off during cart transit.'],
  ['Will a rain cover fit a cart bag vs. a stand bag?', 'Yes — universal-fit rain covers with elastic hems fit both. The key difference is internal height: a stand bag hood is typically taller at the top. The WYX cover accommodates both profiles with enough hem stretch to seal around the largest cart bag diameter.'],
  ['Can I leave a rain cover on the bag permanently?', 'Yes — the cover is designed to live in a bag pocket until needed. Fold it into the built-in zip pocket and it takes no more space than a golf towel. Pull it over the bag at the first sign of rain without unpacking anything.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function rainCoverScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/rain.cover|bag.cover/i.test(product.title + ' ' + product.handle)) score += 30;
  if (/rain|waterproof|wet/i.test(product.tags?.join(' ') || '')) score += 8;
  return score;
}

export default async function GolfBagRainCoverPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => rainCoverScore(b) - rainCoverScore(a)).slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Bag Rain Cover', url: `${siteUrl}/golf-bag-rain-cover`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Bag Rain Cover', item: `${siteUrl}/golf-bag-rain-cover` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">WYX Golf Supply Co.</p>
          <h1>Golf Bag Rain Cover.</h1>
          <p className="deal-hero-sub">Pulls over any stand or cart bag in 15 seconds. Keeps grips, headcovers, and pocket contents dry in sideways rain. Taped seams. Packs into its own pocket. Under $30.</p>
          <div className="actions">
            <Link className="button primary" href="#products">Shop Rain Cover</Link>
            <Link className="button secondary" href="/golf-rain-gear">All Rain Gear</Link>
          </div>
        </div>
      </section>

      <div className="deal-strip">
        <span>🌧️ Universal fit — stand & cart bags</span>
        <span>🔒 Taped seams</span>
        <span>💰 Under $30</span>
        <span>🎁 Use WYX10 for 10% off</span>
      </div>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Why Carry One</p>
          <h2>Four Reasons A Rain Cover Pays Off.</h2>
        </div>
        <div className="care-step-grid">
          {reasons.map((r) => (
            <div key={r.head} className="care-step">
              <strong>{r.head}</strong>
              <p>{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Wet Weather</p>
          <h2>Rain Cover & Wet Weather Gear.</h2>
        </div>
        {products.length > 0
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <p>Rain cover ships in 3-5 business days. More wet weather gear below.</p>}
      </section>

      <section className="section faq-section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><h2 id="faq-heading">Rain Cover Questions.</h2></div>
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
