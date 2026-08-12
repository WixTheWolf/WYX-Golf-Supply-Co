'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from './CartProvider';

type KitAddButtonProps = {
  lines: Array<{ merchandiseId: string; quantity: number }>;
  label: string;
  buyNowLabel?: string;
  showBuyNow?: boolean;
};

export function KitAddButton({ lines, label, buyNowLabel = 'Buy Kit Now', showBuyNow = false }: KitAddButtonProps) {
  const { addMany, buyNowMany, loading, error } = useCart();
  const [pageRequiresVariantChoice, setPageRequiresVariantChoice] = useState(false);
  const [selectedProductVariantId, setSelectedProductVariantId] = useState('');
  const baseLines = useMemo(() => lines.filter((line) => line.merchandiseId && !line.merchandiseId.startsWith('demo-')), [lines]);

  useEffect(() => {
    const requiresChoice = Boolean(document.querySelector('.variant-selector'));
    setPageRequiresVariantChoice(requiresChoice);
    if (!requiresChoice) return;

    const sync = (event?: Event) => {
      const customEvent = event as CustomEvent<{ variantId?: string }> | undefined;
      setSelectedProductVariantId(customEvent?.detail?.variantId || document.documentElement.dataset.wyxSelectedProductVariant || '');
    };

    sync();
    window.addEventListener('wyx:variant-selected', sync);
    return () => window.removeEventListener('wyx:variant-selected', sync);
  }, []);

  const validLines = useMemo(() => {
    if (!pageRequiresVariantChoice || !baseLines.length) return baseLines;
    if (!selectedProductVariantId) return [];
    return [{ ...baseLines[0], merchandiseId: selectedProductVariantId }, ...baseLines.slice(1)];
  }, [baseLines, pageRequiresVariantChoice, selectedProductVariantId]);

  const needsChoice = pageRequiresVariantChoice && !selectedProductVariantId;
  const disabled = loading || validLines.length === 0;

  function focusOptions() {
    document.querySelector('.variant-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (needsChoice) {
    return (
      <div className="kit-add">
        <button className="button secondary dark full" onClick={focusOptions}>Choose Your Product Options First</button>
        <p className="selected-variant-note">Select the exact product variant above before adding the pair.</p>
      </div>
    );
  }

  return (
    <div className="kit-add">
      {showBuyNow && (
        <button className="button primary full" disabled={disabled} onClick={() => buyNowMany(validLines)}>
          {loading ? 'Opening Checkout...' : buyNowLabel}
        </button>
      )}
      <button className={showBuyNow ? 'button secondary dark full' : 'button primary full'} disabled={disabled} onClick={() => addMany(validLines)}>
        {loading ? 'Adding Kit...' : label}
      </button>
      {validLines.length > 0 && <p className="selected-variant-note">{validLines.length} items · WYX10 requested automatically; Shopify confirms the discount</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
