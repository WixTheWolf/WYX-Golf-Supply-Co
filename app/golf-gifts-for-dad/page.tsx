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
  title: "Golf Gifts for Dad — Practical Picks He Uses Every Round | WYX Golf Supply Co.",
  description: "Golf gifts for Dad that earn a permanent bag spot — fresh gloves, a leather scorecard holder, a rangefinder, and the training tools he would never buy himself. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-dad' },
  openGraph: {
    title: "Golf Gifts for Dad | WYX Golf Supply Co.",
    description: "Golf gifts for the Dad who golfs — practical picks used every round. Gloves, leather holders, rangefinders, training aids. WYX10 saves 10%.",
    url: '/golf-gifts-for-dad'
  }
};

const picks = [
  {
    price: '$18',
    label: 'Clip-On Microfiber Towel',
    tag: 'Under $20',
    href: '/golf-towels',
    why: 'Used every hole from tee 1 through 18. Carabiner clip attaches to any bag D-ring. The gift that earns a bag spot before the first hole ends. Dual-sided — one side scrubs, one side dries. The most-used golf accessory that most dads never replace.'
  },
  {
    price: '$24',
    label: 'Alignment Sticks 2-Pack',
    tag: 'Under $25',
    href: '/golf-training-aids',
    why: 'The training tool every instructor uses and almost no amateur owns. Two sticks, 10 minutes before a round — aim and alignment confirmed instead of guessed. He will use these every range session and wonder why he waited.'
  },
  {
    price: '$32',
    label: 'Cabretta Glove 3-Pack',
    tag: 'Under $35',
    href: '/golf-gloves',
    why: 'Dad goes through 8-15 gloves a season and almost never buys in bulk. A 3-pack means three rounds starting with a fresh cabretta glove. The consumable gift that gets used within one round and finishes with "where did you get these?"'
  },
  {
    price: '$38',
    label: 'Leather Scorecard Holder',
    tag: 'Under $40',
    href: '/golf-scorecard-holder',
    why: 'Full-grain leather, pencil loop, ball marker pocket, engraving-ready front panel. The bag upgrade that lasts a decade. Playing partners ask about it within three rounds. More than 80% of avid golfers do not own one — which is what makes it such a good Father\'s Day gift.'
  },
  {
    price: '$44',
    label: 'Backyard Chipping Net',
    tag: 'Under $50',
    href: '/golf-training-aids',
    why: '20 minutes in the backyard before dinner. Four targets. Folds flat in 60 seconds. The short game practice habit that sticks when the range is 20 minutes away. The gift that produces visible score improvement within two weeks.'
  },
  {
    price: '$119',
    label: 'Laser Rangefinder',
    tag: 'Best Tech Gift',
    href: '/golf-rangefinder',
    why: 'The single most impactful golf tech upgrade. Slope compensation, pin-lock vibration, 800-yard range. If Dad does not own one, this is the Father\'s Day gift. He mentions yardage every round — this replaces all the guesswork permanently.'
  }
];

const faqs: [string, string][] = [
  ['What is the best golf gift for Dad?', 'By budget: under $25 — alignment sticks ($24); under $35 — glove 3-pack ($32); under $40 — leather scorecard holder ($38); under $50 — backyard chipping net ($44); under $120 — laser rangefinder ($119). All are accessories Dad uses every round and would rarely buy for himself. Available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf gifts for Dad have no size risk?', 'Towels ($18), alignment sticks ($24), leather scorecard holders ($38), chipping nets ($44), and rangefinders ($119) are completely size-free. Gloves require a size — pick ML for most men if unsure. All of the above work for any skill level from beginner to single-digit handicap.'],
  ['Best last-minute golf gift for Dad?', 'The leather scorecard holder ($38), alignment sticks ($24), or glove 3-pack ($32) all ship in 1-3 days — no waiting. Use WYX10 for 10% off any order at wyxgolfsupply.com. For Father\'s Day or a birthday within the week, any of these will arrive in time.']
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

function dadGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/glove|towel|scorecard|alignment|rangefinder|chipping net/i.test(product.title)) score += 8;
  if (price <= 50) score += 5;
  if (price <= 25) score += 3;
  return score;
}

export default async function GolfGiftsForDadPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => dadGiftScore(b) - dadGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for Dad',
        url: `${siteUrl}/golf-gifts-for-dad`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for Dad', item: `${siteUrl}/golf-gifts-for-dad` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Father&apos;s Day &amp; Beyond</p>
          <h1>Golf Gifts for Dad. The Picks He Uses Every Single Round.</h1>
          <p>Not a novelty. Not something that ends up in the closet. These are the accessories Dad uses every round — the ones he knows he should have but never orders for himself. Six picks, from $18 to $119. Ships in 1-3 days.</p>
          <div className="actions">
            <Link className="button primary" href="#dad-grid">Shop Golf Gifts for Dad</Link>
            <Link className="button secondary dark" href="/fathers-day-golf-gifts">Father&apos;s Day Gifts &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off. Free 30-day returns.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Golf Gift for Dad Under $40</p>
          <h2>Leather Scorecard Holder</h2>
          <p>$38. Full-grain leather, pencil loop, ball marker pocket, engraving-ready front panel. Used every round. The bag upgrade playing partners ask about within three rounds. Lasts a decade.</p>
          <Link className="button primary" href="/golf-scorecard-holder" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Holder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf gifts for dad highlights">
        <span>Father&apos;s Day &amp; birthday picks</span>
        <span>No size guesswork on 5 of 6</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Picks by Budget</p>
          <h2 id="picks-heading">Golf Gifts for Dad at Every Price.</h2>
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

      <section id="dad-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Golf Gifts for Dad</p>
            <h2>Golf Gifts for Dad.</h2>
          </div>
          <Link className="text-link" href="/golf-gifts">All Golf Gifts &rarr;</Link>
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

      <section className="section reveal" aria-labelledby="occasions-heading">
        <div className="section-heading">
          <p className="eyebrow">By Occasion</p>
          <h2 id="occasions-heading">Golf Gifts for Dad — Every Occasion.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/fathers-day-golf-gifts" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Father&apos;s Day</strong>
            <p>The leather scorecard holder and glove 3-pack together ($70) is the complete Father&apos;s Day golf set. Elegant, practical, used in round 1. No size risk on the holder.</p>
          </Link>
          <Link href="/golf-birthday-gifts" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Birthday</strong>
            <p>Alignment sticks ($24) for the practical gift; rangefinder ($119) for the milestone birthday. Both change how he approaches every round after receiving them.</p>
          </Link>
          <Link href="/kits/dad-gift-kit" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Dad Gift Kit</strong>
            <p>The WYX Dad Gift Kit bundles four practical picks — glove, towel, leather scorecard holder, and a training tool — for Father&apos;s Day or any occasion under one order.</p>
          </Link>
          <Link href="/golf-gifts-under-50" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Under $50</strong>
            <p>Three great picks under $50: glove 3-pack ($32), leather scorecard holder ($38), or chipping net ($44). All used within one round of receiving them.</p>
          </Link>
        </div>
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Common Questions</p>
          <h2 id="faq-heading">Golf Gift for Dad FAQ.</h2>
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
        source="golf-gifts-for-dad"
        campaign="dad_golf_gifts"
        title="Golf Gifts for the Dad Who Golfs."
        body="Join the WYX list for gift guides, Father&apos;s Day picks, and 10% off your first order with WYX10."
      />
    </>
  );
}
