import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { TrustBar } from '@/components/TrustBar';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { coreMerchProducts, firstBuyProducts } from '@/lib/merchandisingFilters';
import { premiumTargets } from '@/lib/premiumTargets';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';
import type { Product } from '@/types/shopify';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'The Coolest Golf Gear, Apparel & Accessories | WYX Golf Supply Co.',
  description: 'WYX Golf Supply Co. is an opinionated golf shop for standout apparel, footwear, tech, bags, trip gear and accessories.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'WYX Golf Supply Co. | The Good Stuff in Golf.',
    description: 'A sharp multi-brand edit of golf apparel, tech, bags, accessories and trip gear.',
    url: 'https://wyxgolfsupply.com'
  }
};

function find(products: Product[], handle: string) {
  return products.find((product) => product.handle === handle);
}

function imageFor(product: Product | undefined, index = 0) {
  return product?.images[index]?.url || product?.featuredImage?.url || null;
}

export default async function Home() {
  const available = availableProducts(await getProducts());
  const core = sortByQuality(coreMerchProducts(available));
  const heroProducts = firstBuyProducts(core).slice(0, 12);
  const pimento = find(available, 'pimento-waffle');
  const hat = find(available, 'augusta-bear-hat');
  const headcover = find(available, 'topographic-edition-pure-white-embroidered-carolina-blue') || find(available, 'evil-ape');
  const game = find(available, 'golf-or-die-game-set');
  const towel = find(available, 'blue-ridge-golf-co-golf-towels');
  const glove = find(available, 'dartee-golf-glove');

  const heroMain = imageFor(pimento, 1) || imageFor(pimento, 0);
  const heroAlt = imageFor(hat, 0) || imageFor(headcover, 0);
  const heroThird = imageFor(headcover, 0) || imageFor(game, 0);

  const apparel = core.filter((product) => categoryFor(product) === 'Apparel').slice(0, 6);
  const bagAndAccessories = core.filter((product) => ['Accessories', 'Towels', 'Grips', 'Gloves', 'Headwear'].includes(categoryFor(product))).slice(0, 8);

  const departments = [
    {
      number: '01',
      label: 'APPAREL',
      title: 'Polos, layers, bottoms & the stuff you wear after.',
      href: '/apparel',
      image: imageFor(pimento, 0),
      status: `${apparel.length || 'NEW'} LIVE PICKS`
    },
    {
      number: '02',
      label: 'FOOTWEAR',
      title: 'Golf shoes worth walking 36 holes in.',
      href: '#wyx-radar',
      image: heroAlt,
      status: 'COMING NEXT'
    },
    {
      number: '03',
      label: 'TECH',
      title: 'Rangefinders, GPS, launch monitors & smart golf toys.',
      href: '#wyx-radar',
      image: imageFor(game, 0) || heroThird,
      status: 'COMING NEXT'
    },
    {
      number: '04',
      label: 'BAGS + TRIP',
      title: 'Better carry bags, travel gear and weekend essentials.',
      href: '/golf-trip-gear',
      image: imageFor(towel, 0) || heroThird,
      status: 'THE EDIT IS GROWING'
    },
    {
      number: '05',
      label: 'ACCESSORIES',
      title: 'The small things people ask about when they see your bag.',
      href: '/products?category=Accessories',
      image: heroThird,
      status: `${bagAndAccessories.length} LIVE PICKS`
    },
    {
      number: '06',
      label: 'GIFTS',
      title: 'Golf gifts worth giving to somebody who actually plays.',
      href: '/golf-gifts',
      image: imageFor(glove, 0) || imageFor(hat, 0),
      status: 'WYX PICKS'
    }
  ];

  return (
    <div className="wyx-storefront">
      <section className="wyx-mega-hero">
        <div className="wyx-mega-copy">
          <p className="eyebrow">WYX GOLF SUPPLY CO. / THE EDIT</p>
          <h1>GOLF&apos;S BEST STUFF.<br />ONE PLACE.</h1>
          <p className="wyx-mega-lede">Polos worth wearing. Shoes worth walking in. Tech that earns space in the bag. Accessories you actually want to show off. WYX cuts through the noise and keeps the golf products worth knowing about.</p>
          <div className="actions">
            <Link className="button primary" href="/products">SHOP THE LIVE EDIT</Link>
            <Link className="button secondary" href="/apparel">SHOP APPAREL</Link>
          </div>
          <div className="wyx-mega-proof">
            <span>PREMIUM BRANDS</span><span>INDEPENDENT PICKS</span><span>BETTER GOLF GEAR</span><span>NO FILLER</span>
          </div>
        </div>
        <div className="wyx-mega-images" aria-label="WYX product edit">
          {heroMain && <div className="wyx-shot wyx-shot-main"><Image src={heroMain} alt="WYX apparel selection" fill priority sizes="(max-width: 900px) 100vw, 48vw" /></div>}
          {heroAlt && <div className="wyx-shot wyx-shot-small"><Image src={heroAlt} alt="WYX golf headwear selection" fill priority sizes="(max-width: 900px) 50vw, 24vw" /></div>}
          {heroThird && <div className="wyx-shot wyx-shot-small"><Image src={heroThird} alt="WYX golf accessory selection" fill priority sizes="(max-width: 900px) 50vw, 24vw" /></div>}
        </div>
      </section>

      <TrustBar />

      <section className="wyx-marquee" aria-label="WYX departments">
        <span>APPAREL</span><i>✦</i><span>FOOTWEAR</span><i>✦</i><span>GOLF TECH</span><i>✦</i><span>BAGS</span><i>✦</i><span>ACCESSORIES</span><i>✦</i><span>TRIP GEAR</span>
      </section>

      {heroProducts.length > 0 && (
        <section className="wyx-edit-section">
          <div className="wyx-edit-heading">
            <div><p className="eyebrow">AVAILABLE NOW</p><h2>THE CURRENT WYX PICKS.</h2></div>
            <p>The products on the shelf today that best match where WYX is headed: better materials, stronger design, useful golf function and enough personality to be worth owning.</p>
          </div>
          <div className="wyx-feature-grid">
            {heroProducts.slice(0, 8).map((product, index) => (
              <div key={product.id} className={index === 0 || index === 5 ? 'wyx-feature-large' : ''}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="wyx-section-link"><Link className="text-link" href="/products">SHOP EVERYTHING AVAILABLE →</Link></div>
        </section>
      )}

      <section className="wyx-departments">
        <div className="wyx-department-intro">
          <p className="eyebrow">SHOP WYX</p>
          <h2>FROM THE FIRST TEE TO THE FLIGHT HOME.</h2>
          <p>One place for the golf wardrobe, the shoes, the technology, the bag and the trip. We add categories when the products are good enough—not just because we can fill a page.</p>
        </div>
        <div className="wyx-department-grid">
          {departments.map((department) => (
            <Link className="wyx-department-card" href={department.href} key={department.label}>
              {department.image && <Image src={department.image} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" />}
              <span className="wyx-department-shade" />
              <div className="wyx-department-top"><small>{department.number}</small><small>{department.status}</small></div>
              <div className="wyx-department-copy"><strong>{department.label}</strong><h3>{department.title}</h3><span>EXPLORE →</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section reveal" aria-labelledby="curator-heading">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">FROM THE CURATOR</p>
            <h2 id="curator-heading">THE SHOP IS SMALL ON PURPOSE.</h2>
          </div>
          <p>WYX is an independent golf shop with one editorial point of view. A product earns the shelf only when the listing is clear, the inventory is live, the media is honest, and the piece adds something useful or genuinely good-looking to the game.</p>
        </div>
        <div className="care-step-grid">
          <div className="care-step-card"><strong>Current Inventory</strong><p>Product options come from Shopify. Sold-out variants are disabled before checkout.</p></div>
          <div className="care-step-card"><strong>Clear Buying Guidance</strong><p>Why WYX picked it, fit or compatibility notes, and the details that matter before it reaches the bag.</p></div>
          <div className="care-step-card"><strong>Real Support</strong><p>Shipping estimates appear before payment, and WYX support handles damaged, incorrect, and return questions directly.</p></div>
        </div>
        <div className="actions" style={{ marginTop: '1.5rem' }}>
          <Link className="button primary" href="/about">READ THE WYX STORY</Link>
          <Link className="button secondary dark" href="/the-bag-test">SEE THE WYX STANDARD</Link>
        </div>
      </section>

      <section className="wyx-radar" id="wyx-radar">
        <div>
          <p className="eyebrow">NEXT ON WYX</p>
          <h2>THE PREMIUM PRODUCTS ON OUR RADAR.</h2>
          <p>Highly rated products and brands we want in the WYX mix. They are not for sale here yet; they move into the shop only when the product, pricing and retailer relationship all make sense.</p>
        </div>
        <div className="wyx-radar-list">
          {premiumTargets.slice(0, 8).map((target, index) => (
            <div key={`${target.brand}-${target.product}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{target.brand}<br />{target.product}</strong>
              <p>{target.rating ? `${target.rating} · ` : ''}{target.reviews ? `${target.reviews} · ` : ''}{target.price} · {target.proof}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wyx-statement">
        <div className="wyx-statement-kicker">THE WYX STANDARD</div>
        <h2>GOOD ENOUGH FOR A PRO SHOP ISN&apos;T GOOD ENOUGH FOR WYX.</h2>
        <div className="wyx-statement-links">
          <Link href="/the-bag-test">HOW WE PICK →</Link>
          <Link href="/golf-trip-gear">TRIP GEAR →</Link>
          <Link href="/golf-gifts">GOLF GIFTS →</Link>
        </div>
      </section>

      <EmailCapture
        source="home"
        campaign="wyx_one_shop"
        title="GET THE GOOD STUFF FIRST."
        body="New brands, apparel, golf tech, bags and the products that make the WYX cut."
      />
    </div>
  );
}
