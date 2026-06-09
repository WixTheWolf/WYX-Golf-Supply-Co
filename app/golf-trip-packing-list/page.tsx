import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { siteUrl } from '@/lib/feed';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Golf Trip Packing List — Everything to Pack for a Golf Trip | WYX Golf Supply Co.",
  description: "Complete golf trip packing list — bag essentials, sun protection, rain gear, travel day needs, and the accessories most golfers forget until they arrive. WYX10 saves 10%.",
  alternates: { canonical: '/golf-trip-packing-list' },
  openGraph: {
    title: "Golf Trip Packing List | WYX Golf Supply Co.",
    description: "The complete golf trip packing list — what to bring, what to skip, and the accessories most golfers forget. WYX10 saves 10% at WYX Golf Supply Co.",
    url: '/golf-trip-packing-list'
  }
};

const sections = [
  {
    title: 'The Non-Negotiables',
    items: [
      { label: 'Cabretta Glove 3-Pack — $32', href: '/golf-gloves', note: 'One fresh glove per round. Bring three minimum for a 4-day trip.' },
      { label: 'Clip-On Microfiber Towel — $18', href: '/golf-towels', note: 'Used every hole. The most overlooked bag essential on any trip.' },
      { label: 'Hat Clip Ball Markers — $16', href: '/golf-ball-markers', note: 'Easy to forget at home. Keep a dedicated set in the travel bag.' },
      { label: 'Golf Ball Retriever — $24', href: '/golf-ball-retriever', note: 'Unfamiliar courses mean unfamiliar water hazards. Non-negotiable.' }
    ]
  },
  {
    title: 'Sun Protection',
    items: [
      { label: 'Arm Sleeves UPF 50+ — $22', href: '/golf-arm-sleeves', note: '4 days in the Florida or AZ sun without arm sleeves is a dermatologist visit.' },
      { label: 'Polarized Sunglasses — $42', href: '/golf-sunglasses', note: 'Eliminates glare on unfamiliar greens. Sport wrap stays secured in carts.' },
      { label: 'Performance Golf Hat — $28', href: '/golf-hats', note: 'UPF 30+ structured cap. Pack a second one for long days.' }
    ]
  },
  {
    title: 'Weather Insurance',
    items: [
      { label: 'Rain Glove Pair — $34', href: '/golf-gloves', note: 'Every trip has one morning weather window. These make it playable.' },
      { label: 'Waterproof Towel — $22', href: '/golf-towels', note: 'Keeps club faces dry in persistent rain. Standard microfibers saturate fast.' }
    ]
  },
  {
    title: 'Upgrade Your Round',
    items: [
      { label: 'GPS Laser Rangefinder — $119', href: '/golf-tech-gifts', note: 'Unfamiliar courses. Every approach. No distance guessing.' },
      { label: 'Alignment Sticks 2-Pack — $24', href: '/golf-training-aids', note: 'Use during pre-round warm-up on unfamiliar range to confirm aim.' }
    ]
  }
];

const faqs: [string, string][] = [
  ['What do I need for a golf trip?', 'Four categories: non-negotiables (gloves, towel, ball markers, ball retriever), sun protection (arm sleeves, sunglasses, hat), weather insurance (rain gloves, waterproof towel), and round upgrades (GPS rangefinder, alignment sticks). Full list at wyxgolfsupply.com/golf-trip-packing-list with WYX10 for 10% off.'],
  ['What golf accessories do most people forget on a golf trip?', 'Ball retriever ($24) — left behind because it feels unnecessary until hole 4. Alignment sticks ($24) — forgotten because they live with practice gear, not bag gear. Rain gloves ($34) — packed only when rain is forecasted, not as insurance. All three are worth packing regardless of forecast.'],
  ['How many golf gloves should I bring on a 4-day golf trip?', 'Three minimum — one fresh glove per 18 holes. A 3-pack ($32) covers a full 4-day trip with one spare. If you are playing 36-hole days, pack two 3-packs. Worn gloves on a trip create grip anxiety that affects every swing; fresh cabretta leather is worth the packing space.']
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

export default function GolfTripPackingListPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Golf Trip Packing List',
        url: `${siteUrl}/golf-trip-packing-list`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Golf Trip Gear', item: `${siteUrl}/golf-trip-gear` },
            { '@type': 'ListItem', position: 3, name: 'Golf Trip Packing List', item: `${siteUrl}/golf-trip-packing-list` }
          ]
        }
      }) }} />

      <section className="deal-hero">
        <div>
          <p className="eyebrow">Golf Trip Preparation</p>
          <h1>Golf Trip Packing List. Everything You Need, Nothing You Don&apos;t.</h1>
          <p>Four categories — non-negotiables, sun protection, weather insurance, and round upgrades. The accessories most golfers forget until they land and there is no pro shop nearby. Build the packing list once, use it every trip. WYX10 saves 10% on everything.</p>
          <div className="actions">
            <Link className="button primary" href="#list-sections">See the Full List</Link>
            <Link className="button secondary dark" href="/golf-trip-gear">Shop Trip Gear &rarr;</Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Use <strong>WYX10</strong> at checkout for 10% off every order.
          </p>
        </div>
        <aside className="share-card">
          <p className="eyebrow">Most Forgotten Trip Item</p>
          <h2>Ball Retriever</h2>
          <p>$24. Left behind because it feels unnecessary — until hole 4 at an unfamiliar course drops into a pond you did not see from the tee. 15-foot telescoping retriever, collapses to 26 inches. Pack it every trip.</p>
          <Link className="button primary" href="/golf-ball-retriever" style={{ marginTop: '1rem', display: 'inline-block' }}>See the Retriever &rarr;</Link>
        </aside>
      </section>

      <section className="deal-strip" aria-label="Golf trip packing list highlights">
        <span>Four category packing system</span>
        <span>Gloves, sun, rain, upgrades</span>
        <span>WYX10 saves 10%</span>
        <span>Ships in 1-3 days</span>
      </section>

      <div id="list-sections">
        {sections.map((section) => (
          <section key={section.title} className="section reveal" aria-labelledby={`section-${section.title.replace(/\s/g, '-').toLowerCase()}`}>
            <div className="section-heading">
              <p className="eyebrow">Packing Category</p>
              <h2 id={`section-${section.title.replace(/\s/g, '-').toLowerCase()}`}>{section.title}</h2>
            </div>
            <div className="care-step-grid">
              {section.items.map((item) => (
                <Link key={item.label} href={item.href} className="care-step-card" style={{ textDecoration: 'none' }}>
                  <strong>{item.label}</strong>
                  <p>{item.note}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="section reveal" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading">Golf Trip Packing List FAQ.</h2>
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
        source="golf-trip-packing-list"
        campaign="golf_trip_packing"
        title="The Complete Golf Trip Packing List."
        body="Join the WYX list for trip prep guides, seasonal picks, and 10% off your first order with WYX10."
      />
    </>
  );
}
