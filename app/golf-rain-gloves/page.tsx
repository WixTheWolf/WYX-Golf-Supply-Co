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
  title: 'Golf Rain Gloves — Wet Weather Grip Gloves | WYX Golf Supply Co.',
  description: 'Golf rain gloves that grip better when wet. Rain-activation microfiber surface, sold as a pair, machine washable. Under $30. WYX10 saves 10%.',
  alternates: { canonical: '/golf-rain-gloves' },
  openGraph: {
    title: 'Golf Rain Gloves | Wet Weather Grip | WYX Golf Supply Co.',
    description: 'Rain gloves that grip harder in wet conditions — the opposite of standard cabretta leather. Sold as a pair. Under $30.',
    url: '/golf-rain-gloves'
  }
};

const whyRainGloves = [
  { head: 'Standard Gloves Go Slick When Wet', body: 'Cabretta leather is the best material for grip in dry conditions — but wet cabretta becomes slick within 2-3 rain-exposed holes. The grip pressure required to compensate for a slick glove introduces tension in the forearms and wrists that costs distance and accuracy. Rain gloves solve this at the source rather than compensating for it with swing adjustments.' },
  { head: 'Rain-Activation Material Grips Harder When Wet', body: 'Wet weather golf gloves use a synthetic microfiber surface that activates when wet — the material becomes tackier under moisture, not slicker. This is the opposite of cabretta leather behavior. In rain conditions, the grip quality at address and through impact improves as the round continues, rather than deteriorating hole by hole.' },
  { head: 'Sold As A Pair — Both Hands Covered', body: 'Standard golf gloves are single-hand (gloved hand only). Rain gloves are sold as a pair because wet grip on the lead hand is only half the problem — the trail hand on the club also loses traction in the rain. A two-glove setup maintains control on both sides of the grip through impact.' },
  { head: 'Machine Washable — Retains Grip Through Wash Cycles', body: 'Rain gloves that lose their rain-activation after one wash are not worth buying. The WYX wet weather gloves retain their surface tacky activation after repeated machine wash cycles on cold — so one pair covers an entire wet season of rounds without degradation.' }
];

const faqs: [string, string][] = [
  ['What are golf rain gloves?', 'Golf rain gloves are wet-weather golf gloves made from a synthetic microfiber or rain-activation material that grips better when wet than when dry. Unlike standard cabretta leather gloves (which become slick in rain), rain gloves are designed for exactly these conditions. They are sold as a pair to cover both hands.'],
  ['Do golf rain gloves really work?', 'Yes — rain-activation gloves are meaningfully different from standard golf gloves in wet conditions. The surface tacky grip improves as moisture increases rather than declining. Tour players use them in rain events specifically because the alternative (compensating grip pressure with a slick leather glove) introduces swing faults under pressure.'],
  ['Can you use regular golf gloves in the rain?', 'You can, but performance declines from the first wet hole. Standard cabretta leather loses grip quickly when saturated. In light drizzle, a standard glove lasts 3-4 holes before becoming noticeably slick. In sustained rain, a standard glove requires significantly more grip pressure — which creates tension that costs distance.'],
  ['How do I dry rain gloves between holes?', 'Shake off excess water and let them air during the cart ride between holes. Rain gloves dry faster than cabretta leather because the synthetic surface does not absorb water the way leather does. Keep a second pair in a zip-lock bag in the cart for extended rain rounds — switching gloves mid-round ensures consistent grip through a full 18 holes.']
];

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

function rainGloveScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/rain.glove|wet.glove|wet.weather.*glove/i.test(product.title + ' ' + product.handle)) score += 30;
  if (/glove/i.test(product.title)) score += 8;
  if (/rain|wet/i.test(product.title)) score += 5;
  return score;
}

export default async function GolfRainGlovesPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts.sort((a, b) => rainGloveScore(b) - rainGloveScore(a)).slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Golf Rain Gloves',
        url: `${siteUrl}/golf-rain-gloves`,
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Golf Gloves', item: `${siteUrl}/golf-gloves` },
          { '@type': 'ListItem', position: 3, name: 'Rain Gloves', item: `${siteUrl}/golf-rain-gloves` }
        ]}
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Wet Weather Grip</p>
          <h1>Golf Rain Gloves.</h1>
          <p className="deal-hero-sub">Gloves that grip better when wet — not worse. Rain-activation microfiber surface, sold as a pair. Under $30. Use WYX10 for 10% off.</p>
          <div className="actions">
            <Link className="button primary" href="#products">Shop Rain Gloves</Link>
            <Link className="button secondary" href="/golf-gloves">All Golf Gloves</Link>
          </div>
        </div>
      </section>

      <div className="deal-strip">
        <span>🌧️ Grips better when wet</span>
        <span>🧤 Sold as a pair</span>
        <span>💰 Under $30</span>
        <span>🎁 Use WYX10 for 10% off</span>
      </div>

      <section className="section reveal">
        <div className="section-heading">
          <p className="eyebrow">Why Rain Gloves</p>
          <h2>Why Rain Gloves Work Differently.</h2>
        </div>
        <div className="care-step-grid">
          {whyRainGloves.map((s) => (
            <div key={s.head} className="care-step">
              <strong>{s.head}</strong>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="section reveal">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Wet Weather</p>
            <h2>Rain Gloves & Wet Weather Gear.</h2>
          </div>
          <Link className="text-link" href="/golf-rain-gear">See All Rain Gear</Link>
        </div>
        {products.length > 0
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <p>Check back shortly — products are syncing.</p>}
      </section>

      <section className="section faq-section reveal" aria-labelledby="faq-heading">
        <div className="section-heading"><h2 id="faq-heading">Rain Glove Questions.</h2></div>
        <dl className="faq-list">
          {faqs.map(([q, a]) => (
            <div key={q} className="faq-item">
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <EmailCapture
        source="golf-rain-gloves"
        campaign="wet-weather-gear"
        title="Play Better in Any Weather."
        body="Join the WYX list for wet weather golf tips and 10% off your first order with WYX10."
      />
    </>
  );
}
