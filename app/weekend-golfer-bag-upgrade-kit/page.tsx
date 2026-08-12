import type { Metadata } from 'next';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { KitAddButton } from '@/components/KitAddButton';
import { ProductCard } from '@/components/ProductCard';
import { productPrice, siteUrl } from '@/lib/feed';
import { getProduct } from '@/lib/shopify/products';
import { cleanText } from '@/lib/text';

export const revalidate = 300;

export const metadata: Metadata = {
  title: "The Weekend Golfer's Bag Upgrade Kit",
  description: 'Five practical golf bag upgrades in one editable cart: towel, marker set, tee restock, glove caddie and quick-access bag caddie.',
  alternates: { canonical: '/weekend-golfer-bag-upgrade-kit' },
  openGraph: {
    title: "The Weekend Golfer's Bag Upgrade Kit | WYX Golf Supply Co.",
    description: 'Five useful bag upgrades, one easier first WYX order. Review every item before secure Shopify checkout.',
    url: '/weekend-golfer-bag-upgrade-kit'
  }
};

const KIT_HANDLES = [
  'tri-fold-microfiber-golf-towel',
  'two-sided-metal-golf-ball-marker-5-color-combo-pack',
  'bamboo-performance-golf-tees-50-pack',
  'glove-accessory-caddie-black',
  'magnet-caddie'
];

const itemNotes: Record<string, string> = {
  'tri-fold-microfiber-golf-towel': 'The everyday clean-up piece for club faces, golf balls, grips, and wet rounds.',
  'two-sided-metal-golf-ball-marker-5-color-combo-pack': 'A five-marker set that covers your bag, your foursome, or the next golf gift.',
  'bamboo-performance-golf-tees-50-pack': 'A simple 50-tee restock so the bag starts the next round ready.',
  'glove-accessory-caddie-black': 'A dedicated parking spot for gloves and the small items that normally disappear into a pocket.',
  'magnet-caddie': 'Quick-access organization for the pieces you do not want buried when it is your turn to hit.'
};

const whoItsFor = [
  { title: 'The Bag That Is Almost Dialed', body: 'For the golfer who already has the clubs and bag handled but keeps living with the same small annoyances every round.' },
  { title: 'The Easy Golf Gift', body: 'Five understandable golf accessories are easier to buy well than guessing a club, shaft, putter shape, or apparel size.' },
  { title: 'The First WYX Order', body: 'A clean way to understand the brand: useful pieces, a little personality, and no mystery product hiding inside the bundle.' }
];

const whyItWorks = [
  { title: 'Five Pieces, Five Jobs', body: 'Clean the gear, mark the ball, restock tees, organize the glove, and keep quick-access items where you can actually reach them.' },
  { title: 'One Click, Separate Items', body: 'The kit adds each product separately. You can review quantities and remove anything before payment.' },
  { title: 'No Variant Guessing', body: 'The one-click kit is built from products that do not require WYX to guess your size, handedness, or preferred fit.' }
];

const faq = [
  { q: 'Is this a real bundle or separate items?', a: 'It is a one-click group of five separate products. You can review quantities or remove an item before checkout.' },
  { q: 'What happens if one of the five items is unavailable?', a: 'WYX does not promote a partial flagship kit. If one of the five pieces is unavailable, the page moves into restock mode instead of silently substituting another product.' },
  { q: 'How does WYX10 work on the kit?', a: 'The WYX cart requests WYX10 automatically. Shopify confirms whether the first-order offer applies before payment.' },
  { q: 'How long does shipping take?', a: 'Timing can vary by product and destination. Shopify shows the available shipping options and current delivery estimate before you place the order.' }
];

export default async function BagUpgradeKitPage() {
  const products = (await Promise.all(KIT_HANDLES.map((handle) => getProduct(handle))))
    .filter((product): product is NonNullable<typeof product> => Boolean(product) && product!.availableForSale);

  const lines = products
    .map((product) => product.variants.find((variant) => variant.availableForSale))
    .filter(Boolean)
    .map((variant) => ({ merchandiseId: variant!.id, quantity: 1 }));

  const kitReady = products.length === KIT_HANDLES.length && lines.length === KIT_HANDLES.length;
  const total = products.reduce((sum, product) => sum + Number(productPrice(product).amount), 0);
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
  const formattedFirstOrder = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total * 0.9);

  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'ItemList', name: "The Weekend Golfer's Bag Upgrade Kit",
      description: 'Five practical golf bag upgrades grouped into one editable cart.', url: `${siteUrl}/weekend-golfer-bag-upgrade-kit`,
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem', position: index + 1, name: cleanText(product.title), url: `${siteUrl}/products/${product.handle}`,
        item: { '@type': 'Product', name: cleanText(product.title), url: `${siteUrl}/products/${product.handle}`, image: product.featuredImage?.url,
          offers: { '@type': 'Offer', price: productPrice(product).amount, priceCurrency: productPrice(product).currencyCode, availability: 'https://schema.org/InStock' } }
      }))
    },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: "Weekend Golfer's Bag Upgrade Kit", item: `${siteUrl}/weekend-golfer-bag-upgrade-kit` }
    ] },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="page-hero compact">
        <p className="eyebrow">THE FIRST WYX ORDER</p>
        <h1>The Weekend Golfer&apos;s Bag Upgrade Kit</h1>
        <p>Five small upgrades with five obvious jobs. No club fitting. No apparel sizing. No mystery bundle. Just the stuff that makes an everyday golf bag work a little better.</p>
        {products.length > 0 && <div className="lp-price-block" style={{ marginTop: '1rem' }}><span className="lp-price-sale">{formattedTotal}</span>{kitReady && <span className="lp-price-code">First WYX order: {formattedFirstOrder} with WYX10 when eligible</span>}</div>}
        {kitReady ? (
          <div style={{ marginTop: '1.25rem', maxWidth: '420px' }}><KitAddButton lines={lines} label="Add The Full Kit" buyNowLabel={`Buy The Kit — ${formattedTotal}`} showBuyNow /></div>
        ) : (
          <div className="actions"><Link className="button primary" href="/products">Shop What&apos;s Available</Link><a className="button secondary dark" href="#bag-upgrade-kit-waitlist">Get The Restock Note</a></div>
        )}
        <div className="intent-proof-grid" aria-label="Kit benefits">
          <span>{kitReady ? '5 of 5 picks available now' : `${products.length} of 5 picks available — restock mode`}</span>
          <span>No size or handedness guessing</span><span>Edit every item before payment</span><span>Secure Shopify checkout</span>
        </div>
      </section>

      <section className="section reveal" aria-labelledby="problem-heading">
        <div className="section-heading"><p className="eyebrow">THE IDEA</p><h2 id="problem-heading">FIX THE SMALL STUFF FIRST.</h2></div>
        <p>You do not need another giant golf purchase to make the bag better. The towel, tees, markers, glove storage, and quick-access pieces are the things you touch all round — so we built the first WYX kit around them.</p>
      </section>

      <section className="section product-section">
        <div className="section-heading split">
          <div><p className="eyebrow">WHAT&apos;S IN IT — {products.length} PIECES</p><h2>{formattedTotal}</h2><p>Every item stays visible and separate in the cart. Review quantities, discount eligibility, shipping options, and the final price before payment.</p></div>
          {kitReady && <KitAddButton lines={lines} label="Add The Full Kit" buyNowLabel={`Buy The Kit — ${formattedTotal}`} showBuyNow />}
        </div>
        {products.length > 0 ? <div className="product-grid">{products.map((product) => <div key={product.id}><ProductCard product={product} />{itemNotes[product.handle] && <p className="buy-reason" style={{ marginTop: '0.5rem' }}>{itemNotes[product.handle]}</p>}</div>)}</div> : <p>The kit is currently in restock mode. Browse the live WYX shop or join the list below and we will send the next kit update.</p>}
        {kitReady && <div className="kit-add-footer"><KitAddButton lines={lines} label="Add The Full Kit" buyNowLabel={`Buy The Kit — ${formattedTotal}`} showBuyNow /><p className="kit-add-note">WYX requests WYX10 automatically; Shopify confirms discount eligibility and shipping before payment.</p></div>}
      </section>

      <section className="section reveal" aria-labelledby="who-its-for-heading">
        <div className="section-heading"><p className="eyebrow">WHO IT&apos;S FOR</p><h2 id="who-its-for-heading">AN EASY YES FOR THE EVERYDAY GOLFER.</h2></div>
        <div className="care-step-grid">{whoItsFor.map((item) => <div className="care-step" key={item.title}><strong>{item.title}</strong><p>{item.body}</p></div>)}</div>
      </section>

      <section className="section reveal" aria-labelledby="why-kit-heading">
        <div className="section-heading"><p className="eyebrow">NO BUNDLE GAMES</p><h2 id="why-kit-heading">YOU CAN SEE EXACTLY WHAT YOU&apos;RE BUYING.</h2></div>
        <div className="care-step-grid">{whyItWorks.map((item) => <div className="care-step" key={item.title}><strong>{item.title}</strong><p>{item.body}</p></div>)}</div>
      </section>

      <section className="dark-section reveal" aria-labelledby="kit-promise-heading">
        <div><p className="eyebrow">THE BAG TEST PROMISE</p><h2 id="kit-promise-heading">THE KIT SHOULD SOLVE FIVE SMALL PROBLEMS — NOT CREATE A SIXTH.</h2><div className="actions"><Link className="button primary" href="/the-bag-test">Read The Bag Test</Link><Link className="button secondary dark" href="/shipping-returns">Shipping & Returns</Link></div></div>
        <p>If something arrives damaged or incorrect, use the WYX support path and include your order number and photos so we can help. No scavenger hunt for customer service.</p>
      </section>

      <section className="section reveal" aria-labelledby="kit-faq-heading">
        <div className="section-heading"><p className="eyebrow">QUICK QUESTIONS</p><h2 id="kit-faq-heading">KIT FAQ.</h2></div>
        <div className="care-step-grid">{faq.map((item) => <div className="care-step" key={item.q}><strong>{item.q}</strong><p>{item.a}</p></div>)}</div>
      </section>

      <section id="bag-upgrade-kit-waitlist">
        <EmailCapture source="bag-upgrade-kit" campaign="bag_upgrade_kit_waitlist" title={kitReady ? 'GET THE NEXT GREAT BAG KIT FIRST.' : 'GET THE FULL KIT RESTOCK NOTE.'} body={kitReady ? 'Join the WYX list for new bag kits, trip gear, and premium picks.' : 'Join the WYX list and we will send a note when all five kit pieces are back together.'} />
      </section>

      <section className="section reveal" aria-label="More ways to shop">
        <div className="section-heading"><p className="eyebrow">WANT TO BUILD YOUR OWN?</p><h2>SHOP BAG UPGRADES INDIVIDUALLY.</h2></div>
        <div className="actions"><Link className="button primary" href="/bag-upgrades">Shop Bag Upgrades</Link><Link className="button secondary dark" href="/golf-gifts-under-60">Golf Gifts Under $60</Link></div>
      </section>
    </>
  );
}
