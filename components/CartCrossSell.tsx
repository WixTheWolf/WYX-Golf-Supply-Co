'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from './CartProvider';
import { money } from '@/lib/demo';

type CrossSellItem = {
  handle: string;
  title: string;
  price: { amount: string; currencyCode: string };
  image: string | null;
  variantId: string;
};

export function CartCrossSell() {
  const { cart, open, add, loading } = useCart();
  const [items, setItems] = useState<CrossSellItem[]>([]);

  const cartHandles = (cart?.lines || [])
    .map((line) => line.merchandise.product.handle)
    .sort()
    .join(',');

  useEffect(() => {
    if (!open || !cartHandles) return;
    let cancelled = false;
    fetch(`/api/cross-sell?exclude=${encodeURIComponent(cartHandles)}`)
      .then((response) => response.json())
      .then((json) => {
        if (!cancelled) setItems(Array.isArray(json.items) ? json.items : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, cartHandles]);

  const visible = items.filter((item) => !cartHandles.includes(item.handle));
  if (!cart?.lines.length || !visible.length) return null;

  return (
    <div className="cart-cross-sell" aria-label="Round out the bag">
      <p className="cart-cross-sell-head">Round Out The Bag</p>
      {visible.map((item) => (
        <div className="cart-cross-sell-item" key={item.handle}>
          {item.image && <Image src={item.image} alt={item.title} width={52} height={52} />}
          <div>
            <Link href={`/products/${item.handle}`}>{item.title}</Link>
            <span>{money(item.price)}</span>
          </div>
          <button disabled={loading} onClick={() => add(item.variantId)} aria-label={`Add ${item.title} to bag`}>
            Add
          </button>
        </div>
      ))}
    </div>
  );
}
