import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { siteUrl } from '@/lib/feed';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'The Bag Test — How WYX Decides What To Sell | WYX Golf Supply Co.',
  description: 'A product only belongs on WYX if it is useful enough to earn a spot in a real weekend golfer’s bag. Here is how The Bag Test works, and what it means for your order.',
  alternates: { canonical: '/the-bag-test' },
  openGraph: {
    title: 'The Bag Test | WYX Golf Supply Co.',
    description: 'How WYX decides what makes the catalog — and what it means for the gear you buy.',
    url: '/the-bag-test'
  }
};

const standard = [
  {
    title: 'Would It Stay In The Bag?',
    body: 'After one round, would this still be in the bag — or back in a drawer? If we are not confident it earns a permanent spot, it does not get listed.'
  },
  {
    title: 'Does It Solve A Real Problem?',
    body: "No novelty gear, no branded tchotchkes, no ‘as seen on TV’ gimmicks. Every product has to fix something a weekend golfer actually runs into."
  },
  {
    title: 'Is The Listing Honest?',
    body: 'Real photos of the actual product, accurate descriptions, and claims we can stand behind. No inflated savings, no fake urgency, no copy that oversells what the product does.'
  },
  {
    title: 'Is It In Stock And Ready To Ship?',
    body: "If a product is not confirmed in stock and ready to ship through Shopify checkout, it stays off the site — or it is clearly marked as a waitlist item, not for sale."
  }
];

const whatThatMeans = [
  {
    title: 'A Smaller, Sharper Catalog',
    body: 'WYX is not trying to look bigger by listing more products. A focused catalog of things that actually earn a bag spot is more useful than a wall of random gear.'
  },
  {
    title: 'No Fake Reviews Or Scarcity',
    body: 'We do not invent testimonials, star ratings, or countdown timers. If something looks low on stock, it is because it actually is.'
  },
  {
    title: 'Claims We Can Back Up',
    body: 'You will not see promises that a product lowers your score, fixes your swing, or extends a part’s life by a specific number of seasons. Just a clear description of what it does.'
  },
  {
    title: 'Responsive Support',
    body: 'If an order arrives damaged or incorrect, contact WYX promptly with the order number and clear photos. For other return questions, eligibility can vary by item and is confirmed by support.'
  }
];

const faq = [
  {
    q: 'What is The Bag Test?',
    a: 'The Bag Test is the standard WYX uses to decide what makes the catalog: would a weekend golfer keep this item in their bag after the first round? If the answer is no, the product is not listed.'
  },
  {
    q: 'Why does WYX have a smaller catalog than other golf stores?',
    a: 'Because most "golf gift" catalogs are padded with items nobody actually uses. WYX would rather list fewer products that pass The Bag Test than pad the catalog with things that look good in a grid but end up in a drawer.'
  },
  {
    q: 'What happens if I am not happy with an order?',
    a: 'Contact WYX support with your order number. Return eligibility can vary by item, especially for personalized or final-sale products, and support will confirm the correct next step.'
  }
];

export default function TheBagTest() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'The Bag Test', item: `${siteUrl}/the-bag-test` }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a }
      }))
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="collection-hero">
        <div>
          <p className="eyebrow">How We Decide</p>
          <h1>The Bag Test.</h1>
          <p>A product only belongs on WYX if it is useful enough to earn a spot in a real weekend golfer&apos;s bag. That single rule decides everything we list — and everything we don&apos;t.</p>
          <div className="actions">
            <Link className="button primary" href="/weekend-golfer-bag-upgrade-kit">Shop The Bag Upgrade Kit</Link>
            <Link className="button secondary dark" href="/golf-gifts">Shop Golf Gifts</Link>
          </div>
        </div>
        <div className="collection-proof">
          <span>One standard, every product</span>
          <span>No fake reviews</span>
          <span>Straightforward customer support</span>
          <span>WYX10 for eligible first orders</span>
        </div>
      </section>

      <section className="section reveal" aria-labelledby="standard-heading">
        <div className="section-heading">
          <p className="eyebrow">The Standard</p>
          <h2 id="standard-heading">Four Questions, Every Product.</h2>
        </div>
        <div className="care-step-grid">
          {standard.map((item) => (
            <div className="care-step" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal" aria-labelledby="what-it-means-heading">
        <div className="section-heading">
          <p className="eyebrow">What That Means For You</p>
          <h2 id="what-it-means-heading">Practical, Not Padded.</h2>
        </div>
        <div className="care-step-grid">
          {whatThatMeans.map((item) => (
            <div className="care-step" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dark-section reveal" aria-labelledby="bag-test-promise-heading">
        <div>
          <p className="eyebrow">The Bag Test Promise</p>
          <h2 id="bag-test-promise-heading">If It&apos;s Wrong, We&apos;ll Make It Right.</h2>
          <div className="actions">
            <Link className="button primary" href="/weekend-golfer-bag-upgrade-kit">Shop The Bag Upgrade Kit</Link>
          </div>
        </div>
        <p>We build kits and gift picks around gear golfers actually use. If an order arrives damaged or incorrect, contact us promptly with your order number and clear photos. For other return questions, support will confirm eligibility and the correct next step.</p>
      </section>

      <section className="section reveal" aria-labelledby="bag-test-faq-heading">
        <div className="section-heading">
          <p className="eyebrow">Quick Questions</p>
          <h2 id="bag-test-faq-heading">The Bag Test FAQ.</h2>
        </div>
        <div className="care-step-grid">
          {faq.map((item) => (
            <div className="care-step" key={item.q}>
              <strong>{item.q}</strong>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <EmailCapture
        source="the-bag-test"
        campaign="bag_test_list"
        title="Get The Next Drop Before Your Foursome Does."
        body="Join the WYX list for new golf gifts, trip gear, and launch discounts."
      />
    </>
  );
}
