import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/AddToCartButton';
import { categoryFor, supplierName } from '@/lib/catalog';
import { money } from '@/lib/demo';
import type { Product } from '@/types/shopify';

export function ProductCard({ product }: { product: Product }) {
  const image = product.featuredImage;
  const variant = product.variants.find((item) => item.availableForSale);
  return (
    <article className="product-card">
      <Link href={`/products/${product.handle}`} className="product-image-link" aria-label={`View ${product.title}`}>
        {image ? <Image src={image.url} alt={image.altText || product.title} width={900} height={675} /> : <span className="image-placeholder">Image coming soon</span>}
        <span className="product-status">Ready To Ship</span>
      </Link>
      <div className="product-card-body">
        <p className="product-meta">{categoryFor(product)} <span>By {supplierName(product)}</span></p>
        <h3><Link href={`/products/${product.handle}`}>{product.title}</Link></h3>
        <div className="product-card-footer">
          <span className="price">{money(product.priceRange.minVariantPrice)}</span>
          <Link className="text-link" href={`/products/${product.handle}`}>Details</Link>
        </div>
        <AddToCartButton variantId={variant?.id} />
      </div>
    </article>
  );
}
