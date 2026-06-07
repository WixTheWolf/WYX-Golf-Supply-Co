import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { catalogCategories, categoryCount, matchesCategory, saleReadyProducts } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';
import type { Product } from '@/types/shopify';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Shop Golf Gifts, Hats, Apparel, Trip Gear & Bag Upgrades',
  description: 'Shop WYX Golf Supply Co. for golf gifts, hats, apparel, towels, ball markers, gloves, golf balls, trip gear, and bag upgrades for weekend golfers.',
  alternates: { canonical: '/products' }
};

const intentFilters = [
  { label: 'Under $25', value: 'under-25' },
  { label: '$25-$60', value: '25-60' },
  { label: 'Over $60', value: 'over-60' },
  { label: 'Gift Ready', value: 'gift-ready' },
  { label: 'Trip Gear', value: 'trip-gear' },
  { label: 'Improve Your Game', value: 'game-improvement' }
];

const buyingPaths = [
  ['Golf gifts', '/golf-gifts', 'Low-risk gifts with clear round-to-round utility.'],
  ['Hats', '/products?category=Headwear', 'Course-ready style that works outside the round too.'],
  ['Apparel', '/products?category=Apparel', 'Wearable golf pieces that make the cart feel premium.'],
  ['Training', '/products?category=Training%20Aids', 'Putting, swing, alignment, and range tools for better practice.'],
  ['Golf tech', '/products?category=Golf%20Tech', 'Rangefinders, GPS gear, and useful cart tech when quality checks out.'],
  ['Trip gear', '/golf-trip-gear', 'Packable pieces for group golf weekends and prize tables.'],
  ['Bag upgrades', '/bag-upgrades', 'Small gear that cleans up the bag and earns repeat use.']
];

export default async function Products({ searchParams }: { searchParams: { category?: string; filter?: string } }) {
  const catalog = sortByQuality(saleReadyProducts(await getProducts()));
  const category = searchParams.category;
  const filter = searchParams.filter;
  const visibleCategories = catalogCategories.filter((item) => item === 'All' || categoryCount(catalog, item) > 0);
  const products = catalog.filter((product) => matchesCategory(product, category)).filter((product) => matchesIntentFilter(product, filter));

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Shop</p>
        <h1>Golf Gear Worth Adding To The Bag.</h1>
        <p>Course-ready hats, apparel, golf gifts, swing trainers, range gear, balls, markers, gloves, towels, and trip gear for weekend golfers.</p>
        <div className="intent-proof-grid" aria-label="WYX shopping promises">
          <span>Gifts under $60</span>
          <span>Trip-ready picks</span>
          <span>Giftable price points</span>
          <span>Support by email</span>
        </div>
      </section>

      <section className="section seo-guide">
        <div>
          <p className="eyebrow">Shop By Intent</p>
          <h2>Use The Right Buying Path.</h2>
          <p>Most WYX carts should start with a clear reason: a gift, a golf trip, a wearable piece, better practice, useful golf tech, or a practical bag upgrade.</p>
        </div>
        <div className="collection-copy-grid">
          {buyingPaths.map(([title, href, copy]) => <article key={href}>
            <h3>{title}</h3>
            <p>{copy}</p>
            <Link className="text-link" href={href}>Shop {title}</Link>
          </article>)}
        </div>
      </section>

      <nav className="filter-row" aria-label="Product categories">
        {visibleCategories.map((item) => <Link className={(!category && item === 'All') || category === item ? 'active' : ''} key={item} href={item === 'All' ? '/products' : `/products?category=${encodeURIComponent(item)}`}>{item}<small>{item === 'All' ? catalog.length : categoryCount(catalog, item)}</small></Link>)}
      </nav>
      <nav className="filter-row intent-filter-row" aria-label="Shop filters">
        <Link className={!filter ? 'active' : ''} href={category ? `/products?category=${encodeURIComponent(category)}` : '/products'}>All Gear</Link>
        {intentFilters.map((item) => {
          const params = new URLSearchParams();
          if (category) params.set('category', category);
          params.set('filter', item.value);
          return <Link className={filter === item.value ? 'active' : ''} key={item.value} href={`/products?${params.toString()}`}>{item.label}</Link>;
        })}
      </nav>
      <section className="section product-section">
        <div className="results-heading"><p className="eyebrow">{filterLabel(filter) || category || 'All Gear'}</p><span>{products.length} {products.length === 1 ? 'product' : 'products'}</span></div>
        {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p>No products are available in this category yet. Check the full shop for current picks.</p>}
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'WYX Golf Supply Co. golf gear',
        description: metadata.description,
        url: 'https://wyxgolfsupply.com/products',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: products.slice(0, 24).map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `https://wyxgolfsupply.com/products/${product.handle}`,
            name: product.title
          }))
        }
      }) }} />
    </>
  );
}

function matchesIntentFilter(product: Product, filter?: string) {
  const price = Number(productPrice(product).amount);
  const haystack = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();
  if (!filter) return true;
  if (filter === 'under-25') return price < 25;
  if (filter === '25-60') return price >= 25 && price <= 60;
  if (filter === 'over-60') return price > 60;
  if (filter === 'gift-ready') return price <= 60 || /gift|marker|towel|balls|caddie|headcover|hat|cap|shirt|polo|hoodie|belt|sock/.test(haystack);
  if (filter === 'trip-gear') return /trip|travel|marker|towel|balls|caddie|glove|grip|headcover|hat|cap|shirt|polo|hoodie|belt|shoe bag|cooler|pouch/.test(haystack);
  if (filter === 'game-improvement') return /training|trainer|putting|alignment|swing|tempo|chipping|rangefinder|gps|range gear|short game|club care|brush|groove/.test(haystack);
  return true;
}

function filterLabel(filter?: string) {
  return intentFilters.find((item) => item.value === filter)?.label;
}
