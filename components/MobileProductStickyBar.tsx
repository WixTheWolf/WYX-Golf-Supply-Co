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
  const requiresChoice = available.length > 1;
  const variant = requiresChoice ? undefined : available[0];
  const pricing = available[0] ? priceWithWyx10(available[0].price) : null;
  const disabled = !variant || loading;

  if (!available.length) return null;

  function chooseOptions() {
    const selector = document.querySelector('.variant-selector');
    selector?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div className="mobile-sticky-atc" aria-label="Sticky mobile purchase bar">
      <div>
        {pricing && <strong>{pricing.formattedBase}</strong>}
        <span>{title}</span>
      </div>
      <div className="mobile-sticky-actions">
        {requiresChoice ? (
          <button className="button primary compact" onClick={chooseOptions}>Choose Options</button>
        ) : (
          <>
            <button className="button secondary compact" disabled={disabled} onClick={() => variant && add(variant.id)}>
              {loading ? '...' : 'Add'}
            </button>
            <button className="button primary compact" disabled={disabled} onClick={() => variant && buyNow(variant.id)}>
              {loading ? '...' : 'Buy Now'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
