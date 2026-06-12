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
  title: "Golf Gifts for a Teenage Golfer — Picks That Actually Get Used | WYX Golf Supply Co.",
  description: "Golf gifts for teenage golfers — alignment sticks, gloves, ball retrievers, chipping nets, and the accessories that help them improve faster. Under $50. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-teenage-golfer' },
  openGraph: {
    title: "Golf Gifts for a Teenage Golfer | WYX Golf Supply Co.",
    description: "Golf gifts for a teen golfer that actually improve their game — alignment sticks, gloves, ball retriever, chipping net. Under $50. WYX10 saves 10%.",
    url: '/golf-gifts-for-teenage-golfer'
  }
};

const picks = [
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', tag: 'Improves Fastest', why: 'The number one thing holding teen golfers back is poor aim — not swing flaws. Two sticks, 10 minutes at the range, confirm ball position and target line before every session. Every scratch player and every tour pro uses these. The teen golfer probably does not.' },
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', tag: 'Most Used', why: 'Teenagers play more rounds per week than most adults and go through gloves faster. A 3-pack means three rounds starting with a real grip — not the worn-out one from three months ago. Available in S, M, ML.' },
  { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', tag: 'Bag Essential', why: 'The bag essential most teen golfers have never bothered to add. A dual-sided towel keeps the face clean after every iron shot — clean contact is the first step to consistent distance on mishits.' },
  { label: 'Golf Ball Retriever', price: '$24', href: '/golf-ball-retriever', tag: 'Cost Saver', why: '15-foot telescoping stainless retriever. Teen golfers lose more balls than any other category. A retriever pays for itself in the first round. Collapses to 26 inches for the bag pocket.' },
  { label: 'Backyard Chipping Net', price: '$44', href: '/golf-training-aids', tag: 'Home Practice', why: 'Four targets, folds in 60 seconds, 20 minutes before dinner. The practice habit that makes a teen golfer improve faster than any range session — and one they will actually keep because it removes the "drive to a range" barrier.' },
  { label: 'Night Golf LED Ball Set', price: '$42', href: '/golf-balls', tag: 'Fun Factor', why: '12 LED-core balls that glow through the air. The experience gift for a teenage golfer — a completely different format of the game they love. Makes a night round with friends a memorable event rather than just another round.' }
];

const faqs: [string, string][] = [
  ['What are the best golf gifts for a teenage golfer?', 'Alignment sticks ($24 — fastest improvement tool), glove 3-pack ($32 — used every round), ball retriever ($24 — saves money immediately), backyard chipping net ($44 — home practice that sticks), night golf LED balls ($42 — the experience gift). Use WYX10 for 10% off at wyxgolfsupply.com.'],
  ['What golf gift helps a teen golfer improve the most?', 'Alignment sticks ($24) produce the fastest improvement — they fix the number one beginner and intermediate mistake (poor aim) in 10 minutes. After that, a backyard chipping net ($44) builds the short game practice habit that produces more score improvement than any additional range time.'],
  ['Golf gifts for teen golfer who wants to get serious?', 'The alignment stick + chipping net combo ($68 total, $61 with WYX10) is the complete home practice setup for a teen who wants to improve. Add a glove 3-pack ($32) and ball retriever ($24) and you have covered every practical need in their bag for the season.']
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

function teenGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/alignment|glove|retriever|chipping net|night|led/i.test(product.title)) score += 8;
  if (price <= 45) score += 5;
  return score;
}

export default async function GolfGiftsForTeenagerPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => teenGiftScore(b) - teenGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for a Teenage Golfer',
        url: `${siteUrl}/golf-gifts-for-teenage-golfer`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for a Teenage Golfer', item: `${siteUrl}/golf-gifts-for-teenage-golfer` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">For the Teen Golfer</p>
          <h1>Golf Gifts for a Teenage Golfer. Picks That Help Them Improve.</h1>
          <p>Not new clubs. Not balls they will hit into the water in round 1. These are the accessories that make a teenage golfer improve faster — alignment tools, fresh gloves, a ball retriever, a chipping net, and a night golf kit for the fun rounds. All under $50.</p>
          <div className="actions">
            <Link className="button primary" href="#teen-grid">Shop Teen Golf Gifts</Link>
            <Link className="button secondary dark" href="/golf-training-aids">Training Aids &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Teen Golf Gift</p>
          <h2>Alignment Sticks</h2>
          <p>$24. The fastest improvement tool in golf. Two sticks, 10 minutes before the range session — aim confirmed before a single swing. Every tour pro uses these. Almost no amateur teen does.</p>
          <Link className="button primary" href="/golf-training-aids" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Alignment Sticks &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Teen golf gift highlights">
        <span>All under $50</span>
        <span>Practical + fun picks</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Picks</p>
          <h2 id="picks-heading">Golf Gifts for a Teenage Golfer.</h2>
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

      <section id="teen-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts for Teen Golfers.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>Fastest improvement tool</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round</p></Link>
              <Link href="/golf-ball-retriever" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Retriever — $24</strong><p>Pays for itself round 1</p></Link>
              <Link href="/golf-balls" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Night Golf LED Balls — $42</strong><p>The experience gift</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gifts for Teen Golfer FAQ.</h2>
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

      <section className="section reveal" aria-labelledby="links-heading">
        <div className="section-heading"><p className="eyebrow">More Gift Ideas</p><h2 id="links-heading">Golf Gifts for Every Stage of the Game.</h2></div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-beginners" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Beginners</strong><p>Picks for the new golfer in your life</p></Link>
          <Link href="/golf-training-aids-for-beginners" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Training Aids</strong><p>Tools that help them improve faster</p></Link>
          <Link href="/night-golf" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Night Golf Gear</strong><p>Glow balls and lights for after-dark rounds</p></Link>
          <Link href="/golf-gifts-for-boyfriend" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Boyfriend</strong><p>Practical picks for the golfer in your life</p></Link>
          <Link href="/golf-gifts-under-50" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts Under $50</strong><p>The practical gift sweet spot</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-for-teenage-golfer"
        campaign="teen_golf_gifts"
        title="Golf Gifts for the Teenage Golfer in Your Life."
        body="Join the WYX list for golf improvement guides and 10% off your first order with WYX10."
      />
    </>
  );
}
