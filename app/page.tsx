import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { apparelLeadProducts } from '@/lib/apparelEdit';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

const photography = {
  hero: 'https://images.unsplash.com/photo-1684599995533-3ffecba8fb81?auto=format&fit=crop&w=2600&q=90',
  walking: 'https://images.unsplash.com/photo-1693163532134-5ea6c80b58a3?auto=format&fit=crop&w=2200&q=88',
  cart: 'https://images.unsplash.com/photo-1713729372679-7feb052d74a6?auto=format&fit=crop&w=2200&q=88'
};

export const metadata: Metadata = {
  title: 'Modern Golf Apparel & Gear',
  description: 'WYX Golf Supply Co. is a modern golf apparel and gear edit for the course, the trip, and everything after the round.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'WYX Golf Supply Co. | Golf, Better Dressed.',
    description: 'A smaller, sharper edit of modern golf apparel, headwear, gloves, headcovers and trip gear.',
    url: 'https://wyxgolfsupply.com',
    images: [{ url: photography.hero }]
  }
};

export default async function Home() {
  const available = availableProducts(await getProducts());
  const core = sortByQuality(coreMerchProducts(available));
  const apparel = apparelLeadProducts(available, 6);
  const pimento = available.find((product) => product.handle === 'pimento-waffle');
  const helloFriends = available.find((product) => product.handle === 'hello-friends-t-shirt');
  const apparelCampaignImage = pimento?.images[1]?.url || pimento?.featuredImage?.url || photography.walking;
  const apparelDetailImage = helloFriends?.images[1]?.url || helloFriends?.featuredImage?.url || apparelCampaignImage;
  const accessories = core
    .filter((product) => !['Apparel', 'Headwear', 'Gloves'].includes(categoryFor(product)))
    .slice(0, 6);
  const lookFinishers = core
    .filter((product) => ['Headwear', 'Gloves'].includes(categoryFor(product)))
    .slice(0, 4);

  const stories = [
    {
      label: 'ON COURSE',
      title: 'The first tee is still a first impression.',
      copy: 'Start with the garment, not the accessory. Texture, fit and color set the whole look.',
      href: '/apparel',
      action: 'Shop apparel',
      image: apparelCampaignImage,
      alt: 'WYX golf apparel editorial product photography'
    },
    {
      label: 'OFF COURSE',
      title: 'Golf style should survive the 19th hole.',
      copy: 'Tees, layers and finishing pieces for the hours when the scorecard is already in the trash.',
      href: '/apparel',
      action: 'Shop off-course style',
      image: apparelDetailImage,
      alt: 'WYX golf lifestyle apparel photography'
    },
    {
      label: 'THE TRIP',
      title: 'Pack fewer things. Like every one of them.',
      copy: 'Golf-weekend gear for airports, rental carts, long days and the group photo when the round is over.',
      href: '/golf-trip-gear',
      action: 'Pack the trip',
      image: photography.cart,
      alt: 'Golf cart and bag beside the course'
    }
  ];

  return (
    <div className="fashion-home">
      <section className="fashion-hero fashion-home-hero">
        <Image src={photography.hero} alt="Golf bag and cart on a golf course at sunset" fill priority sizes="100vw" />
        <span className="fashion-hero-overlay" />
        <div className="fashion-hero-copy">
          <p className="eyebrow">WYX GOLF SUPPLY CO.</p>
          <h1>PLAY WELL.<br />DRESS BETTER.</h1>
          <p>Modern golf apparel and gear for the course, the trip, and the rest of the day. Smaller drops. Better pieces. No pro-shop costume.</p>
          <div className="actions">
            <Link className="button primary" href="/apparel">SHOP APPAREL</Link>
            <Link className="button secondary" href="/products">SHOP THE EDIT</Link>
          </div>
        </div>
        <div className="fashion-hero-note">EST. FOR WEEKEND GOLFERS / WYX</div>
      </section>

      <section className="fashion-principles home-principles" aria-label="WYX brand principles">
        <div><span>01</span><strong>Apparel first.</strong><p>Build the outfit before the accessories.</p></div>
        <div><span>02</span><strong>Fewer, better.</strong><p>A real edit instead of an endless feed.</p></div>
        <div><span>03</span><strong>Golf context.</strong><p>Course, clubhouse, trip—not studio fantasy.</p></div>
        <div><span>04</span><strong>Personality allowed.</strong><p>Enough character to make the bag and fit yours.</p></div>
      </section>

      {apparel.length > 0 && (
        <section className="fashion-section fashion-product-section" id="new-apparel">
          <div className="fashion-section-heading">
            <div>
              <p className="eyebrow">NEW APPAREL</p>
              <h2>BUILD THE FIT FIRST.</h2>
            </div>
            <p>Layers, tees and finishing pieces lead the new WYX. The permanent wardrobe grows from here: polos, shorts, pants and lightweight outerwear next.</p>
          </div>
          <div className="fashion-product-grid">
            {apparel.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <div className="fashion-section-action"><Link className="text-link" href="/apparel">SHOP ALL APPAREL →</Link></div>
        </section>
      )}

      <section className="fashion-campaign">
        <div className="fashion-campaign-photo">
          <Image src={apparelCampaignImage} alt="WYX golf apparel editorial photography" fill sizes="(max-width: 900px) 100vw, 62vw" />
        </div>
        <div className="fashion-campaign-copy">
          <p className="eyebrow">THE WYX UNIFORM</p>
          <h2>LOOK LIKE YOURSELF. JUST BETTER AT GOLF.</h2>
          <p>The strongest golf style is not louder. It is more considered: fit, texture, color, one or two pieces with a point of view, and nothing that feels borrowed from a corporate scramble.</p>
          <Link className="button ink" href="/apparel">SHOP THE APPAREL EDIT</Link>
        </div>
      </section>

      <section className="fashion-section fashion-story-section">
        <div className="fashion-section-heading compact">
          <div><p className="eyebrow">SHOP BY MOMENT</p><h2>THE WHOLE GOLF DAY.</h2></div>
          <p>The outfit, the bag and the trip should feel like the same person bought them.</p>
        </div>
        <div className="fashion-story-grid">
          {stories.map((story) => (
            <Link href={story.href} className="fashion-story-card" key={story.label}>
              <Image src={story.image} alt={story.alt} fill sizes="(max-width: 900px) 100vw, 33vw" />
              <span className="fashion-story-shade" />
              <div>
                <small>{story.label}</small>
                <h3>{story.title}</h3>
                <p>{story.copy}</p>
                <strong>{story.action} →</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {lookFinishers.length > 0 && (
        <section className="fashion-section fashion-product-section fashion-sand-section">
          <div className="fashion-section-heading compact">
            <div><p className="eyebrow">FINISH THE LOOK</p><h2>HEADWEAR & GLOVES.</h2></div>
            <p>The small pieces that make the outfit feel intentional.</p>
          </div>
          <div className="fashion-product-grid compact-grid">
            {lookFinishers.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      {accessories.length > 0 && (
        <section className="fashion-section fashion-product-section">
          <div className="fashion-section-heading">
            <div><p className="eyebrow">THE BAG EDIT</p><h2>THEN MAKE THE BAG MATCH.</h2></div>
            <p>Headcovers, towels, markers and useful golf-trip pieces still matter. They just no longer get to define the entire brand.</p>
          </div>
          <div className="fashion-product-grid">
            {accessories.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <div className="fashion-section-action"><Link className="text-link" href="/products">SHOP ALL WYX →</Link></div>
        </section>
      )}

      <section className="fashion-manifesto home-manifesto">
        <p className="eyebrow">WYX / THE POINT OF VIEW</p>
        <h2>GOLF HAS ENOUGH STUFF. WYX IS HERE TO MAKE THE STUFF WORTH OWNING EASIER TO FIND.</h2>
        <div className="fashion-manifesto-grid">
          <div><span>FIT</span><p>The garment has to look right before the logo matters.</p></div>
          <div><span>FUNCTION</span><p>If it comes to the course, it needs a reason to be there.</p></div>
          <div><span>FEEL</span><p>Golf gear should make the weekend feel a little better.</p></div>
        </div>
      </section>

      <EmailCapture
        source="home"
        campaign="apparel_first"
        title="GET THE NEXT WYX DROP FIRST."
        body="Apparel, golf-trip gear, new merchants and the pieces that make the WYX edit."
      />
    </div>
  );
}
