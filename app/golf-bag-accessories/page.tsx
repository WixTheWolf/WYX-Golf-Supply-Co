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
  title: "Golf Bag Accessories — Towels, Markers, Retrievers & Divot Tools | WYX Golf Supply Co.",
  description: "Golf bag accessories that fill the gaps — towels, ball markers, divot tools, umbrella holders, and strap covers. The accessories used every round. Under $30. WYX10 saves 10%.",
  alternates: { canonical: '/golf-bag-accessories' },
  openGraph: {
    title: "Golf Bag Accessories | WYX Golf Supply Co.",
    description: "Golf bag accessories used every round — towels, ball markers, divot tools, and utility picks. Under $30. WYX10 saves 10%.",
    url: '/golf-bag-accessories'
  }
};

const essentials = [
  { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', tag: 'Most Used' },
  { label: 'Hat Clip Ball Marker Set', price: '$16', href: '/golf-ball-markers', tag: 'Every Green' },
  { label: 'Magnetic Divot Tool + Marker', price: '$18', href: '/golf-divot-tools', tag: 'Green Repair' },
  { label: 'Golf Ball Retriever — 15 Foot', price: '$24', href: '/golf-ball-retriever', tag: 'Ball Recovery' },
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', tag: 'Range Use' },
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', tag: 'Every Round' }
];

const faqs: [string, string][] = [
  ['What are the essential golf bag accessories?', 'Six bag essentials: clip-on microfiber towel ($18 — used every hole), hat clip ball markers ($16 — used every green), magnetic divot tool ($18 — used every approach), ball retriever ($24 — used every water hazard), alignment sticks ($24 — used every range session), glove 3-pack ($32 — used every round). All at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf accessories do most golfers not have but need?', 'Ball retriever ($24) — most golfers watch their ball roll into the pond and walk away. Alignment sticks ($24) — most golfers aim 10-15 yards right of target without knowing it. Magnetic divot tool ($18) — most golfers use a tee or their finger and leave improperly repaired marks. Three practical items that most golfers have never purchased.'],
  ['What are good small golf bag accessories?', 'Hat clip ball markers ($16), magnetic divot tool ($18), and a clip-on microfiber towel ($18) — all three fit in a standard side bag pocket. All under $20, zero size risk, all used every round. The three bag accessories most golfers receive as gifts and immediately add to their permanent bag setup.']
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

function bagAccessoryScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/towel|marker|divot|retriever|glove|alignment/i.test(product.title)) score += 8;
  return score;
}

export default async function GolfBagAccessoriesPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => bagAccessoryScore(b) - bagAccessoryScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Bag Accessories',
        url: `${siteUrl}/golf-bag-accessories`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Bag Accessories', item: `${siteUrl}/golf-bag-accessories` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Bag Accessories</p>
          <h1>Golf Bag Accessories. The Six Items That Fill the Gaps.</h1>
          <p>Every serious bag has a towel, markers, divot tool, ball retriever, alignment sticks, and fresh gloves. Most golfers have three of the six. These are the accessories used every hole of every round that most golfers have never bought for themselves. All under $35.</p>
          <div className="actions">
            <Link className="button primary" href="#accessories-grid">Shop Bag Accessories</Link>
            <Link className="button secondary dark" href="/golf-accessories-every-golfer-needs">Essentials List &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most Overlooked Bag Item</p>
          <h2>Ball Retriever</h2>
          <p>$24. Most golfers watch their ball enter the pond and walk away. A 15-foot telescoping retriever in the side pocket recovers any standard ball. Pays for itself after 2-3 recovered balls — which happens in the first round with a water hazard.</p>
          <Link className="button primary" href="/golf-ball-retriever" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Retriever &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf bag accessory highlights">
        <span>All under $35</span>
        <span>Used every round</span>
        <span>Zero size risk on 5 of 6</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="essentials-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Bag Essentials</p>
          <h2 id="essentials-heading">Golf Bag Accessories. The Complete Set.</h2>
        </div>
        <div className="care-step-grid">
          {essentials.map((item) => (
            <Link key={item.label} href={item.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{item.tag}</small>
              <strong>{item.label} — {item.price}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section id="accessories-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Bag Accessories</p>
            <h2>Golf Bag Accessories.</h2>
          </div>
          <Link className="text-link" href="/golf-accessories-every-golfer-needs">All Essentials &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Used every hole</p></Link>
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Markers — $16</strong><p>Used every green</p></Link>
              <Link href="/golf-divot-tools" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Divot Tool — $18</strong><p>Used every approach</p></Link>
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Retriever — $24</strong><p>Used every water hazard</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Bag Accessories FAQ.</h2>
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
        source="golf-bag-accessories"
        campaign="golf_bag_accessories"
        title="Golf Bag Accessories That Fill the Gaps."
        body="Join the WYX list for bag setup guides and 10% off your first order with WYX10."
      />
    </>
  );
}
