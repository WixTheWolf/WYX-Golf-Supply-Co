'use client';

import Image from 'next/image';
import Link from 'next/link';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { money } from '@/lib/demo';
import type { Cart } from '@/types/shopify';

type CartLineInput = { merchandiseId: string; quantity: number };
type CartContextValue = {
  cart: Cart | null;
  open: boolean;
  count: number;
  loading: boolean;
  error: string | null;
  setOpen: (value: boolean) => void;
  add: (id: string) => Promise<void>;
  buyNow: (id: string) => Promise<void>;
  addMany: (lines: CartLineInput[]) => Promise<void>;
  refresh: () => Promise<void>;
  update: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);
const cartStorageKey = 'wyx_cart_id';
const launchCode = 'WYX10';

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}

async function callCart(method: string, body?: Record<string, unknown>) {
  const response = await fetch('/api/cart', { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Cart request failed');
  return json.cart as Cart | null;
}

function trackCartAdd(cart: Cart, contentIds: string[], contentType: string) {
  trackEvent('AddToCart', {
    content_ids: contentIds,
    content_type: contentType,
    value: Number(cart.cost.subtotalAmount.amount),
    currency: cart.cost.subtotalAmount.currencyCode
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const id = localStorage.getItem(cartStorageKey);
    if (!id) return;
    try {
      const response = await fetch(`/api/cart?cartId=${encodeURIComponent(id)}`);
      const json = await response.json();
      setCart(json.cart);
    } catch {
      localStorage.removeItem(cartStorageKey);
    }
  }, []);

  const add = useCallback(async (merchandiseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const next = await callCart('POST', { cartId: localStorage.getItem(cartStorageKey), merchandiseId, quantity: 1 });
      if (next) {
        localStorage.setItem(cartStorageKey, next.id);
        setCart(next);
        setOpen(true);
        trackCartAdd(next, [merchandiseId], 'product');
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to add item.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addMany = useCallback(async (lines: CartLineInput[]) => {
    setLoading(true);
    setError(null);
    try {
      const next = await callCart('POST', { cartId: localStorage.getItem(cartStorageKey), lines });
      if (next) {
        localStorage.setItem(cartStorageKey, next.id);
        setCart(next);
        setOpen(true);
        trackCartAdd(next, lines.map((line) => line.merchandiseId), 'product_group');
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to add kit.');
    } finally {
      setLoading(false);
    }
  }, []);

  const buyNow = useCallback(async (merchandiseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const next = await callCart('POST', { merchandiseId, quantity: 1 });
      if (next?.checkoutUrl) {
        trackCartAdd(next, [merchandiseId], 'product');
        trackEvent('InitiateCheckout', {
          value: Number(next.cost.subtotalAmount.amount),
          currency: next.cost.subtotalAmount.currencyCode,
          num_items: next.totalQuantity,
          content_ids: [merchandiseId]
        });
        window.location.href = checkoutUrlWithDiscount(next.checkoutUrl);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to start checkout.');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;
    setLoading(true);
    try {
      setCart(await callCart('PATCH', { cartId: cart.id, lineId, quantity }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to update item.');
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const remove = useCallback(async (lineId: string) => {
    if (!cart) return;
    setLoading(true);
    try {
      setCart(await callCart('DELETE', { cartId: cart.id, lineId }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to remove item.');
    } finally {
      setLoading(false);
    }
  }, [cart]);

  useEffect(() => { void refresh(); }, [refresh]);

  const value = useMemo(
    () => ({ cart, open, count: cart?.totalQuantity || 0, loading, error, setOpen, add, buyNow, addMany, refresh, update, remove }),
    [cart, open, loading, error, add, buyNow, addMany, refresh, update, remove]
  );

  return <CartContext.Provider value={value}>{children}<CartDrawer /></CartContext.Provider>;
}

function CartDrawer() {
  const { cart, open, setOpen, loading, error, update, remove } = useCart();

  function checkout() {
    if (!cart?.checkoutUrl) return;
    trackEvent('InitiateCheckout', {
      value: Number(cart.cost.subtotalAmount.amount),
      currency: cart.cost.subtotalAmount.currencyCode,
      num_items: cart.totalQuantity,
      content_ids: cart.lines.map((line) => line.merchandise.id),
      contents: cart.lines.map((line) => ({ id: line.merchandise.id, quantity: line.quantity }))
    });
    window.location.href = checkoutUrlWithDiscount(cart.checkoutUrl);
  }

  return (
    <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="cart-head"><h2>Your Bag</h2><button onClick={() => setOpen(false)} aria-label="Close cart">Close</button></div>
      <p className="promo-note">Launch code <strong>{launchCode}</strong> saves 10% at checkout.</p>
      {error && <p className="error">{error}</p>}
      {!cart?.lines.length ? <p className="muted">Your bag is empty. The supply room is ready when you are.</p> : (
        <div className="cart-lines">
          {cart.lines.map((line) => (
            <div className="cart-line" key={line.id}>
              {line.merchandise.product.featuredImage && <Image src={line.merchandise.product.featuredImage.url} alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title} width={86} height={86} />}
              <div>
                <Link href={`/products/${line.merchandise.product.handle}`}>{line.merchandise.product.title}</Link>
                <p>{line.merchandise.title}</p>
                <p>{money(line.cost.totalAmount)}</p>
                <div className="qty">
                  <button onClick={() => line.quantity > 1 ? update(line.id, line.quantity - 1) : remove(line.id)} aria-label="Decrease quantity">-</button>
                  <span>{line.quantity}</span>
                  <button onClick={() => update(line.id, line.quantity + 1)} aria-label="Increase quantity">+</button>
                  <button onClick={() => remove(line.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="cart-foot">
        <p><span>Subtotal</span><strong>{cart ? money(cart.cost.subtotalAmount) : '$0.00'}</strong></p>
        <button className="button primary" disabled={!cart?.checkoutUrl || loading} onClick={checkout}>Checkout With WYX10</button>
        <Link href="/cart">View Bag</Link>
      </div>
    </aside>
  );
}

function checkoutUrlWithDiscount(checkoutUrl: string) {
  const url = new URL(checkoutUrl);
  url.searchParams.set('discount', launchCode);
  return url.toString();
}
