'use client';

import Image from 'next/image';
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
      {requiresChoice && <fieldset className="variant-selector">
        <legend>Choose option</legend>
        <div className="variant-option-grid">
          {availableVariants.map((variant) => <label className={selectedVariantId === variant.id ? 'selected' : ''} key={variant.id}>
            <input type="radio" name={`variant-${productTitle}`} value={variant.id} checked={selectedVariantId === variant.id} onChange={() => setSelectedVariantId(variant.id)} />
            {variant.image?.url && <Image src={variant.image.url} alt={variant.image.altText || variantLabel(variant)} width={36} height={36} loading="lazy" />}
            <span>{variantLabel(variant)}</span>
          </label>)}
        </div>
      </fieldset>}
      {selectedVariant?.image?.url && !compact && <div className="selected-variant-image"><Image src={selectedVariant.image.url} alt={selectedVariant.image.altText || variantLabel(selectedVariant)} width={96} height={96} loading="lazy" /></div>}
      {selectedVariant && <p className="selected-variant-note">Selected: <strong>{variantLabel(selectedVariant)}</strong></p>}
      {!selectedVariant && requiresChoice && <p className="selected-variant-note">Choose a color or option before checkout.</p>}
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
