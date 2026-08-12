import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { coreMerchProducts, firstBuyProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';
import type { Product } from '@/types/shopify';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'The Coolest Golf Gear, Apparel & Accessories',
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
  const headcover = find(available, 'topographic-carolina-blue-driver-headcover') || find(available, 'evil-ape');
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
      title: 'Golf shoes that do not look like orthopedic equipment.',
      href: '/products',
      image: heroAlt,
      status: 'SOURCING NOW'
    },
    {
      number: '03',
      label: 'TECH',
      title: 'Rangefinders, GPS, launch monitors & smart golf toys.',
      href: '/golf-tech',
      image: imageFor(game, 0) || heroThird,
      status: 'SOURCING NOW'
    },
    {
      number: '04',
      label: 'BAGS + TRIP',
      title: 'The gear that makes the airport, cart and trunk better.',
      href: '/golf-trip-gear',
      image: imageFor(towel, 0) || heroThird,
      status: 'BUILDING THE EDIT'
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
      title: 'Golf gifts that are not another sleeve of logo balls.',
      href: '/golf-gifts',
      image: imageFor(glove, 0) || imageFor(hat, 0),
      status: 'WYX-APPROVED'
    }
  ];

  return (
    <div className="wyx-storefront">
      <section className="wyx-mega-hero">
        <div className="wyx-mega-copy">
          <p className="eyebrow">WYX GOLF SUPPLY CO. / CURATED FOR GOLFERS</p>
          <h1>THE GOOD STUFF.<br />ALL OF IT.</h1>
          <p className="wyx-mega-lede">The coolest apparel, golf tech, footwear, bags and accessories we can find. No endless supplier feed. No pro-shop filler. Just the things worth knowing about.</p>
          <div className="actions">
            <Link className="button primary" href="/products">SHOP WHAT&apos;S LIVE</Link>
            <Link className="button secondary" href="/apparel">SHOP APPAREL</Link>
          </div>
          <div className="wyx-mega-proof">
            <span>MULTI-BRAND</span><span>SMALLER EDITS</span><span>SHOPIFY CHECKOUT</span><span>WYX TASTE TEST</span>
          </div>
        </div>
        <div className="wyx-mega-images" aria-label="WYX product edit">
          {heroMain && <div className="wyx-shot wyx-shot-main"><Image src={heroMain} alt="WYX apparel selection" fill priority sizes="(max-width: 900px) 100vw, 48vw" /></div>}
          {heroAlt && <div className="wyx-shot wyx-shot-small"><Image src={heroAlt} alt="WYX golf headwear selection" fill priority sizes="(max-width: 900px) 50vw, 24vw" /></div>}
          {heroThird && <div className="wyx-shot wyx-shot-small"><Image src={heroThird} alt="WYX golf accessory selection" fill priority sizes="(max-width: 900px) 50vw, 24vw" /></div>}
        </div>
      </section>

      <section className="wyx-marquee" aria-label="WYX departments">
        <span>APPAREL</span><i>✦</i><span>FOOTWEAR</span><i>✦</i><span>GOLF TECH</span><i>✦</i><span>BAGS</span><i>✦</i><span>ACCESSORIES</span><i>✦</i><span>TRIP GEAR</span>
      </section>

      {heroProducts.length > 0 && (
        <section className="wyx-edit-section">
          <div className="wyx-edit-heading">
            <div><p className="eyebrow">THE WYX EDIT / AVAILABLE NOW</p><h2>START WITH THE STUFF WE&apos;D ACTUALLY BUY.</h2></div>
            <p>We are deliberately making this harder on ourselves: fewer products, stronger opinions, better brands. These are the current pieces that survive the cut.</p>
          </div>
          <div className="wyx-feature-grid">
            {heroProducts.slice(0, 8).map((product, index) => (
              <div key={product.id} className={index === 0 || index === 5 ? 'wyx-feature-large' : ''}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="wyx-section-link"><Link className="text-link" href="/products">SEE THE FULL LIVE EDIT →</Link></div>
        </section>
      )}

      <section className="wyx-departments">
        <div className="wyx-department-intro">
          <p className="eyebrow">THE NEW WYX / ONE SHOP</p>
          <h2>GOLF HAS DEPARTMENTS. SO DO WE.</h2>
          <p>WYX is expanding into the categories a modern golfer actually shops together. We will not open a department with junk just to make the nav look full.</p>
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

      <section className="wyx-radar">
        <div>
          <p className="eyebrow">ON THE WYX RADAR</p>
          <h2>WHAT WE&apos;RE HUNTING NEXT.</h2>
        </div>
        <div className="wyx-radar-list">
          <div><span>01</span><strong>THE POLO</strong><p>Premium fabric. Great collar. No corporate outing energy.</p></div>
          <div><span>02</span><strong>THE BOTTOMS</strong><p>Shorts and pants that fit like actual clothes, not uniform pants.</p></div>
          <div><span>03</span><strong>THE SHOE</strong><p>Walkable, clean, distinctive. Something you would wear to the parking lot on purpose.</p></div>
          <div><span>04</span><strong>THE TECH</strong><p>Rangefinders, GPS and practice tech that earn the space in your bag.</p></div>
          <div><span>05</span><strong>THE BAG</strong><p>A premium carry or trip bag that can become a WYX signature piece.</p></div>
        </div>
      </section>

      <section className="wyx-statement">
        <div className="wyx-statement-kicker">WYX / THE STANDARD</div>
        <h2>IF IT&apos;S BORING, CHEAP-LOOKING, GIMMICKY OR ALREADY EVERYWHERE, IT DOESN&apos;T BELONG HERE.</h2>
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
        body="New brands, apparel drops, golf tech, trip gear and the products that actually make the WYX cut."
      />
    </div>
  );
}
