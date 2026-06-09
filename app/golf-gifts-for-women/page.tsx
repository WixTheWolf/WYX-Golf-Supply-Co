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
  title: "Golf Gifts for Women — Practical Picks She Uses Every Round | WYX Golf Supply Co.",
  description: "Golf gifts for women who golf — gloves, leather accessories, alignment sticks, GPS watches. By budget, no size guesswork on most picks. WYX10 saves 10%.",
  alternates: { canonical: '/golf-gifts-for-women' },
  openGraph: {
    title: "Golf Gifts for Women | WYX Golf Supply Co.",
    description: "Golf gifts for women golfers at every budget — practical accessories used every round. Gloves, leather holders, training aids, GPS watch. WYX10 saves 10%.",
    url: '/golf-gifts-for-women'
  }
};

const picks = [
  { label: 'Clip-On Microfiber Towel', price: '$18', href: '/golf-towels', tag: 'Under $20', why: 'Used every hole of every round. The bag essential that most women golfers have owned for too long. Dual-sided microfiber, carabiner clip — fits any bag D-ring. The one that earns a spot in round 1.' },
  { label: 'Alignment Sticks 2-Pack', price: '$24', href: '/golf-training-aids', tag: 'Under $25', why: 'Two sticks, 10 minutes at the range. Ball position, aim, and alignment confirmed — not guessed. Every LPGA pro uses these. The training gift for any golfer who wants to improve without a lesson.' },
  { label: 'Cabretta Glove 3-Pack', price: '$32', href: '/golf-gloves', tag: 'Under $35', why: 'Three fresh cabretta gloves — the consumable gift she uses every round. Available in S, M, and ML. Pick S for smaller hands, M for average. Used within one round of receiving them.' },
  { label: 'Leather Scorecard Holder', price: '$38', href: '/golf-scorecard-holder', tag: 'Under $40', why: 'Full-grain leather, pencil loop, ball marker pocket, engraving-ready front panel. The elegant bag upgrade most women golfers notice in another player\'s bag and never order. Lasts a decade.' },
  { label: 'Putting Alignment Mirror', price: '$32', href: '/golf-training-aids', tag: 'Practice Gift', why: 'Eye position, shoulder line, and putter path simultaneously. Folds to wallet size. The home putting upgrade that produces visible improvement within a week — the same tool tour coaches use on every putting green.' },
  { label: 'GPS Golf Watch', price: '$149', href: '/golf-gps-watch', tag: 'Premium Gift', why: '40,000+ courses preloaded, front/middle/back on every hole, shot tracking. The wearable golf gift — elegant enough to wear beyond the course, precise enough to replace a yardage book.' }
];

const faqs: [string, string][] = [
  ['What are the best golf gifts for women?', 'By budget: under $20 — microfiber towel ($18); under $25 — alignment sticks ($24); under $35 — glove 3-pack ($32); under $40 — leather scorecard holder ($38); under $150 — GPS watch ($149). All available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf gift for a woman has no size risk?', 'Towels ($18), alignment sticks ($24), leather scorecard holders ($38), putting mirrors ($32), and GPS watches ($149) are completely size-free. Only the glove 3-pack requires a size — S for smaller hands, M for average women\'s.'],
  ['Golf gifts for women under $50?', 'Three great picks: leather scorecard holder ($38 — engraving-ready, used every round for a decade); glove 3-pack ($32 — consumable, used within one round); alignment sticks ($24 — practice tool for every range session). Stack two for a complete under-$60 golf gift.']
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

function womenGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/glove|towel|scorecard|alignment|gps watch|mirror/i.test(product.title)) score += 8;
  if (price <= 40) score += 5;
  return score;
}

export default async function GolfGiftsForWomenPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => womenGiftScore(b) - womenGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Gifts for Women',
        url: `${siteUrl}/golf-gifts-for-women`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Gifts for Women', item: `${siteUrl}/golf-gifts-for-women` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Gifts for Women Golfers</p>
          <h1>Golf Gifts for Women. Practical Picks She Actually Uses.</h1>
          <p>Not a novelty. Not a golf-themed item for the kitchen. These are the accessories a woman golfer uses every single round — from the $18 towel that goes in the bag immediately to the $149 GPS watch she wears to every round after.</p>
          <div className="actions">
            <Link className="button primary" href="#women-grid">Shop Golf Gifts for Women</Link>
            <Link className="button secondary dark" href="/golf-gifts-for-mom">Golf Gifts for Mom &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Gift Under $40</p>
          <h2>Leather Scorecard Holder</h2>
          <p>$38. Engraving-ready. Full-grain leather, pencil loop, ball marker pocket. The elegant bag upgrade she notices in another player&apos;s bag and never orders. Used every round for a decade.</p>
          <Link className="button primary" href="/golf-scorecard-holder" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Holder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf gifts for women highlights">
        <span>All under $40 except GPS watch</span>
        <span>No size guesswork on 5 of 6</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="picks-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Picks</p>
          <h2 id="picks-heading">Golf Gifts for Women at Every Budget.</h2>
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

      <section id="women-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Now</p>
          <h2>Golf Gifts for Women.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Microfiber Towel — $18</strong><p>Used every hole</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Used every round</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Scorecard Holder — $38</strong><p>Engraving-ready, lasts a decade</p></Link>
              <Link href="/golf-gps-watch" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Watch — $149</strong><p>Worn to every round</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Gifts for Women FAQ.</h2>
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
          <Link href="/golf-gifts-for-mom" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Mom</strong><p>Six picks under $50 — practical and thoughtful</p></Link>
          <Link href="/golf-gifts-for-wife" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Wife</strong><p>Engraving-ready leather and GPS watch picks</p></Link>
          <Link href="/golf-gifts-for-girlfriend" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Gifts for Girlfriend</strong><p>Budget tiers from $18 to $149</p></Link>
          <Link href="/golf-gifts-for-anniversary" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Golf Anniversary Gifts</strong><p>Elevated picks for a milestone occasion</p></Link>
        </div>
      </section>

      <EmailCapture
        source="golf-gifts-for-women"
        campaign="golf_gifts_women"
        title="Golf Gifts for Women Golfers."
        body="Join the WYX list for gift guides, seasonal picks, and 10% off your first order with WYX10."
      />
    </>
  );
}
