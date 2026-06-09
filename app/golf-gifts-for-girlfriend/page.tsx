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
  title: "Golf Gifts for Girlfriend — Practical Picks She Will Use Every Round | WYX Golf Supply Co.",
  description: "Golf gifts for a girlfriend who golfs — gloves, leather scorecard holders, alignment sticks, GPS watch. Practical picks used every round. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-girlfriend' },
  openGraph: {
    title: "Golf Gifts for Girlfriend | WYX Golf Supply Co.",
    description: "Golf gifts for your girlfriend who golfs — practical picks at every budget, used every round. WYX10 saves 10%.",
    url: '/golf-gifts-for-girlfriend'
  }
};

const picks = [
  { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', tag: 'Under $20', why: 'Used every hole from tee 1 through 18. Carabiner clip attaches to any bag D-ring. The gift that earns a spot in the bag before the first hole ends and never leaves.' },
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', tag: 'Under $25', why: 'The training tool every instructor uses. Two sticks, 10 minutes at the range — aim and alignment confirmed, not guessed. She will use these every range session from the first time out.' },
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', tag: 'Under $35', why: 'Three fresh cabretta gloves — the consumable gift she uses every round and never restocks. Pick S for smaller hands, M/ML for average. Used within one round.' },
  { label: 'Leather Scorecard Holder', price: '$38', href: '/golf-scorecard-holder', tag: 'Under $40', why: 'Full-grain leather, pencil loop, ball marker pocket, engraving-ready front panel. The elegant bag upgrade she notices in another player\'s bag and never orders for herself.' },
  { label: 'Putting Alignment Mirror', price: '$32', href: '/golf-training-aids', tag: 'Practice Gift', why: 'Eye position, shoulder line, and putter path simultaneously — the same tool tour coaches use on the putting green. Folds to wallet size. The home putting upgrade that produces visible results.' },
  { label: 'GPS Golf Watch', price: '$149', href: '/golf-gps-watch', tag: 'Premium Gift', why: '40,000+ courses preloaded, front/middle/back on every hole. The wearable golf gift she wears to every round and mentions to every partner within the first three holes.' }
];

const faqs: [string, string][] = [
  ['What is the best golf gift for a girlfriend?', 'By budget: under $20 — microfiber towel ($18); under $25 — alignment sticks ($24); under $35 — glove 3-pack ($32); under $40 — leather scorecard holder ($38); under $150 — GPS watch ($149). Use WYX10 for 10% off at wyxgolfsupply.com.'],
  ['What golf gift for a girlfriend has no size risk?', 'Towels ($18), alignment sticks ($24), leather scorecard holders ($38), putting mirrors ($32), and GPS watches ($149) are all completely size-free. Gloves require a size — pick S for smaller hands, M or ML for average.'],
  ['Best golf anniversary gift for a girlfriend?', 'The leather scorecard holder ($38) is the most elegant practical golf anniversary gift — engraving-ready front panel for her initials. Stack with a glove 3-pack ($32) for the complete under-$75 golf gift set.']
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

function gfGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/glove|towel|scorecard|alignment|gps watch|mirror/i.test(product.title)) score += 8;
  if (price <= 40) score += 5;
  return score;
}

export default async function GolfGiftsForGirlfriendPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => gfGiftScore(b) - gfGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for Girlfriend',
        url: `${siteUrl}/golf-gifts-for-girlfriend`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for Girlfriend', item: `${siteUrl}/golf-gifts-for-girlfriend` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">For the Girlfriend Who Golfs</p>
          <h1>Golf Gifts for Girlfriend. Practical Picks She Uses Every Round.</h1>
          <p>Six picks at six budgets — from $18 to $149. These are the accessories a golfer uses every single round and the upgrades she always delays buying for herself. No size guesswork on five of six.</p>
          <div className="actions">
            <Link className="button primary" href="#gf-grid">Shop Gift Picks</Link>
            <Link className="button secondary dark" href="/golf-gifts-for-women">Golf Gifts for Women &rarr;</Link>
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

      <section className="deal-strip" aria-label="Golf girlfriend gift highlights">
        <span>Six budget tiers</span>
        <span>No size guesswork on 5 of 6</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Picks</p>
          <h2 id="picks-heading">Golf Gifts for Girlfriend at Every Budget.</h2>
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

      <section id="gf-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts for Girlfriend.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Used every hole</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Scorecard Holder — $38</strong><p>The bag upgrade that lasts</p></Link>
              <Link href="/golf-gps-watch" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Watch — $149</strong><p>Worn to every round</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gift for Girlfriend FAQ.</h2>
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
        source="golf-gifts-for-girlfriend"
        campaign="girlfriend_golf_gifts"
        title="Golf Gifts for the Girlfriend Who Golfs."
        body="Join the WYX list for gift guides, seasonal picks, and 10% off your first order with WYX10."
      />
    </>
  );
}
