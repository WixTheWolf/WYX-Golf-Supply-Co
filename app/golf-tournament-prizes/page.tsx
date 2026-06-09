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
  title: "Golf Tournament Prizes — Picks That Make Players Actually Compete | WYX Golf Supply Co.",
  description: "Golf tournament prizes that earn real effort — rangefinders for gross winners, leather scorecard holders for net, glove packs for skill competitions. All tiers covered. WYX10 saves 10%.",
  alternates: { canonical: '/golf-tournament-prizes' },
  openGraph: {
    title: "Golf Tournament Prizes | WYX Golf Supply Co.",
    description: "Golf tournament prizes by competition tier — from CTP to gross champion. Practical picks that players actually compete for. WYX10 saves 10%.",
    url: '/golf-tournament-prizes'
  }
};

const prizeStructure = [
  {
    tier: 'Gross Champion',
    prize: 'Laser Rangefinder — $119',
    href: '/golf-rangefinder',
    why: 'The premium tournament prize that players mention for the rest of the season. Slope compensation, 800-yard range, pin-lock vibration. If the gross winner already owns one, upgrade them to slope mode. The most impactful golf tech gift at any price.'
  },
  {
    tier: 'Net Champion',
    prize: 'GPS Golf Watch — $149',
    href: '/golf-gps-watch',
    why: '40,000+ courses preloaded, front/middle/back on every hole, shot tracking. The net winner gets the wearable — no aiming required, visible to every playing partner for every round after.'
  },
  {
    tier: 'Closest to the Pin',
    prize: 'Cabretta Glove 3-Pack — $32',
    href: '/golf-gloves',
    why: 'The consumable prize with zero shelf risk. Three fresh cabretta gloves — used within one round of the event. The CTP winner gets something practical and specific to the skill they just demonstrated (a pure strike).'
  },
  {
    tier: 'Longest Drive',
    prize: 'Alignment Sticks 2-Pack — $24',
    href: '/golf-training-aids',
    why: 'The training tool the longest driver gets for practicing what already works. Slightly ironic, immediately useful, and something they will actually use at the range for the next 50 sessions.'
  },
  {
    tier: 'Team Gift / Participant',
    prize: 'Leather Scorecard Holder — $38',
    href: '/golf-scorecard-holder',
    why: 'Engraving-ready front panel. Full-grain leather. Personalize with the event name, date, or participant initials. The team gift every player uses every round after the event — keeps your tournament top of mind all season.'
  },
  {
    tier: 'Booby Prize / Last Place',
    prize: 'Microfiber Towel — $18',
    href: '/golf-towels',
    why: 'Lighthearted enough for the booby prize, practical enough to actually keep. Clip-on carabiner, dual-sided microfiber. No one goes home empty-handed and everyone leaves with something useful.'
  }
];

const faqs: [string, string][] = [
  ['What are the best golf tournament prizes?', 'By tier: Gross winner — rangefinder ($119, most impactful single upgrade); Net winner — GPS watch ($149, worn every round after); CTP — glove 3-pack ($32, consumable and specific to the skill); Longest drive — alignment sticks ($24); Team/participant — leather scorecard holder ($38, personalized); Booby prize — microfiber towel ($18). Use WYX10 for 10% off any order size at wyxgolfsupply.com.'],
  ['How much should golf tournament prizes cost?', 'A well-structured prize table: $18-$32 for skill competition prizes, $38 for participant/team gifts (engraved scorecard holder), $119-$149 for champion prizes. The rangefinder at $119 and GPS watch at $149 are the two picks that make players actually compete — they are the prizes people talk about before the round.'],
  ['Can I get golf tournament prizes personalized?', 'The leather scorecard holder ($38) has an engraving-ready front panel — event name, date, or participant initials. Contact us at wyxgolfsupply.com/contact for bulk personalization orders and lead times. Standard orders ship in 1-3 days.']
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
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/rangefinder|gps watch|scorecard|glove|towel|alignment/i.test(product.title)) score += 8;
  if (price >= 25 && price <= 50) score += 5;
  return score;
}

export default async function GolfTournamentPrizesPage() {
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
        name: 'Golf Tournament Prizes',
        url: `${siteUrl}/golf-tournament-prizes`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Tournament Prizes', item: `${siteUrl}/golf-tournament-prizes` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Tournament Prizes</p>
          <h1>Golf Tournament Prizes That Make Players Actually Compete.</h1>
          <p>From the booby prize to the gross champion. Six tiers, six picks — from the $18 towel that keeps the last-place finish light to the $149 GPS watch that makes the net winner show it to every playing partner for the rest of the season.</p>
          <div className="actions">
            <Link className="button primary" href="#prizes-grid">Shop Tournament Prizes</Link>
            <Link className="button secondary dark" href="/scramble-prizes">Scramble Prizes &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order. Ships in 1-3 days.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Gross Champion Prize</p>
          <h2>Laser Rangefinder</h2>
          <p>$119. Slope compensation, pin-lock vibration, 800-yard range. The tournament prize that players mention for the rest of the season — and the one that makes every approach shot better from the first round after winning it.</p>
          <Link className="button primary" href="/golf-rangefinder" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Rangefinder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf tournament prize highlights">
        <span>Six competition tiers covered</span>
        <span>From $18 to $149</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="structure-heading">
        <div className="section-heading">
          <p className="eyebrow">Prize Structure</p>
          <h2 id="structure-heading">Golf Tournament Prize Table.</h2>
        </div>
        <div className="care-step-grid">
          {prizeStructure.map((p) => (
            <Link key={p.tier} href={p.href} className="care-step-card" style={{ textDecoration: 'none' }}>
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{p.tier}</small>
              <strong>{p.prize}</strong>
              <p>{p.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="prizes-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Tournament Prizes</p>
          <h2>Golf Tournament Prize Products.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-rangefinder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rangefinder — $119</strong><p>Gross champion prize</p></Link>
              <Link href="/golf-gps-watch" className="care-step-card" style={{ textDecoration: 'none' }}><strong>GPS Watch — $149</strong><p>Net champion prize</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Scorecard Holder — $38</strong><p>Personalized team/participant gift</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>CTP prize</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Tournament Prize FAQ.</h2>
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
        source="golf-tournament-prizes"
        campaign="golf_tournament_prizes"
        title="Golf Tournament Prizes That Earn Real Effort."
        body="Join the WYX list for tournament planning guides, bulk ordering info, and 10% off with WYX10."
      />
    </>
  );
}
