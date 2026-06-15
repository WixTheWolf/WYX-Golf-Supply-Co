import type { Metadata } from 'next';
import Link from 'next/link';
import { BulkOrderInquiry } from '@/components/BulkOrderInquiry';
import { EmailCapture } from '@/components/EmailCapture';
import { ProductCard } from '@/components/ProductCard';
import { availableProducts } from '@/lib/catalog';
import { productPrice, siteUrl } from '@/lib/feed';
import { productQualityScore } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Golf Corporate Gifts — Client Gifts, Tournament Prizes & Employee Recognition | WYX Golf Supply Co.",
  description: "Golf corporate gifts that earn real respect — leather scorecard holders, glove packs, rangefinders, and tournament prizes. Quality picks from $18 to $149. WYX10 saves 10%.",
  alternates: { canonical: '/golf-corporate-gifts' },
  openGraph: {
    title: "Golf Corporate Gifts | WYX Golf Supply Co.",
    description: "Golf corporate gifts for clients, employees, and tournament prizes that show you know the game. Scorecard holders, glove packs, rangefinders. WYX10 saves 10%.",
    url: '/golf-corporate-gifts'
  }
};

const giftTiers = [
  {
    tier: 'Token Gift / Promo Tier ($15-$25)',
    picks: [
      { label: 'Microfiber Clip-On Towel — $18', href: '/golf-towels', why: 'Used every hole. Carabiner clip, dual-sided microfiber. The functional branded item that goes in the bag, not the trash can.' },
      { label: 'Alignment Sticks 2-Pack — $24', href: '/golf-training-aids', why: 'The training tool every instructor uses. A gift that visibly improves the recipient — which is what a memorable corporate gift does.' }
    ]
  },
  {
    tier: 'Client Gift Tier ($30-$50)',
    picks: [
      { label: 'Cabretta Glove 3-Pack — $32', href: '/golf-gloves', why: 'A consumable gift they run through in one season and remember who gave it. The golfer who receives a glove 3-pack knows the gift-giver understands golf.' },
      { label: 'Leather Scorecard Holder — $38', href: '/golf-scorecard-holder', why: 'Full-grain leather, engraving-ready front panel. Used every round, visible to every playing partner. The corporate golf gift that starts conversations.' }
    ]
  },
  {
    tier: 'Premium Client / Tournament Prize ($100-$150)',
    picks: [
      { label: 'Laser Rangefinder — $119', href: '/golf-rangefinder', why: 'The most impactful golf tech upgrade. Slope compensation, pin-lock vibration. The premium gift that changes how they play — and the one they mention to their group.' },
      { label: 'GPS Golf Watch — $149', href: '/golf-gps-watch', why: '40,000+ courses, front/middle/back, shot tracking. The wearable that is visible every round to every playing partner. The executive golf gift.' }
    ]
  }
];

const tournamentPrizes = [
  { place: 'Gross Winner', prize: 'Laser Rangefinder ($119) or GPS Watch ($149)', note: 'The premium prize players compete for. Ask gross winners what they shot and they will tell you what the rangefinder said.' },
  { place: 'Net Winner', prize: 'Leather Scorecard Holder ($38)', note: 'Elegant and specific to the game. The net winner has something to show every round from that day forward.' },
  { place: 'Closest to the Pin', prize: 'Glove 3-Pack ($32)', note: 'Practical and memorable. The CTP prize that gets used at the very next round — not put on a shelf.' },
  { place: 'Longest Drive', prize: 'Alignment Sticks ($24)', note: 'The longest driver gets the training tool that might explain why they bomb it. Useful, light, and funny if you frame it right.' },
  { place: 'Last Place Prize', prize: 'Microfiber Towel ($18)', note: 'Lighthearted enough for the booby prize but useful enough to actually keep. Everyone leaves with something.' },
  { place: 'Team Gift', prize: 'Scorecard Holder per person ($38 × 4)', note: 'Personalize with initials or event date. The team gift they pull out at every round after.' }
];

const faqs: [string, string][] = [
  ['What are the best golf corporate gifts for clients?', 'By budget: under $25 — microfiber towel ($18) or alignment sticks ($24); under $40 — glove 3-pack ($32); under $50 — leather scorecard holder ($38, engraving-ready); under $150 — rangefinder ($119) or GPS watch ($149). All are accessories clients use every round, which means your brand is associated with a positive experience rather than a random item they do not need.'],
  ['Can I get corporate golf gifts personalized?', 'The leather scorecard holder ($38) has an engraving-ready front panel for initials, a company logo outline, or an event date. Contact us at wyxgolfsupply.com/contact for bulk personalization orders and lead time confirmation. Standard orders ship in 1-3 days. Use WYX10 for 10% off any order size.'],
  ['What makes a good golf tournament prize?', 'The best tournament prizes are practical accessories golfers actually use: rangefinders for gross winners, scorecard holders for net winners, glove packs for skill competitions. Avoid trophies (no bag space), generic gift cards (no memory), and novelty items (no use). Prizes that get used at the next round keep the event top of mind all season.']
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

function corporateGiftScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const price = Number(productPrice(product).amount);
  let score = productQualityScore(product);
  if (/glove|towel|scorecard|rangefinder|gps watch|alignment/i.test(product.title)) score += 8;
  if (price >= 30 && price <= 50) score += 5;
  return score;
}

export default async function GolfCorporateGiftsPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => corporateGiftScore(b) - corporateGiftScore(a))
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Corporate Gifts',
        url: `${siteUrl}/golf-corporate-gifts`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Gifts', item: `${siteUrl}/golf-gifts` },
            { '@type': 'ListItem', position: 3, name: 'Golf Corporate Gifts', item: `${siteUrl}/golf-corporate-gifts` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Corporate Golf Gifts</p>
          <h1>Golf Corporate Gifts That Say You Understand the Game.</h1>
          <p>Not the golf section of a catalog — the accessories that land in the bag and stay there. Three budget tiers for clients, employees, and tournament prizes. Leather scorecard holders, glove packs, rangefinders. WYX10 saves 10% on every order.</p>
          <div className="actions">
            <Link className="button primary" href="#corporate-grid">Shop Corporate Picks</Link>
            <Link className="button secondary dark" href="/golf-tournament-prizes">Tournament Prizes &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off. Ships in 1-3 days. Contact us for bulk orders.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Best Client Gift Under $40</p>
          <h2>Leather Scorecard Holder</h2>
          <p>$38. Engraving-ready front panel. Full-grain leather. Used every round, visible to every playing partner. The corporate golf gift that starts conversations for the life of the bag.</p>
          <Link className="button primary" href="/golf-scorecard-holder" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Holder &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Corporate golf gift highlights">
        <span>Three budget tiers</span>
        <span>Engraving-ready scorecard holder</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <section className="section reveal" aria-labelledby="tiers-heading">
        <div className="section-heading">
          <p className="eyebrow">Gift Tiers</p>
          <h2 id="tiers-heading">Golf Corporate Gifts at Every Budget.</h2>
        </div>
        {giftTiers.map((tier) => (
          <div key={tier.tier} style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', opacity: 0.7 }}>{tier.tier}</h3>
            <div className="care-step-grid">
              {tier.picks.map((pick) => (
                <Link key={pick.label} href={pick.href} className="care-step-card" style={{ textDecoration: 'none' }}>
                  <strong>{pick.label}</strong>
                  <p>{pick.why}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="section reveal" aria-labelledby="prizes-heading">
        <div className="section-heading">
          <p className="eyebrow">Tournament Prizes</p>
          <h2 id="prizes-heading">Golf Tournament Prize Structure.</h2>
        </div>
        <div className="care-step-grid">
          {tournamentPrizes.map((p) => (
            <div key={p.place} className="care-step-card">
              <small style={{ opacity: 0.6, fontWeight: 600, display: 'block' }}>{p.place}</small>
              <strong>{p.prize}</strong>
              <p>{p.note}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '1.5rem', opacity: 0.8 }}>
          <Link href="/golf-tournament-prizes" className="text-link">See the full tournament prize guide &rarr;</Link>
        </p>
      </section>

      <section id="corporate-grid" className="section product-section">
        <div className="section-heading">
          <p className="eyebrow">Shop Corporate Picks</p>
          <h2>Golf Corporate Gifts.</h2>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <Link href="/golf-towels" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Towel — $18</strong><p>Used every hole by every golfer</p></Link>
              <Link href="/golf-gloves" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Glove 3-Pack — $32</strong><p>The consumable client gift</p></Link>
              <Link href="/golf-scorecard-holder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Leather Scorecard Holder — $38</strong><p>Engraving-ready, used every round</p></Link>
              <Link href="/golf-rangefinder" className="care-step-card" style={{ textDecoration: 'none' }}><strong>Rangefinder — $119</strong><p>The premium tournament prize</p></Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Corporate Golf Gift FAQ.</h2>
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

      <section className="section reveal">
        <BulkOrderInquiry
          source="corporate-gifts"
          title="Corporate outing or client gifts (4+)?"
          body="Share headcount, budget tier, and event date — we'll reply with bundle pricing and engraving options."
        />
      </section>

      <EmailCapture
        source="golf-corporate-gifts"
        campaign="corporate_golf_gifts"
        title="Golf Corporate Gifts That Land in the Bag."
        body="Join the WYX list for gift guides, bulk order info, and 10% off your first order with WYX10."
      />
    </>
  );
}
