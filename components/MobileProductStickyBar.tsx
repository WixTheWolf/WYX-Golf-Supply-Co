'use client';

import { useMemo } from 'react';
import { useCart } from './CartProvider';
import { priceWithWyx10 } from '@/lib/pricing';
import type { ProductVariant } from '@/types/shopify';

type Props = {
  title: string;
  variants: ProductVariant[];
};

export function MobileProductStickyBar({ title, variants }: Props) {
  const { add, buyNow, loading } = useCart();
  const available = useMemo(
    () => variants.filter((v) => v.availableForSale && !v.id.startsWith('demo-')),
    [variants]
  );
  const variant = available[0];
  const pricing = variant ? priceWithWyx10(variant.price) : null;
  const disabled = !variant || loading;

  if (!available.length) return null;

  return (
    <div className="mobile-sticky-atc" aria-label="Sticky mobile purchase bar">
      <div>
        {pricing && <strong>{pricing.formattedSale}</strong>}
        <span>{title}</span>
      </div>
      <div className="mobile-sticky-actions">
        <button className="button secondary compact" disabled={disabled} onClick={() => add(variant!.id)}>
          {loading ? '...' : 'Add'}
        </button>
        <button className="button primary compact" disabled={disabled} onClick={() => buyNow(variant!.id)}>
          {loading ? '...' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
}