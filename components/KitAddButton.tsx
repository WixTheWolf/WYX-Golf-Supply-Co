'use client';

import { useMemo } from 'react';
import { useCart } from './CartProvider';

type KitAddButtonProps = {
  lines: Array<{ merchandiseId: string; quantity: number }>;
  label: string;
  buyNowLabel?: string;
  showBuyNow?: boolean;
};

export function KitAddButton({ lines, label, buyNowLabel = 'Buy Kit Now', showBuyNow = false }: KitAddButtonProps) {
  const { addMany, buyNowMany, loading, error } = useCart();
  const validLines = useMemo(
    () => lines.filter((line) => line.merchandiseId && !line.merchandiseId.startsWith('demo-')),
    [lines]
  );
  const disabled = loading || validLines.length === 0;

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
