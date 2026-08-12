import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { EmailCapture } from '@/components/EmailCapture';
import { apparelEditProducts, apparelLeadProducts, finishingApparelProducts, topsAndLayersProducts } from '@/lib/apparelEdit';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export const revalidate = 300;

const coursePhoto = 'https://images.unsplash.com/photo-1693163532134-5ea6c80b58a3?auto=format&fit=crop&w=2400&q=88';

export const metadata: Metadata = {
  title: 'Golf Apparel — The WYX Edit',
  description: 'Shop the WYX golf apparel edit: course-to-weekend layers, tees, belts, gloves and headwear selected for modern golf.',
  alternates: { canonical: '/apparel' },
  openGraph: {
    title: 'Golf Apparel — The WYX Edit',
    description: 'Golf clothes and finishing pieces selected to work on the course and still look right after the round.',
    url: '/apparel',
    images: [{ url: coursePhoto }]
  }
};

export default async function ApparelPage() {
  const available = availableProducts(await getProducts());
  const apparel = apparelEditProducts(available);
  const lead = apparelLeadProducts(available, 6);
  const topsAndLayers = topsAndLayersProducts(apparel);
  const finishing = finishingApparelProducts(available, 8);
  const pimento = apparel.find((product) => product.handle === 'pimento-waffle');
  const helloFriends = apparel.find((product) => product.handle === 'hello-friends-t-shirt');
  const apparelHero = pimento?.images[0]?.url || pimento?.featuredImage?.url || coursePhoto;
  const editorialPhoto = pimento?.images[2]?.url || helloFriends?.featuredImage?.url || apparelHero;
  const supporting = sortByQuality(coreMerchProducts(available))
    .filter((product) => ['Headwear', 'Gloves'].includes(categoryFor(product)))
    .slice(0, 4);

  return (
    <div className="fashion-page">
      <section className="fashion-hero fashion-hero-apparel">
        <Image src={apparelHero} alt="WYX golf apparel editorial photography" fill priority sizes="100vw" />
        <span className="fashion-hero-overlay" />
        <div className="fashion-hero-copy">
          <p className="eyebrow">THE WYX APPAREL EDIT</p>
          <h1>DRESS LIKE YOU MEANT TO PLAY.</h1>
          <p>Performance matters. So does looking like yourself. WYX is building a smaller golf wardrobe around pieces that can handle the first tee, the clubhouse, the airport, and everything after the round.</p>
          <div className="actions">
            <Link className="button primary" href="#new-apparel">SHOP NEW APPAREL</Link>
            <Link className="button secondary" href="/products">SHOP ALL WYX</Link>
          </div>
        </div>
      </section>

      <section className="fashion-principles" aria-label="WYX apparel principles">
        <div><span>01</span><strong>Golf first.</strong><p>Built around the places golfers actually wear it.</p></div>
        <div><span>02</span><strong>Quiet confidence.</strong><p>Fewer loud logos. Better texture, fit and color.</p></div>
        <div><span>03</span><strong>Whole-day wear.</strong><p>Course, travel day, clubhouse, dinner.</p></div>
        <div><span>04</span><strong>Small drops.</strong><p>Enough choice to build a look. Never endless racks.</p></div>
      </section>

      {lead.length > 0 && (
        <section id="new-apparel" className="fashion-section fashion-product-section">
          <div className="fashion-section-heading">
            <div>
              <p className="eyebrow">NEW TO WYX</p>
              <h2>THE APPAREL WE&apos;RE BUILDING AROUND.</h2>
            </div>
            <p>The first edit starts with actual tops and layers, then uses stronger finishing pieces to complete the wardrobe. Polos, shorts, pants and lightweight outerwear are the next permanent lanes—not fifty versions of the same shirt.</p>
          </div>
          <div className="fashion-product-grid">
            {lead.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      <section className="fashion-editorial-split">
        <div className="fashion-editorial-photo">
          <Image src={editorialPhoto} alt="WYX golf clothing editorial detail" fill sizes="(max-width: 900px) 100vw, 56vw" />
        </div>
        <div className="fashion-editorial-copy">
          <p className="eyebrow">THE WYX UNIFORM</p>
          <h2>COURSE CLOTHES. WITHOUT THE COSTUME.</h2>
          <p>Golf style works best when the pieces look natural together. One strong layer. One clean finishing detail. A hat or glove with some personality. Nothing screaming for attention.</p>
          <Link className="text-link" href="/the-bag-test">WHY WYX CURATES →</Link>
        </div>
      </section>

      {topsAndLayers.length > 0 && (
        <section className="fashion-section fashion-product-section">
          <div className="fashion-section-heading compact">
            <div><p className="eyebrow">TOPS & LAYERS</p><h2>START AT THE TOP.</h2></div>
            <p>The pieces that set the tone for the whole fit.</p>
          </div>
          <div className="fashion-product-grid compact-grid">
            {topsAndLayers.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      {finishing.length > 0 && (
        <section className="fashion-section fashion-product-section fashion-sand-section">
          <div className="fashion-section-heading">
            <div><p className="eyebrow">FINISHING PIECES</p><h2>THE DETAILS DO MORE THAN ANOTHER LOGO.</h2></div>
            <p>Belts and understated finishing pieces give WYX a more complete wardrobe instead of a wall of interchangeable polos.</p>
          </div>
          <div className="fashion-product-grid">
            {finishing.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      {supporting.length > 0 && (
        <section className="fashion-section fashion-product-section">
          <div className="fashion-section-heading compact">
            <div><p className="eyebrow">COMPLETE THE LOOK</p><h2>HEADWEAR & GLOVES.</h2></div>
            <Link className="text-link" href="/products">SHOP THE FULL EDIT →</Link>
          </div>
          <div className="fashion-product-grid compact-grid">
            {supporting.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      <section className="fashion-manifesto">
        <p className="eyebrow">WYX / GOLF SUPPLY</p>
        <h2>THE GOAL ISN&apos;T TO LOOK LIKE A GOLFER. IT&apos;S TO LOOK GOOD WHILE PLAYING GOLF.</h2>
        <div className="fashion-manifesto-links">
          <Link href="/products">SHOP EVERYTHING</Link>
          <Link href="/golf-trip-gear">PACK THE TRIP</Link>
          <Link href="/golf-gifts">GIVE GOLF BETTER</Link>
        </div>
      </section>

      <EmailCapture
        source="apparel"
        campaign="apparel_edit"
        title="GET THE NEXT APPAREL DROP FIRST."
        body="New apparel, limited edits, trip gear, and the pieces that make the WYX cut."
      />
    </div>
  );
}
