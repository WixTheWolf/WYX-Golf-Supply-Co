'use client';

import { trackEvent } from '@/lib/analytics';
import { useCart } from './CartProvider';

export function KitAddButton({ lines, kitName }: { lines: { merchandiseId: string; quantity: number }[]; kitName?: string }) {
  const { addMany, loading } = useCart();
  return <button className="button primary" disabled={loading || lines.length === 0} onClick={() => {
    trackEvent('kit_click', { kit_name: kitName, item_count: lines.length });
    void addMany(lines);
  }}>{loading ? 'Adding...' : 'Add Full Kit'}</button>;
}
