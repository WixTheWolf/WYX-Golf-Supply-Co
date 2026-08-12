import Image from 'next/image';
import Link from 'next/link';
import { categoryFor } from '@/lib/catalog';
import { money } from '@/lib/demo';
import { productBuyerPromise } from '@/lib/merchandising';
import { cleanText } from '@/lib/text';
import type { Product } from '@/types/shopify';

export function EditorialProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const title = cleanText(product.title);
  const image = product.featuredImage;
  return (
    <article className={`editorial-product-card ${featured ? 'featured' : ''}`}>
      <Link href={`/products/${product.handle}`} className="editorial-image-link" aria-label={`View ${title}`}>
        {image && <Image src={image.url} alt={cleanText(image.altText) || title} width={1200} height={900} sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 33vw" />}
      </Link>
      <div>
        <p className="eyebrow">{product.tags?.some((t) => t.toLowerCase() === 'hidden-gem') ? 'HIDDEN GEM' : categoryFor(product)}</p>
        <h3><Link href={`/products/${product.handle}`} style={{ color: '#f4f0e7', textDecoration: 'none' }}>{title}</Link></h3>
        <p>{productBuyerPromise(product)}</p>
        <div className="product-card-footer">
          <span className="price">{money(product.priceRange.minVariantPrice)}</span>
          <Link className="text-link" href={`/products/${product.handle}`}>Shop →</Link>
        </div>
      </div>
    </article>
  );
}
