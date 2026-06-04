'use client';

import { trackEvent } from '@/lib/analytics';
import { useCart } from './CartProvider';

export function KitAddButton({ lines, kitName, label = 'Add Full Kit' }: { lines: { merchandiseId: string; quantity: number }[]; kitName?: string; label?: string }) {
  const { addMany, loading } = useCart();
  return <button className="button primary" disabled={loading || lines.length === 0} onClick={() => {
    trackEvent('kit_click', { kit_name: kitName, item_count: lines.length });
    void addMany(lines);
  }}>{loading ? 'Adding...' : label}</button>;
}
