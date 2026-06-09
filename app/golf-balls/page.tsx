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
  title: "Golf Balls — Night Golf LED Balls, Practice Balls & More | WYX Golf Supply Co.",
  description: "Golf balls for every round — night golf LED balls that glow, practice balls for the backyard, and the accessories that keep the ball in play longer. WYX10 saves 10%.",
  alternates: { canonical: '/golf-balls' },
  openGraph: {
    title: "Golf Balls | WYX Golf Supply Co.",
    description: "Golf balls for fun rounds and serious practice — night golf LED sets, backyard practice balls. WYX10 saves 10% at WYX Golf Supply Co.",
    url: '/golf-balls'
  }
};

const picks = [
  {
    label: 'Night Golf LED Ball Set — 12 Balls',
    price: '$42',
    href: '/golf-balls',
    tag: 'Most Fun',
    why: 'Twelve LED-core balls that glow through the air and on the green. A completely different format of the game — twilight rounds, after-work 9, backyard putting under the lights. The experience gift for any golfer who has played every standard format available. Unforgettable.'
  },
  {
    label: 'Practice Ball Set — Backyard Safe',
    price: '$24',
    href: '/golf-balls',
    tag: 'Home Practice',
    why: 'Foam or low-compression practice balls that travel 1/3 the distance of a real ball — safe for backyard use and perfect for chipping net practice. A 30-ball set gives consistent contact repetition without the range fee or the drive. The complete home practice setup starts with these.'
  },
  {
    label: 'Golf Ball Retriever — 15 Foot',
    price: '$24',
    href: '/golf-ball-retriever',
    tag: 'Recover More',
    why: 'Not a ball — but the tool that keeps balls in play. A 15-foot telescoping stainless retriever recovers any standard ball from ponds, creeks, and rough edges. Pays for itself in the first round. The practical accessory that stretches any ball budget.'
  }
];

const faqs: [string, string][] = [
  ['What are the best golf balls for beginners?', 'Two-piece distance balls with a surlyn cover — durable, affordable, and forgiving on mishits. More importantly: a ball retriever ($24) that keeps those balls in play. Beginners lose 3-5 balls per round — the retriever stretches any ball budget further than buying premium balls does.'],
  ['What are night golf LED balls?', 'LED golf balls have a light-emitting core that activates on impact and glows in flight and on the green. A 12-ball set ($42) at WYX Golf Supply enables night golf rounds — a different format that has become popular at twilight leagues and after-work 9s. Available with WYX10 for 10% off.'],
  ['What is a good golf ball gift?', 'Night golf LED balls ($42) are the best golf ball gift — an experience, not a commodity. Standard premium balls are something every golfer buys themselves. LED balls open a format the recipient probably has not tried. Pair with a ball retriever ($24) for the practical golfer.']
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

function ballScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/ball/i.test(product.title)) score += 12;
  if (/led|night golf|practice ball/i.test(product.title)) score += 6;
  return score;
}

export default async function GolfBallsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => ballScore(b) - ballScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Balls',
        url: `${siteUrl}/golf-balls`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Balls', item: `${siteUrl}/golf-balls` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Balls</p>
          <h1>Golf Balls. Night Golf LED Sets, Practice Balls &amp; More.</h1>
          <p>Standard balls you can find anywhere — LED night golf balls and backyard practice sets you can find here. The experience picks that make every round more interesting. Under $45 each, WYX10 saves 10%.</p>
          <div className="actions">
            <Link className="button primary" href="#balls-grid">Shop Golf Balls</Link>
            <Link className="button secondary dark" href="/golf-ball-retriever">Ball Retriever &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Golf Ball Gift</p>
          <h2>Night Golf LED Set</h2>
          <p>$42 for 12 LED balls. Glow in flight, glow on the green. A format the recipient probably has not tried — a twilight round, an after-work 9, a backyard putting game under the lights. The golf ball gift that is an experience.</p>
          <Link className="button primary" href="#balls-grid" style={{ marginTop: '1rem', display: 'inline-block' }}>Shop LED Balls &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf ball highlights">
        <span>Night golf LED sets</span>
        <span>Backyard practice balls</span>
        <span>Ball retriever available</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Three Ball Picks</p>
          <h2 id="picks-heading">Golf Balls. The Ones Worth Buying Here.</h2>
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

      <section id="balls-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Balls</p>
            <h2>Golf Balls.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts-for-men">Golf Gifts for Him &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-balls" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Night Golf LED Set — $42</strong><p>12 balls, glow in flight</p></Link>
              <Link href="/golf-balls" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Practice Ball Set — $24</strong><p>30 balls, backyard safe</p></Link>
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Retriever — $24</strong><p>15 feet, collapses to 26 inches</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Balls FAQ.</h2>
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
        source="golf-balls"
        campaign="golf_balls"
        title="Night Golf, Practice Balls &amp; More."
        body="Join the WYX list for new ball drops, night golf guides, and 10% off your first order with WYX10."
      />
    </>
  );
}
