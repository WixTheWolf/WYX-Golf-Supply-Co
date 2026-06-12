import type { Product } from '@/types/shopify';

export function isHiddenGem(product: Pick<Product, 'tags'>) {
  return (product.tags || []).some((tag) => tag.toLowerCase() === 'hidden-gem');
}

export function ProductBadge({ product }: { product: Pick<Product, 'tags'> }) {
  if (!isHiddenGem(product)) return null;
  return <span className="product-badge hidden-gem-badge">Hidden Gem</span>;
}