import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLink } from '@/components/ArrowLink';
import { EditorialHero } from '@/components/EditorialHero';
import { EditorialStory, type StoryItem } from '@/components/EditorialStory';
import { EmailCapture } from '@/components/EmailCapture';
import { MotionTicker } from '@/components/MotionTicker';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { availableProducts } from '@/lib/catalog';
import { money } from '@/lib/demo';
import { featuredPosts } from '@/lib/featuredJournal';
import { coreMerchProducts, firstBuyProducts } from '@/lib/merchandisingFilters';
import { premiumTargets } from '@/lib/premiumTargets';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';
import type { Product } from '@/types/shopify';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Golf’s Best Stuff. One Place. | WYX Golf Supply Co.',
  description: 'A sharp independent edit of premium golf apparel, headcovers, gloves, trip gear and accessories that earn their place.',
  alternates: { canonical: '/' },
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
  const preferred = firstBuyProducts(core);
  const products = (preferred.length ? preferred : core).slice(0, 12);
  const livePimento = find(available, 'pimento-waffle');
  const pimento = livePimento || find(available, 'long-game-rope-hat') || products[0];
  const headcover = find(available, 'topographic-edition-pure-white-embroidered-carolina-blue') || products[2];
  const game = find(available, 'golf-or-die-game-set') || products[3];
  const towel = find(available, 'blue-ridge-golf-co-golf-towels') || products[4];
  const glove = find(available, 'dartee-golf-glove') || products[5];

  const heroVariant = pimento?.variants.find((variant) => variant.availableForSale);
  const heroVariantId = pimento?.variants.length === 1 || heroVariant?.title === 'Default Title' ? heroVariant?.id : undefined;
  const fieldImage = '/images/walking-golfer-lifestyle..png';
  const storyProducts = [pimento, headcover, glove, towel].filter((product): product is Product => Boolean(product));
  const stories: StoryItem[] = storyProducts.map((product, index) => ({
    number: String(index + 1).padStart(2, '0'),
    kicker: ['Material first', 'Bag presence', 'Feel matters', 'Useful by design'][index] || 'WYX selected',
    title: product.title,
    body: [
      'A texture-rich layer that looks considered without looking overworked. It moves easily from the first tee to whatever happens after eighteen.',
      'The small details carry the whole thing: clean embroidery, a better palette, and just enough personality to make the bag feel like yours.',
      'Equipment you touch on every shot should feel right. This one clears the bar for grip, construction, and visual restraint.',
      'An everyday course essential, rebuilt with better material, a sharper point of view, and no unnecessary noise.',
    ][index],
    href: `/products/${product.handle}`,
    image: imageFor(product, index === 0 ? 1 : 0) || imageFor(product) || fieldImage,
  })).filter((item) => Boolean(item.image));

  if (!pimento) return null;

  return (
    <div className="lux-home">
      <EditorialHero
        productTitle={pimento.title}
        productPrice={money(pimento.priceRange.minVariantPrice)}
        productHref={`/products/${pimento.handle}`}
        variantId={heroVariantId}
      />

      <section className="lux-proof" aria-label="WYX shopping promises">
        <p><strong>01</strong><span>Ruthlessly selected</span><small>Every product earns the shelf.</small></p>
        <p><strong>02</strong><span>Secure checkout</span><small>Protected by Shopify.</small></p>
        <p><strong>03</strong><span>Clear policies</span><small>Eligibility varies by item.</small></p>
        <p><strong>04</strong><span>First order</span><small>Use WYX10 when eligible.</small></p>
      </section>

      <MotionTicker />

      <section className="lux-current lux-section" id="current-edit">
        <Reveal className="lux-current__head">
          <div><p className="lux-kicker">Available now / The current edit</p><h2 className="lux-display">The picks<br />worth knowing.</h2></div>
          <div><p>A deliberately short list of better golf things. Strong design, honest utility, and enough character to be worth carrying.</p><ArrowLink href="/products">Shop every live pick</ArrowLink></div>
        </Reveal>
        <div className="lux-current__grid">
          {products.slice(0, 8).map((product, index) => <ProductCard product={product} index={index} priority={index < 2} key={product.id} />)}
        </div>
      </section>

      <EditorialStory items={stories} />

      <section className="lux-manifesto">
        <Reveal className="lux-manifesto__copy">
          <p className="lux-kicker">The WYX standard / 001</p>
          <h2 className="lux-display">Small<br />on purpose.</h2>
          <p>WYX is not trying to carry everything. We look for the pieces that make golf feel better, travel smarter, and the bag a little more personal. If it is here, there is a reason.</p>
          <div><Link className="lux-button-primary" href="/the-bag-test">How we choose</Link><ArrowLink href="/about">Meet WYX</ArrowLink></div>
        </Reveal>
        {imageFor(game) && <div className="lux-manifesto__image"><Image src={imageFor(game)!} alt={game?.title || 'A WYX golf pick'} fill sizes="(max-width: 900px) 100vw, 50vw" /></div>}
      </section>

      <section className="lux-journal lux-section">
        <Reveal className="lux-journal__head"><div><p className="lux-kicker">The Edit / Field notes</p><h2 className="lux-display">Read before<br />you buy.</h2></div><p>Course-style notes, honest buying guides, and trip lists for golfers who would rather choose once and choose well.</p></Reveal>
        <div className="lux-journal__grid">
          {featuredPosts.slice(0, 3).map((post, index) => (
            <Reveal className="lux-journal__card" delay={index * .07} key={post.slug}>
              <Link href={`/journal/${post.slug}`}><div><Image src={post.image} alt={post.title} fill sizes="(max-width: 720px) 100vw, 33vw" /></div><span>Field note / 0{index + 1}</span><h3>{post.title}</h3><p>{post.description}</p><b>Read the story</b></Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="lux-radar" id="wyx-radar">
        <div className="lux-radar__title"><p className="lux-kicker">Next on WYX / The radar</p><h2 className="lux-display">Worth<br />watching.</h2><p>The products and brands we are talking to, testing, or waiting for. Nothing goes live until the terms and the product both make sense.</p></div>
        <div className="lux-radar__list">
          {premiumTargets.slice(0, 6).map((target, index) => <div key={`${target.brand}-${target.product}`}><span>0{index + 1}</span><strong>{target.brand}<small>{target.product}</small></strong><p>{target.price}</p><em>{index < 2 ? 'Priority' : 'On the radar'}</em></div>)}
        </div>
      </section>

      <EmailCapture source="home" campaign="wyx_luxury_edit" title="GET THE GOOD STUFF FIRST." body="Drop alerts, field notes, and the next product to earn a place in the edit." />
    </div>
  );
}