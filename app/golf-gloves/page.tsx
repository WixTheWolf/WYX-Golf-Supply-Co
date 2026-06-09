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
  title: "Golf Gloves — Cabretta Leather, Rain Gloves & 3-Packs | WYX Golf Supply Co.",
  description: "Golf gloves that grip when it counts — cabretta leather 3-packs, wet-weather rain gloves, and UV arm sleeves. All available at WYX Golf Supply Co. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gloves' },
  openGraph: {
    title: "Golf Gloves | WYX Golf Supply Co.",
    description: "Golf gloves for every condition — cabretta leather 3-packs, rain gloves, UV arm sleeves. WYX10 saves 10% at WYX Golf Supply Co.",
    url: '/golf-gloves'
  }
};

const picks = [
  {
    label: 'Cabretta Glove 3-Pack',
    price: '$32',
    href: '/golf-gloves',
    tag: 'Best Value',
    why: 'Three cabretta leather gloves for less than most rounds cost in lost balls. Cabretta is the standard tour-grade material — thin, tactile, breathable, and far better than synthetic alternatives. One glove per three rounds keeps grip confidence consistent all season. Available in S, M, ML, L, XL.'
  },
  {
    label: 'Rain Glove Pair — Wet Weather Grip',
    price: '$34',
    href: '/golf-gloves',
    tag: 'Wet Rounds',
    why: 'The pair of rain gloves that makes a wet-weather round playable. Moisture-activated grip that actually improves as conditions worsen — the opposite of every cabretta glove you have owned. Both hands. Required in Pacific Northwest courses and early morning tee times anywhere.'
  },
  {
    label: 'Golf Arm Sleeves UPF 50+',
    price: '$22',
    href: '/golf-arm-sleeves',
    tag: 'Hot Rounds',
    why: 'Not a glove — but the hot-round hand protection that most golfers skip. UPF 50+ compression sleeves cover the entire forearm and back of the hand. The summer round essential for anyone playing 36+ holes per week in the sun.'
  }
];

const faqs: [string, string][] = [
  ['What is the best golf glove?', 'Cabretta leather is the tour-standard material — thin, tactile, and breathable. A 3-pack of cabretta gloves ($32) gives you three rounds of consistent grip confidence for less than the cost of most green fees. Available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['How often should you replace a golf glove?', 'Every 3-5 rounds for consistent players. The grip starts to soften and the seams begin to stretch after heavy use — especially near the thumb and index finger. A 3-pack ($32) covers a full season of weekly golf for most players.'],
  ['Do I need rain gloves for golf?', 'Yes, if you play in any wet-weather region or in early morning tee times. Rain gloves ($34 for a pair) use moisture-activated grip that improves as they get wetter — standard cabretta gloves become slippery in rain and lose grip when wet.'],
  ['What golf glove size do I need?', 'Measure the circumference of your dominant hand at the widest point (across the knuckles). ML (Medium Large) fits most men, M fits smaller hands, L and XL for larger. When buying as a gift, ML is the right pick for most adult men.']
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

function gloveScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/glove/i.test(product.title)) score += 15;
  if (/cabretta|rain glove|3.pack|3-pack/i.test(product.title)) score += 5;
  if (/glove/i.test(product.productType ?? '')) score += 5;
  return score;
}

export default async function GolfGlovesPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => gloveScore(b) - gloveScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gloves',
        url: `${siteUrl}/golf-gloves`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gloves', item: `${siteUrl}/golf-gloves` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Gloves</p>
          <h1>Golf Gloves. Cabretta 3-Packs, Rain Gloves, and Arm Sleeves.</h1>
          <p>The grip starts with the glove. Cabretta leather 3-packs for consistent dry-round grip, rain gloves for the mornings when it matters most, and UV arm sleeves for the 90-degree days. All at WYX with WYX10 for 10% off every order.</p>
          <div className="actions">
            <Link className="button primary" href="#gloves-grid">Shop Golf Gloves</Link>
            <Link className="button secondary dark" href="/golf-accessories-every-golfer-needs">All Bag Essentials &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Value</p>
          <h2>Cabretta 3-Pack</h2>
          <p>$32. Three cabretta leather gloves — the standard tour material. One glove every three rounds. Replace before the grip softens, not after. ML fits most men if buying as a gift.</p>
          <Link className="button primary" href="#gloves-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop Gloves &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf glove highlights">
        <span>Cabretta leather</span>
        <span>Rain glove pairs</span>
        <span>UV arm sleeves</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Three Glove Picks</p>
          <h2 id="picks-heading">Golf Gloves for Every Condition.</h2>
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

      <section id="gloves-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Gloves</p>
            <h2>Golf Gloves.</h2>
          </div>
          <Link className="text-link" href="/golf-accessories-every-golfer-needs">All Bag Essentials &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Cabretta 3-Pack — $32</strong><p>Tour-grade leather, all season</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rain Glove Pair — $34</strong><p>Wet-weather grip that improves in rain</p></Link>
              <Link href="/golf-arm-sleeves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Arm Sleeves UPF 50+ — $22</strong><p>Hot round hand protection</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Glove FAQ.</h2>
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
        source="golf-gloves"
        campaign="golf_gloves"
        title="Golf Gloves That Grip When It Counts."
        body="Join the WYX list for new glove drops, care guides, and 10% off your first order with WYX10."
      />
    </>
  );
}
