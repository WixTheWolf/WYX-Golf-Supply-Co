import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/AddToCartButton';
import { categoryFor } from '@/lib/catalog';
import { money } from '@/lib/demo';
import { qualityReason } from '@/lib/productQuality';
import { cleanText } from '@/lib/text';
import type { Product } from '@/types/shopify';

export function ProductCard({ product }: { product: Product }) {
  const image = product.featuredImage;
  const variant = product.variants.find((item) => item.availableForSale);
  const title = cleanText(product.title);
  const alt = cleanText(image?.altText) || title;
  return (
    <article className="product-card">
      <Link href={`/products/${product.handle}`} className="product-image-link" aria-label={`View ${title}`}>
        {image ? <Image src={image.url} alt={alt} width={900} height={675} sizes="(max-width: 900px) 100vw, (max-width: 1200px) 33vw, 25vw" /> : <span className="image-placeholder">Image coming soon</span>}
        <span className="product-status">{categoryFor(product)}</span>
      </Link>
      <div className="product-card-body">
        <p className="product-meta">{categoryFor(product)}</p>
        <h3><Link href={`/products/${product.handle}`}>{title}</Link></h3>
        <p className="buy-reason">{qualityReason(product)}</p>
        <div className="product-card-footer">
          <span className="price">{money(product.priceRange.minVariantPrice)}</span>
          <Link className="text-link" href={`/products/${product.handle}`}>View Details</Link>
        </div>
        <AddToCartButton variantId={variant?.id} />
      </div>
    </article>
  );
}
