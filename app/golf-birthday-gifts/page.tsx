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
  title: "Golf Birthday Gifts — Picks That Earn a Bag Spot, Not a Shelf Spot | WYX Golf Supply Co.",
  description: "Golf birthday gifts for every budget: a $18 towel, a $32 glove 3-pack, a $38 leather scorecard holder, a $119 rangefinder. Practical picks used every round. WYX10 saves 10%.",
  alternates: { canonical: '/golf-birthday-gifts' },
  openGraph: {
    title: "Golf Birthday Gifts | WYX Golf Supply Co.",
    description: "Golf birthday gift ideas by budget that get used every round. Alignment sticks, glove 3-packs, leather scorecard holders, rangefinders. WYX10 saves 10%.",
    url: '/golf-birthday-gifts'
  }
};

const picks = [
  {
    price: '$18',
    label: 'Microfiber Clip-On Towel',
    tag: 'Under $20',
    href: '/golf-towels',
    why: 'Used every hole, from tee 1 through the 18th green. Carabiner clip attaches to any bag D-ring. The birthday gift that earns a bag spot before the first round is over.'
  },
  {
    price: '$24',
    label: 'Alignment Sticks 2-Pack',
    tag: 'Under $25',
    href: '/golf-training-aids',
    why: 'The training tool every instructor uses and almost no amateur owns. Two sticks, 10 minutes at the range — aim and alignment confirmed, not guessed. Every range session from that point forward.'
  },
  {
    price: '$32',
    label: 'Cabretta Glove 3-Pack',
    tag: 'Under $35',
    href: '/golf-gloves',
    why: 'Golfers use 8-15 gloves per season and almost never buy in bulk. Three fresh cabretta gloves = three rounds starting with a fresh grip. Used within one round. Pick ML if unsure on size.'
  },
  {
    price: '$38',
    label: 'Leather Scorecard Holder',
    tag: 'Under $40',
    href: '/golf-scorecard-holder',
    why: 'Full-grain leather, pencil loop, ball marker pocket, engraving-ready front panel. The bag upgrade they notice every round but never order. Lasts a decade. Looks intentional on the first use.'
  },
  {
    price: '$44',
    label: 'Backyard Chipping Net',
    tag: 'Under $50',
    href: '/golf-training-aids',
    why: 'Four-target folding chipping net. 20 minutes in the backyard before dinner. Folds flat in 60 seconds. The short game practice habit that actually sticks when it removes the "drive to a range" barrier.'
  },
  {
    price: '$119',
    label: 'Laser Rangefinder',
    tag: 'Under $125',
    href: '/golf-rangefinder',
    why: 'The most impactful golf tech upgrade. Slope compensation, pin-lock vibration, 800-yard range. If they do not own one, this is the birthday gift. Changes how they think about every approach shot.'
  }
];

const faqs: [string, string][] = [
  ['What is the best golf birthday gift?', 'By budget: under $25 — alignment sticks ($24); under $40 — glove 3-pack ($32); under $50 — leather scorecard holder ($38); under $60 — backyard chipping net ($44); under $125 — laser rangefinder ($119). All are accessories the recipient uses every round and would rarely buy for themselves. Available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf birthday gift has no size risk?', 'Towels ($18), alignment sticks ($24), leather scorecard holders ($38), chipping nets ($44), rangefinders ($119) — all completely size-free. Gloves come in S/M/ML/L. Pick ML if unsure — it fits the broadest range of hand sizes for both men and women.'],
  ['Is a golf gift card better than a specific gift?', 'A specific, well-chosen gift lands harder than a gift card. A gift card says "I did not know what to get you." A glove 3-pack or a leather scorecard holder says "I know you golf and I know what you actually use." The picks on this page are chosen specifically because they are things golfers use every round and almost never buy for themselves — which is exactly what makes them work as gifts.']
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

function birthdayGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/glove|towel|marker|alignment|scorecard|rangefinder|chipping net/i.test(product.title)) score += 8;
  if (price <= 45) score += 6;
  if (price <= 25) score += 4;
  return score;
}

export default async function GolfBirthdayGiftsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => birthdayGiftScore(b) - birthdayGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Birthday Gifts',
        url: `${siteUrl}/golf-birthday-gifts`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Birthday Gifts', item: `${siteUrl}/golf-birthday-gifts` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Birthday Gifts</p>
          <h1>Golf Birthday Gifts. Bag Spots, Not Shelf Spots.</h1>
          <p>These are the accessories a golfer uses every single round — the picks they know they should have but never order for themselves. Six gifts at six budgets, from $18 to $119. All ship in 1-3 days.</p>
          <div className="actions">
            <Link className="button primary" href="#birthday-grid">Shop Birthday Picks</Link>
            <Link className="button secondary dark" href="/golf-rangefinder">See the Rangefinder &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Gift Under $40</p>
          <h2>Glove 3-Pack</h2>
          <p>$32. Three fresh cabretta gloves — the consumable gift they use every round and almost never restock. Used within one round of receiving. No shelf risk.</p>
          <Link className="button primary" href="/golf-gloves" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Gloves &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf birthday gift highlights">
        <span>Six budget tiers</span>
        <span>No size guesswork on 5 of 6</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Picks at Six Budgets</p>
          <h2 id="picks-heading">Golf Birthday Gifts for Every Budget.</h2>
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

      <section id="birthday-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Birthday Gifts.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Used every hole</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Scorecard Holder — $38</strong><p>Used every round for a decade</p></Link>
              <Link href="/golf-rangefinder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rangefinder — $119</strong><p>Used every approach shot</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Birthday Gift FAQ.</h2>
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
          <h2 id="links-heading">Golf Gifts by Recipient.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/golf-gifts-for-dad" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Dad</strong><p>Father&apos;s Day and birthday picks for the dad who golfs</p></Link>
          <Link href="/golf-gifts-for-husband" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Husband</strong><p>Budget tiers and practical picks for the husband who golfs</p></Link>
          <Link href="/golf-gifts-for-mom" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Mom</strong><p>All under $50 — bag essentials she uses every round</p></Link>
          <Link href="/golf-gifts-for-boyfriend" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Boyfriend</strong><p>Practical picks in the gift-sweet-spot price range</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-birthday-gifts"
        campaign="birthday_golf_gifts"
        title="Golf Birthday Gifts That Actually Get Used."
        body="Join the WYX list for seasonal gift guides, new product alerts, and 10% off your first order with WYX10."
      />
    </>
  );
}
