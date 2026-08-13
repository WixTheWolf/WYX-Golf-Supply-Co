import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Golf FAQ — Products, Shipping, Returns & WYX10 | WYX Golf Supply Co.',
  description: 'Answers to the most common questions about WYX Golf Supply Co. — products, shipping timing, returns, the WYX10 discount code, and what makes a good golf gift.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Golf FAQ | WYX Golf Supply Co.',
    description: 'Answers on products, shipping, returns, and the WYX10 discount code.',
    url: '/faq'
  }
};

const faqGroups: Array<{ heading: string; items: Array<[string, string]> }> = [
  {
    heading: 'Shopping & Products',
    items: [
      ['What golf products does WYX carry?', 'WYX keeps a focused live edit of golf apparel, headcovers, gloves, towels, grips, gifts, and useful bag accessories. The selection changes as inventory and supplier approvals change.'],
      ['What should I buy first?', 'Start with something the golfer already uses every round, such as a towel, glove, marker, headcover, or simple bag accessory. The live shop is the source of truth for current products and prices.'],
      ['Are products actually in stock and purchasable?', 'Live product options are pulled from Shopify. Sold-out variants are disabled, and Shopify confirms final availability before payment.'],
      ['What is WYX10?', 'WYX10 requests 10% off a first WYX order when eligible. Shopify confirms whether the offer applies before payment.'],
    ]
  },
  {
    heading: 'Golf Gifts',
    items: [
      ['What are the best golf gifts under $60?', 'Look for current towels, markers, gloves, headcovers, and compact bag accessories under $60. Use the live price on each product page rather than an older gift-guide price.'],
      ['What is a good last-minute golf gift?', 'Choose a product with no fit decision, then check the delivery estimate at Shopify checkout. A smaller package is not a guarantee of faster arrival.'],
      ['What golf gifts do not require sizing?', 'Headcovers, towels, markers, games, and many bag accessories usually avoid apparel sizing. Always review the live product options before purchase.'],
      ['Are golf accessories good gifts for coworkers?', 'Yes. A useful, non-sized accessory is usually easier to buy for a group than apparel or performance equipment.'],
    ]
  },
  {
    heading: 'Shipping & Returns',
    items: [
      ['When do I see shipping cost and timing?', 'Shipping options, delivery estimates, and rates are shown at checkout before any payment is entered.'],
      ['How long does WYX shipping take?', 'Timing varies by product, fulfillment partner, destination, and shipping method. Use the product page and the delivery estimate shown at checkout as the current source of truth.'],
      ['What is the return policy?', 'Return eligibility can vary by item, especially for personalized or final-sale products. Email support@wyxgolfsupply.com with your order number so WYX can confirm the correct next step.'],
    ]
  },
  {
    heading: 'Products & Gear',
    items: [
      ['What size golf glove should I buy?', 'Use the size and hand options shown on the live product page. A glove should fit close to the hand without loose material at the fingertips; contact WYX before ordering if you need exact measurements.'],
      ['What is cabretta leather?', 'Cabretta is a soft, thin leather commonly used in premium golf gloves because it preserves feel between the hand and the grip.'],
      ['What are alignment sticks used for?', 'Alignment sticks can help check target line, stance direction, and ball position during practice. Follow the drill instructions that come with the product or your coach’s guidance.'],
      ['What is a putting alignment mirror?', 'A putting mirror is a flat reflective surface placed at address that shows eye position, shoulder alignment, and putter face angle — the three most common putting setup errors. Works on any flat surface.'],
    ]
  },
  {
    heading: 'About WYX',
    items: [
      ['Who is WYX Golf Supply Co. for?', 'WYX is for golfers, trip planners, gift shoppers, and scramble groups who want a smaller, sharper edit instead of a giant generic catalog.'],
      ['Where is WYX based?', 'WYX Golf Supply Co. is a US-based curated golf shop. Customer support: support@wyxgolfsupply.com.'],
    ]
  }
];

const allFaqs = faqGroups.flatMap((group) => group.items);

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allFaqs.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer }
  }))
};

export default function FAQ() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="page-hero">
        <p className="eyebrow">Help &amp; FAQ</p>
        <h1>Before You Add To Bag.</h1>
        <p>Quick answers about products, shipping, gifting, and the WYX10 code.</p>
      </section>
      <section className="faq-page">
        {faqGroups.map((group) => (
          <div key={group.heading} className="faq-group">
            <h2>{group.heading}</h2>
            <div className="detail-list">
              {group.items.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
        <p className="faq-footer">
          Need more help? Email <a href="mailto:support@wyxgolfsupply.com">support@wyxgolfsupply.com</a> or read the{' '}
          <Link className="text-link" href="/shipping-returns">Shipping &amp; Returns policy</Link>.
          {' '}Shop <Link className="text-link" href="/golf-gifts">golf gifts</Link> or{' '}
          <Link className="text-link" href="/golf-trip-gear">golf trip gear</Link>.
        </p>
      </section>
    </>
  );
}
