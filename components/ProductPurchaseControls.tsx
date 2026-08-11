'use client';

import { useMemo, useState } from 'react';
import { useCart } from './CartProvider';
import type { ProductVariant } from '@/types/shopify';

type ProductPurchaseControlsProps = {
  variants: ProductVariant[];
  productTitle: string;
  compact?: boolean;
};

export function ProductPurchaseControls({ variants, productTitle, compact = false }: ProductPurchaseControlsProps) {
  const availableVariants = useMemo(() => variants.filter((variant) => variant.availableForSale && !variant.id.startsWith('demo-')), [variants]);
  const requiresChoice = availableVariants.length > 1;
  const [selectedVariantId, setSelectedVariantId] = useState(requiresChoice ? '' : availableVariants[0]?.id || '');
  const selectedVariant = availableVariants.find((variant) => variant.id === selectedVariantId);
  const { add, buyNow, loading, error } = useCart();
  const disabled = !selectedVariantId || loading;

  async function addSelected() {
    if (!selectedVariantId) return;
    await add(selectedVariantId);
  }

  async function buySelected() {
    if (!selectedVariantId) return;
    await buyNow(selectedVariantId);
  }

  if (!availableVariants.length) {
    return <div><button className="button primary full" disabled>Currently Unavailable</button><p className="dev-note">This product is not available to purchase right now.</p></div>;
  }

  return (
    <div className={compact ? 'variant-purchase compact' : 'variant-purchase'}>
      {requiresChoice && (
        <fieldset className="variant-selector">
          <legend>Choose option</legend>
          <select
            aria-label={`Choose an option for ${productTitle}`}
            value={selectedVariantId}
            onChange={(event) => setSelectedVariantId(event.target.value)}
            style={{
              width: '100%',
              minHeight: compact ? 42 : 50,
              padding: compact ? '0.55rem 0.7rem' : '0.75rem 0.9rem',
              border: '1px solid rgba(230,255,225,.18)',
              borderRadius: 3,
              background: '#0c110d',
              color: '#f2f6ef',
              font: 'inherit',
              fontSize: compact ? '.72rem' : '.86rem',
              fontWeight: 700,
              letterSpacing: '.03em',
              cursor: 'pointer'
            }}
          >
            <option value="">Select an option</option>
            {availableVariants.map((variant) => (
              <option value={variant.id} key={variant.id}>{variantLabel(variant)}</option>
            ))}
          </select>
        </fieldset>
      )}
      {selectedVariant && <p className="selected-variant-note">Selected: <strong>{variantLabel(selectedVariant)}</strong></p>}
      {!selectedVariant && requiresChoice && !compact && <p className="selected-variant-note">Choose an option before checkout.</p>}
      <button className="button primary full" disabled={disabled} onClick={addSelected}>{loading ? 'Adding...' : disabled ? 'Choose Option' : 'Add To Bag'}</button>
      <button className="button secondary dark full" disabled={disabled} onClick={buySelected}>{loading ? 'Opening Checkout...' : disabled ? 'Choose Option' : 'Buy Now'}</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

function variantLabel(variant: ProductVariant) {
  const selectedOptions = variant.selectedOptions?.filter((option) => option.value && option.value !== 'Default Title') || [];
  if (selectedOptions.length) return selectedOptions.map((option) => option.name.toLowerCase() === 'title' ? option.value : `${option.name}: ${option.value}`).join(' / ');
  return variant.title === 'Default Title' ? 'Default option' : variant.title;
}
