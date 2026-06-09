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
  title: "Golf Gifts for Boyfriend — Picks He Will Actually Use Every Round | WYX Golf Supply Co.",
  description: "Golf gifts for your boyfriend that earn a bag spot — gloves, towels, alignment sticks, a leather scorecard holder, a rangefinder. By budget, no size guesswork. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-boyfriend' },
  openGraph: {
    title: "Golf Gifts for Boyfriend | WYX Golf Supply Co.",
    description: "Golf gifts for a boyfriend who golfs — practical picks used every round. Gloves, leather accessories, training aids, rangefinder. WYX10 saves 10%.",
    url: '/golf-gifts-for-boyfriend'
  }
};

const picks = [
  { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', tag: 'Under $20', why: 'Used every hole. Clip attaches to any bag D-ring. The round-1 gift — in the bag before the first hole and used on every iron shot for years.' },
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', tag: 'Under $25', why: 'The tool every range session needs and almost no amateur buys. Ball position, aim, path — confirmed before the round instead of guessed. He will wonder why he waited.' },
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', tag: 'Under $35', why: 'He goes through gloves fast and almost never restocks. A 3-pack means three rounds starting with a fresh grip — not the worn-out one from six weeks ago. Pick ML if size is unclear.' },
  { label: 'Leather Scorecard Holder', price: '$38', href: '/golf-scorecard-holder', tag: 'Under $40', why: 'The bag upgrade that lasts a decade. Full-grain leather, pencil loop, ball marker pocket, engraving-ready front panel. Playing partners ask about it within three rounds.' },
  { label: 'Backyard Chipping Net', price: '$44', href: '/golf-training-aids', tag: 'Under $50', why: 'Four-target folding chipping net. 20 minutes in the backyard before dinner. Folds flat in 60 seconds. The practice habit that sticks when it removes the "drive to a range" barrier.' },
  { label: 'Laser Rangefinder', price: '$119', href: '/golf-rangefinder', tag: 'Under $120', why: 'The most impactful single golf upgrade. Slope compensation, 800-yard range, pin-lock vibration. He mentions yardage every round — this replaces all the guesswork permanently.' }
];

const faqs: [string, string][] = [
  ['What is the best golf gift for a boyfriend?', 'By budget: under $25 — alignment sticks ($24), the tool he uses every range session; under $35 — glove 3-pack ($32), used every round; under $40 — leather scorecard holder ($38), the elegant bag upgrade; under $120 — laser rangefinder ($119), the most impactful upgrade in golf. All available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf gifts have no size risk?', 'Towels ($18), alignment sticks ($24), leather scorecard holders ($38), chipping nets ($44), and rangefinders ($119) are all completely size-free. Gloves require a size — if unsure, pick ML (fits most men in the M-L hand range). The scorecard holder and rangefinder are always safe picks.'],
  ['Golf gift ideas for a boyfriend birthday?', 'The glove 3-pack ($32) is the best under-$35 birthday gift — used immediately, no shelf risk. The leather scorecard holder ($38) is the best under-$50 pick — elegant, practical, lasts a decade. The rangefinder ($119) is the gift he mentions to every playing partner — maximum impact for the gift budget.']
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

function bfGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/glove|towel|scorecard|alignment|rangefinder|chipping net/i.test(product.title)) score += 8;
  if (price <= 45) score += 5;
  return score;
}

export default async function GolfGiftsForBoyfriendPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => bfGiftScore(b) - bfGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for Boyfriend',
        url: `${siteUrl}/golf-gifts-for-boyfriend`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for Boyfriend', item: `${siteUrl}/golf-gifts-for-boyfriend` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">For the Boyfriend Who Golfs</p>
          <h1>Golf Gifts for Boyfriend. Used Every Round, Never on a Shelf.</h1>
          <p>Six picks at six budgets — from $18 to $119. These are the accessories a golfer uses every single round and the upgrades he always delays buying for himself. No size guesswork on five of six.</p>
          <div className="actions">
            <Link className="button primary" href="#bf-grid">Shop Gift Picks</Link>
            <Link className="button secondary dark" href="/golf-rangefinder">See the Rangefinder &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Gift Under $40</p>
          <h2>Leather Scorecard Holder</h2>
          <p>$38. Full-grain leather, pencil loop, ball marker pocket, engraving-ready front panel. Used every round. Playing partners ask about it within three rounds. Lasts a decade.</p>
          <Link className="button primary" href="/golf-scorecard-holder" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Holder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf boyfriend gift highlights">
        <span>Six budget tiers</span>
        <span>No size guesswork on 5 of 6</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Picks at Six Budgets</p>
          <h2 id="picks-heading">Golf Gifts for Boyfriend at Every Price.</h2>
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

      <section id="bf-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts for Boyfriend.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Used every hole</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Scorecard Holder — $38</strong><p>The bag upgrade that lasts</p></Link>
              <Link href="/golf-rangefinder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rangefinder — $119</strong><p>The most impactful upgrade</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gift for Boyfriend FAQ.</h2>
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
        <div className="section-heading">
          <p className="eyebrow">More Gift Ideas</p>
          <h2 id="links-heading">Golf Gifts by Occasion.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-birthday-gifts" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Birthday Gifts</strong><p>Budget-tiered picks for any birthday budget</p></Link>
          <Link href="/golf-gifts-for-husband" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Husband</strong><p>Practical picks for the husband who golfs</p></Link>
          <Link href="/golf-gifts-for-anniversary" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Anniversary Gifts</strong><p>Elevated picks for a milestone occasion</p></Link>
          <Link href="/golf-gifts-under-50" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts Under $50</strong><p>Every pick under $50 — no overspending</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-for-boyfriend"
        campaign="boyfriend_golf_gifts"
        title="Golf Gifts for the Boyfriend Who Golfs."
        body="Join the WYX list for gift guides, seasonal picks, and 10% off your first order with WYX10."
      />
    </>
  );
}
