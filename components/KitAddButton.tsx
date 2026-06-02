'use client';

import { useCart } from './CartProvider';

export function KitAddButton({ lines }: { lines: { merchandiseId: string; quantity: number }[] }) {
  const { addMany, loading } = useCart();
  return <button className="button primary" disabled={loading || lines.length === 0} onClick={() => addMany(lines)}>{loading ? 'Adding...' : 'Add Full Kit'}</button>;
}
