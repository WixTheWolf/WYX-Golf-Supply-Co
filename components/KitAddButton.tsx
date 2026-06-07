'use client';

import { useMemo } from 'react';
import { useCart } from './CartProvider';

type KitAddButtonProps = {
  lines: Array<{ merchandiseId: string; quantity: number }>;
  label: string;
};

export function KitAddButton({ lines, label }: KitAddButtonProps) {
  const { addMany, loading, error } = useCart();
  const validLines = useMemo(() => lines.filter((line) => line.merchandiseId && !line.merchandiseId.startsWith('demo-')), [lines]);
  const disabled = loading || validLines.length === 0;

  return (
    <div className="kit-add">
      <button className="button primary full" disabled={disabled} onClick={() => addMany(validLines)}>
        {loading ? 'Adding Kit...' : label}
      </button>
      {validLines.length > 0 && <p className="selected-variant-note">{validLines.length} items added together. Review quantities in your bag before checkout.</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
