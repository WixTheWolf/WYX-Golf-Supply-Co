import Image from 'next/image';
import Link from 'next/link';
import { categoryFor } from '@/lib/catalog';
import { money } from '@/lib/demo';
import { cleanText } from '@/lib/text';
import type { Product } from '@/types/shopify';

export function EditorialProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const title = cleanText(product.title);
  const image = product.featuredImage;
  return (
    <article className={`editorial-product-card ${featured ? 'featured' : ''}`}>
      <Link href={`/products/${product.handle}`} className="editorial-image-link" aria-label={`View ${title}`}>
        {image && <Image src={image.url} alt={cleanText(image.altText) || title} width={1200} height={900} />}
        <span>{categoryFor(product)}</span>
      </Link>
      <div>
        <p className="eyebrow">Short List</p>
        <h3><Link href={`/products/${product.handle}`}>{title}</Link></h3>
        <p>{shortReason(product)}</p>
        <div className="product-card-footer">
          <span className="price">{money(product.priceRange.minVariantPrice)}</span>
          <Link className="text-link" href={`/products/${product.handle}`}>Shop This</Link>
        </div>
      </div>
    </article>
  );
}

function shortReason(product: Product) {
  const text = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();
  if (text.includes('towel')) return 'The easy yes for trips, carts, and cleaning up before the next shot.';
  if (text.includes('marker')) return 'Small, giftable, and useful enough to actually stay in the bag.';
  if (text.includes('ball')) return 'A practical add-on for trip bags, prize tables, and first-tee chaos.';
  if (text.includes('glove')) return 'A clean first-cart upgrade with real utility and a sharp gift price.';
  if (text.includes('hat')) return 'Personality without trying too hard. Easy gift, easy cart.';
  if (text.includes('headcover') || text.includes('cover')) return 'Turns the bag into a little more of a statement.';
  if (text.includes('game set')) return 'Built for golf trips, bachelor weekends, and post-round bragging rights.';
  if (text.includes('caddie')) return 'Keeps the little stuff from turning into a bottom-pocket search party.';
  return 'A useful WYX pick for weekend players and gift shoppers.';
}

