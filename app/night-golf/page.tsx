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
  title: "Night Golf — LED Golf Balls, Glow Gear & How to Play | WYX Golf Supply Co.",
  description: "Night golf gear guide — LED light-up golf balls, how to set up a night round, what to bring, and where to play. The WYX Night Golf Glow Ball Set: 12 LED-core balls in 4 colors. Under $45.",
  alternates: { canonical: '/night-golf' },
  openGraph: {
    title: "Night Golf | LED Golf Balls & Glow Gear | WYX Golf Supply Co.",
    description: "Night golf — LED light-up balls that glow 8+ minutes per hit, visible 100+ yards. 12-pack in 4 colors. The gear to run your own night round. Under $45. WYX10 saves 10%.",
    url: '/night-golf'
  }
};

const whatToBring = [
  { item: 'LED Golf Balls', detail: '2-3 per person minimum. Each activates on impact and glows 8+ min. The WYX 12-pack gives 3 of each color — white, red, blue, green. Assign one color per player.' },
  { item: 'Glow Sticks for the Bag', detail: 'Clip a glow stick to your bag so you can find it in the dark. Standard 8-hour sticks work all night. Pick a color different from your ball color.' },
  { item: 'Headlamp', detail: 'For reading greens, writing the scorecard, and navigating cart paths without phone lighting that kills your night vision.' },
  { item: 'Light Jacket or Layers', detail: 'Courses cool 10-15°F after sunset even in summer. The first six holes are warm. By hole 13 you want a layer.' },
  { item: 'Insect Repellent', detail: 'Evening rounds near water features and rough get busy after dark. Apply before the round, not between holes.' },
  { item: 'Scorecard Holder', detail: 'Writing in the dark is harder than it sounds. A leather scorecard holder with a pencil loop keeps the card flat and the pencil ready.' }
];

const faqs: [string, string][] = [
  ['Where can I play night golf?', 'Search "night golf near me" or call your local course. Resort courses, charity events, and clubs near vacation areas run the most night rounds. Some courses permanently light a 9-hole loop for twilight play. Friday and Saturday evenings in summer are the most common schedule.'],
  ['Do LED golf balls play like real balls?', 'LED golf balls use a two-piece ionomer construction similar to standard practice balls. They fly and roll like a normal mid-range ball — not like a toy. They are not USGA-legal for handicap rounds, but they play authentically for recreational rounds and casual tournaments.'],
  ['How long does an LED golf ball glow?', 'Each ball activates on the first impact and glows for 8+ minutes per light cycle. After 8 minutes the glow dims, but reactivates on the next hit. Over a full round, a single ball stays visible through every shot.'],
  ['Can I use LED balls in a regular golf ball washer?', 'Yes — the LED core is sealed inside the ionomer cover. Standard ball washers, water, and normal play do not affect the LED or the seal. Replace the battery by unscrewing the ball at the equator seam.']
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

function nightGolfScore(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const title = product.title.toLowerCase();
  let score = productQualityScore(product);
  if (/night golf|glow|light.?up|led/.test(title)) score += 30;
  if (/golf ball/.test(title)) score += 10;
  if (/torch|headlamp|flask|towel/.test(title)) score += 5;
  return score;
}

export default async function NightGolfPage() {
  const allProducts = availableProducts(await getProducts());
  const products = allProducts
    .sort((a, b) => nightGolfScore(b) - nightGolfScore(a))
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Night Golf Gear',
        description: 'LED golf balls, glow accessories, and gear guides for night golf rounds.',
        url: `${siteUrl}/night-golf`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Night Golf', item: `${siteUrl}/night-golf` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">After Dark</p>
          <h1>Night Golf. Same Game. Completely Different Challenge.</h1>
          <p>Cooler temperatures. Empty courses. LED balls that glow from 100 yards. A round that plays faster, feels easier, and creates stories your regular group will retell. Night golf is the most underrated round in golf.</p>
          <div className="actions">
            <Link className="button primary" href="#night-golf-gear">Get the Gear</Link>
            <Link className="button secondary dark" href="/journal/night-golf-guide">Night Golf Guide &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> for 10% off. LED balls glow 8+ min per hit, visible 100+ yards.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Night Golf Glow Set</p>
          <h2>$42 — 12 LED Balls</h2>
          <p>4 colors (white, red, blue, green), 3 of each. Activates on impact. Glows 8+ minutes. One color per player — no ball identification confusion in the dark. Use WYX10 for $4.20 off.</p>
          <Link className="button primary" href="#night-golf-gear" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Glow Set &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Night golf highlights">
        <span>Glows on impact</span>
        <span>Visible 100+ yards</span>
        <span>4 colors, 12 balls</span>
        <span>WYX10 saves 10%</span>
      </section>

      <section id="night-golf-gear" className="section product-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Night Golf Products</p>
            <h2>LED Balls &amp; Night Round Gear.</h2>
          </div>
          <Link className="text-link" href="/golf-balls">All Golf Balls &rarr;</Link>
        </div>
        {products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : (
            <div className="care-step-grid">
              <div className="care-step-card">
                <strong>Night Golf Glow Ball Set &mdash; $42</strong>
                <p>12 LED-core balls in 4 colors. Activates on impact, glows 8+ minutes, visible 100+ yards. Use WYX10 for 10% off.</p>
              </div>
              <Link href="/golf-balls" className="care-step-card" style={{ textDecoration: 'none' }}>
                <strong>All Golf Balls &rarr;</strong>
                <p>Tour urethane mix pack, premium sleeves, and the Night Golf Glow Set all in one place.</p>
              </Link>
            </div>
          )
        }
      </section>

      <section className="section reveal" aria-labelledby="bring-heading">
        <div className="section-heading">
          <p className="eyebrow">Night Round Checklist</p>
          <h2 id="bring-heading">What to Bring for a Night Golf Round.</h2>
        </div>
        <div className="care-step-grid">
          {whatToBring.map((item) => (
            <div key={item.item} className="care-step-card">
              <strong>{item.item}</strong>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Night Golf Questions</p>
          <h2 id="faq-heading">Night Golf FAQ.</h2>
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

      <section className="section reveal" aria-labelledby="events-heading">
        <div className="section-heading">
          <p className="eyebrow">Best For</p>
          <h2 id="events-heading">When Night Golf Makes the Most Sense.</h2>
        </div>
        <div className="care-step-grid">
          <Link href="/bachelor-party-golf-gifts" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Bachelor Party Golf Round</strong>
            <p>Night golf is the bachelor party round &mdash; different colors for each person, everyone visible, pace of play is faster and the stakes feel lower. Assign one color per person and play from the reds for speed.</p>
          </Link>
          <Link href="/golf-trip-gear" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Golf Weekend Trip</strong>
            <p>Pack the night golf set for the trip. On the last night, the group plays a 9-hole twilight round after the final dinner. It closes the trip with something memorable that does not require early morning energy.</p>
          </Link>
          <Link href="/golf-gifts-for-men" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Golf Gift for the Group</strong>
            <p>A 12-pack of LED golf balls at $42 is the group gift &mdash; four players, three balls each, same course, different colors. Under $11 per person and the best group activity in golf no one has tried yet.</p>
          </Link>
          <Link href="/scramble-prizes" className="care-step-card" style={{ textDecoration: 'none' }}>
            <strong>Tournament Prize Alternative</strong>
            <p>A night golf glow set is the scramble raffle prize people actually want &mdash; unusual enough to be memorable, practical enough to use immediately. Under $45.</p>
          </Link>
        </div>
      </section>

      <EmailCapture
        source="night-golf"
        campaign="night_golf_led_balls"
        title="Golf After Dark."
        body="Join the WYX list for night golf event guides, gear picks, and 10% off your first order with WYX10."
      />
    </>
  );
}
