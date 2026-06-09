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
  title: "Scramble Prize Ideas — Golf Tournament & Scramble Prizes That Golfers Actually Want | WYX Golf Supply Co.",
  description: "Scramble prize ideas that work — closest-to-the-pin awards, longest drive prizes, team prizes, and flight payouts. Practical golf accessories from $16 to $119. WYX10 saves 10%.",
  alternates: { canonical: '/scramble-prize-ideas' },
  openGraph: {
    title: "Scramble Prize Ideas | WYX Golf Supply Co.",
    description: "Golf scramble prizes that golfers actually keep — practical accessories for closest-to-pin, long drive, and team prizes. WYX10 saves 10%.",
    url: '/scramble-prize-ideas'
  }
};

const prizes = [
  {
    label: 'Closest to the Pin — Hat Clip Ball Marker Set',
    price: '$16',
    href: '/golf-ball-markers',
    tier: 'Budget Prize ($16–$20)',
    why: 'The universally useful closest-to-the-pin prize. Three magnetic markers + magnetic hat clip. One-hand retrieval on any green. Every golfer uses markers on every round. The $16 prize that gets used far more than the trophy equivalent.'
  },
  {
    label: 'Longest Drive — Alignment Sticks 2-Pack',
    price: '$24',
    href: '/golf-training-aids',
    tier: 'Mid-Tier Prize ($21–$30)',
    why: 'The prize for the biggest hitter that improves their game. Two alignment sticks — the training tool every tour pro uses and almost no amateur owns. Rewarding distance with a tool that converts that distance to accuracy. A scramble prize that earns practice-session use for the rest of the season.'
  },
  {
    label: 'Flight Winner — Cabretta Glove 3-Pack',
    price: '$32',
    href: '/golf-gloves',
    tier: 'Team Prize ($31–$40)',
    why: 'Three cabretta leather gloves — the consumable prize every golfer welcomes. No display shelf, no duplicate risk. Three rounds of fresh grip confidence. The practical team prize for scramble flights that gets used rather than stored.'
  },
  {
    label: 'Overall Winner — Putting Mat',
    price: '$54',
    href: '/golf-putting-mat',
    tier: 'First Place ($50–$75)',
    why: 'The putting mat prize that creates a home putting studio. 9-foot velvet surface, dual alignment channels, auto-return mechanism. 10 minutes before dinner every night. A prize that produces visible handicap improvement within two weeks — the scramble trophy that actually improves the winner.'
  },
  {
    label: 'Gross Champion — Leather Scorecard Holder',
    price: '$79',
    href: '/golf-gifts-for-men',
    tier: 'Championship Prize ($75–$100)',
    why: 'Full-grain leather scorecard holder with magnetic closure and engraving panel. The gross champion prize that matches the prestige of the achievement — substantial without being gimmicky. Engraving option available for tournament personalization.'
  },
  {
    label: 'Hole-in-One — Night Golf LED Ball Set',
    price: '$42',
    href: '/golf-balls',
    tier: 'Skill Prize ($40–$50)',
    why: '12 LED-core balls that glow in flight and on the green. The hole-in-one prize that is an experience — a twilight round with the LED set rather than a standard award. Memorable, specific, and impossible to return.'
  }
];

const faqs: [string, string][] = [
  ['What are good scramble prize ideas?', 'Six tiers: closest to pin ($16 ball markers), longest drive ($24 alignment sticks), per-flight prizes ($32 glove 3-packs), first place ($54 putting mat), gross champion ($79 leather scorecard holder), hole-in-one ($42 LED ball set). All available at wyxgolfsupply.com with WYX10 for 10% off.'],
  ['What golf tournament prize does every golfer want?', 'Practical accessories that earn bag space — glove 3-packs ($32), alignment sticks ($24), and ball markers ($16) are universally used by every category of golfer. Trophies go on a shelf; these go in a bag and get used every round for the rest of the season.'],
  ['How do I buy scramble prizes for a whole tournament?', 'Buy tiered — heaviest investment at the top prizes, lightest at the participation level. A group buy: $16 ball markers for all flight winners, $32 glove packs for closest-to-pin/longest drive, $54 putting mat for gross champion. WYX10 saves 10% on every order, volume on a single checkout adds up.']
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

function prizeScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  let score = productQualityScore(product);
  if (/marker|glove|alignment|putting mat|leather|led/i.test(product.title)) score += 8;
  return score;
}

export default async function ScramblePrizeIdeasPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => prizeScore(b) - prizeScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Scramble Prize Ideas',
        url: `${siteUrl}/scramble-prize-ideas`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Tournament Prizes', item: `${siteUrl}/golf-tournament-prizes` },
            { '@type': 'ListItem', position: 3, name: 'Scramble Prize Ideas', item: `${siteUrl}/scramble-prize-ideas` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Scramble & Tournament Prizes</p>
          <h1>Scramble Prize Ideas That Golfers Actually Keep.</h1>
          <p>Six prize tiers from $16 to $79 — closest-to-the-pin markers, longest-drive alignment sticks, flight glove packs, and a gross champion putting mat. Practical accessories that earn bag spots instead of shelf space. WYX10 saves 10% on every order.</p>
          <div className="actions">
            <Link className="button primary" href="#prizes-grid">Shop Scramble Prizes</Link>
            <Link className="button secondary dark" href="/golf-tournament-prizes">Full Prize Guide &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Budget Prize</p>
          <h2>Hat Clip Ball Marker Set</h2>
          <p>$16. Three magnetic markers + hat clip. Used every green of every round. The closest-to-the-pin prize that gets used more often than any trophy equivalent — and costs less than the box of balls most organizers would reach for.</p>
          <Link className="button primary" href="/golf-ball-markers" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Marker Set &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Scramble prize highlights">
        <span>$16 to $79 prize tiers</span>
        <span>Six skill categories covered</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="prizes-heading">
        <div className="section-heading">
          <p className="eyebrow">Six Prize Tiers</p>
          <h2 id="prizes-heading">Scramble Prize Ideas. Every Category Covered.</h2>
        </div>
        <div className="care-step-grid">
          {prizes.map((prize) => (
            <Link key={prize.label} href={prize.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{prize.tier}</small>
              <strong>{prize.label} — {prize.price}</strong>
              <p>{prize.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="prizes-grid" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Shop Scramble Prizes</p>
            <h2>Golf Scramble Prizes.</h2>
          </div>
          <Link className="text-link" href="/golf-tournament-prizes">Full Tournament Prize Guide &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-ball-markers" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Ball Markers — $16</strong><p>Closest to pin prize</p></Link>
              <Link href="/golf-training-aids" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Alignment Sticks — $24</strong><p>Longest drive prize</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>Flight winner prize</p></Link>
              <Link href="/golf-putting-mat" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Putting Mat — $54</strong><p>First place prize</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Scramble Prize FAQ.</h2>
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
        source="scramble-prize-ideas"
        campaign="scramble_prizes"
        title="Golf Scramble Prizes That Golfers Actually Keep."
        body="Join the WYX list for tournament prize guides, new products, and 10% off every order with WYX10."
      />
    </>
  );
}
