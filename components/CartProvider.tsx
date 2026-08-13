'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LockSimple, Minus, Plus, X } from '@phosphor-icons/react';
import { AnimatePresence, m } from 'framer-motion';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CartAbandonGuard } from '@/components/CartAbandonGuard';
import { CartCrossSell } from '@/components/CartCrossSell';
import { CartPromoSummary } from '@/components/CartPromoSummary';
import { KitUpsellBanner } from '@/components/KitUpsellBanner';
import { trackEvent } from '@/lib/analytics';
import { cartPromoState } from '@/lib/cartPromo';
import { money } from '@/lib/demo';
import type { Cart, CartLine } from '@/types/shopify';

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
  buyNowMany: (lines: CartLineInput[]) => Promise<void>;
  refresh: () => Promise<void>;
  update: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);
const cartStorageKey = 'wyx_cart_id';
const attributionStorageKey = 'wyx_first_touch';

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

function gaItem(line: CartLine) {
  return { item_id: line.merchandise.id, item_name: line.merchandise.product.title, item_variant: line.merchandise.title, price: Number(line.merchandise.price.amount), quantity: line.quantity };
}

function klaviyoItem(line: CartLine) {
  const price = Number(line.merchandise.price.amount);
  return {
    ProductID: line.merchandise.id,
    ProductName: line.merchandise.product.title,
    ProductVariant: line.merchandise.title,
    Quantity: line.quantity,
    ItemPrice: price,
    RowTotal: Number(line.cost.totalAmount.amount),
    ProductURL: `https://wyxgolfsupply.com/products/${line.merchandise.product.handle}`,
    ImageURL: line.merchandise.product.featuredImage?.url
  };
}

function cartValue(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + Number(line.cost.totalAmount.amount), 0);
}

function trackCartAdd(cart: Cart, contentIds: string[], contentType: string) {
  const addedLines = cart.lines.filter((line) => contentIds.includes(line.merchandise.id));
  const lines = addedLines.length ? addedLines : cart.lines;
  trackEvent('AddToCart', {
    content_ids: contentIds,
    content_type: contentType,
    value: cartValue(lines),
    currency: cart.cost.subtotalAmount.currencyCode,
    items: lines.map(gaItem),
    klaviyo: {
      $value: Number(cart.cost.subtotalAmount.amount),
      ItemNames: cart.lines.map((line) => line.merchandise.product.title),
      CheckoutURL: cart.checkoutUrl,
      Items: cart.lines.map(klaviyoItem),
      AddedItems: lines.map(klaviyoItem)
    }
  });
}

function trackCheckout(cart: Cart) {
  trackEvent('InitiateCheckout', {
    value: Number(cart.cost.subtotalAmount.amount),
    currency: cart.cost.subtotalAmount.currencyCode,
    num_items: cart.totalQuantity,
    content_ids: cart.lines.map((line) => line.merchandise.id),
    contents: cart.lines.map((line) => ({ id: line.merchandise.id, quantity: line.quantity })),
    items: cart.lines.map(gaItem),
    klaviyo: {
      $event_id: `${cart.id}-${Date.now()}`,
      $value: Number(cart.cost.subtotalAmount.amount),
      ItemNames: cart.lines.map((line) => line.merchandise.product.title),
      CheckoutURL: cart.checkoutUrl,
      Items: cart.lines.map(klaviyoItem)
    }
  });
}

function cookieValue(name: string) {
  if (typeof document === 'undefined') return '';
  const prefix = `${name}=`;
  const part = document.cookie.split(';').map((item) => item.trim()).find((item) => item.startsWith(prefix));
  return part ? decodeURIComponent(part.slice(prefix.length)) : '';
}

function googleClientId() {
  const value = cookieValue('_ga');
  const parts = value.split('.');
  return parts.length >= 4 ? parts.slice(-2).join('.') : '';
}

function captureFirstTouch() {
  if (typeof window === 'undefined') return;
  if (sessionStorage.getItem(attributionStorageKey)) return;
  sessionStorage.setItem(attributionStorageKey, JSON.stringify({ landing: window.location.href, referrer: document.referrer || '' }));
}

function attributionAttributes() {
  if (typeof window === 'undefined') return [];
  captureFirstTouch();
  let firstTouch: { landing?: string; referrer?: string } = {};
  try { firstTouch = JSON.parse(sessionStorage.getItem(attributionStorageKey) || '{}'); } catch { firstTouch = {}; }
  const values = [
    ['_wyx_ga_client_id', googleClientId()],
    ['_wyx_fbp', cookieValue('_fbp')],
    ['_wyx_fbc', cookieValue('_fbc')],
    ['_wyx_landing', firstTouch.landing || window.location.href],
    ['_wyx_referrer', firstTouch.referrer || '']
  ] as const;
  return values.filter(([, value]) => Boolean(value)).map(([key, value]) => ({ key, value: value.slice(0, 1000) }));
}

async function cartWithAttribution(cart: Cart) {
  const attributes = attributionAttributes();
  if (!attributes.length) return cart;
  try { return (await callCart('PATCH', { cartId: cart.id, attributes })) || cart; } catch { return cart; }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearStoredCart = useCallback(() => {
    localStorage.removeItem(cartStorageKey);
    setCart(null);
  }, []);

  const refresh = useCallback(async () => {
    const id = localStorage.getItem(cartStorageKey);
    if (!id) return;
    try {
      const response = await fetch(`/api/cart?cartId=${encodeURIComponent(id)}`);
      const json = await response.json();
      if (!response.ok || !json.cart) { clearStoredCart(); return; }
      setCart(json.cart);
    } catch { clearStoredCart(); }
  }, [clearStoredCart]);

  const add = useCallback(async (merchandiseId: string) => {
    setOpen(true); setLoading(true); setError(null);
    try {
      const next = await callCart('POST', { cartId: localStorage.getItem(cartStorageKey), merchandiseId, quantity: 1 });
      if (next) {
        localStorage.setItem(cartStorageKey, next.id); setCart(next); setOpen(true); trackCartAdd(next, [merchandiseId], 'product');
      }
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to add item.'); }
    finally { setLoading(false); }
  }, []);

  const addMany = useCallback(async (lines: CartLineInput[]) => {
    setOpen(true); setLoading(true); setError(null);
    try {
      const next = await callCart('POST', { cartId: localStorage.getItem(cartStorageKey), lines });
      if (next) {
        localStorage.setItem(cartStorageKey, next.id); setCart(next); setOpen(true); trackCartAdd(next, lines.map((line) => line.merchandiseId), 'product_group');
      }
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to add kit.'); }
    finally { setLoading(false); }
  }, []);

  const buyNowMany = useCallback(async (lines: CartLineInput[]) => {
    setLoading(true); setError(null);
    try {
      const next = await callCart('POST', { lines });
      if (next?.checkoutUrl) {
        const attributed = await cartWithAttribution(next);
        localStorage.setItem(cartStorageKey, attributed.id); setCart(attributed);
        trackCartAdd(attributed, lines.map((line) => line.merchandiseId), 'product_group'); trackCheckout(attributed);
        window.location.href = attributed.checkoutUrl;
      }
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to start checkout.'); }
    finally { setLoading(false); }
  }, []);

  const buyNow = useCallback(async (merchandiseId: string) => {
    setLoading(true); setError(null);
    try {
      const next = await callCart('POST', { merchandiseId, quantity: 1 });
      if (next?.checkoutUrl) {
        const attributed = await cartWithAttribution(next);
        localStorage.setItem(cartStorageKey, attributed.id); setCart(attributed);
        trackCartAdd(attributed, [merchandiseId], 'product'); trackCheckout(attributed);
        window.location.href = attributed.checkoutUrl;
      }
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to start checkout.'); }
    finally { setLoading(false); }
  }, []);

  const update = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;
    setLoading(true);
    try { const next = await callCart('PATCH', { cartId: cart.id, lineId, quantity }); if (next) setCart(next); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to update item.'); }
    finally { setLoading(false); }
  }, [cart]);

  const remove = useCallback(async (lineId: string) => {
    if (!cart) return;
    setLoading(true);
    try { const next = await callCart('DELETE', { cartId: cart.id, lineId }); if (next) setCart(next); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to remove item.'); }
    finally { setLoading(false); }
  }, [cart]);

  useEffect(() => { captureFirstTouch(); void refresh(); }, [refresh]);

  const value = useMemo(() => ({ cart, open, count: cart?.totalQuantity || 0, loading, error, setOpen, add, buyNow, addMany, buyNowMany, refresh, update, remove }), [cart, open, loading, error, add, buyNow, addMany, buyNowMany, refresh, update, remove]);

  return <CartContext.Provider value={value}>{children}<CartAbandonGuard /><CartDrawer /></CartContext.Provider>;
}

function CartDrawer() {
  const { cart, open, setOpen, loading, error, update, remove } = useCart();
  const promo = cartPromoState(cart);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', closeOnEscape); };
  }, [open, setOpen]);

  async function checkout() {
    if (!cart?.checkoutUrl) return;
    const attributed = await cartWithAttribution(cart);
    trackCheckout(attributed);
    window.location.href = attributed.checkoutUrl;
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.button className="lux-cart-backdrop" aria-label="Close bag" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <m.aside className="lux-cart" role="dialog" aria-modal="true" aria-label="Your bag" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 360, damping: 36 }}>
            <div className="lux-cart__head"><div><p>WYX / Your bag</p><h2>Bag <span>{String(cart?.totalQuantity || 0).padStart(2, '0')}</span></h2></div><button onClick={() => setOpen(false)} aria-label="Close bag"><X size={21} /></button></div>
            <CartPromoSummary cart={cart} />
            {error && <p className="lux-cart__error" role="alert">{error}</p>}
            <div className="lux-cart__body cart-scrollbar">
              {loading && !cart?.lines.length ? <div className="lux-cart__loading"><span /><span /><span /></div> : !cart?.lines.length ? (
                <div className="lux-cart__empty"><p>Nothing in the bag.<br />A clean slate.</p><span>Start with the picks that have already earned their place.</span><Link href="/products" onClick={() => setOpen(false)}>Shop the current edit</Link></div>
              ) : (
                <div className="lux-cart__lines">
                  {cart.lines.map((line) => (
                    <m.div className="lux-cart__line" key={line.id} layout>
                      <Link href={`/products/${line.merchandise.product.handle}`} onClick={() => setOpen(false)}>{line.merchandise.product.featuredImage && <Image src={line.merchandise.product.featuredImage.url} alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title} fill sizes="110px" />}</Link>
                      <div><Link href={`/products/${line.merchandise.product.handle}`} onClick={() => setOpen(false)}>{line.merchandise.product.title}</Link><p>{line.merchandise.title}</p><strong>{money(line.cost.totalAmount)}</strong><div className="lux-cart__qty"><button onClick={() => line.quantity > 1 ? update(line.id, line.quantity - 1) : remove(line.id)} aria-label="Decrease quantity"><Minus size={12} /></button><span>{line.quantity}</span><button onClick={() => update(line.id, line.quantity + 1)} aria-label="Increase quantity"><Plus size={12} /></button><button onClick={() => remove(line.id)}>Remove</button></div></div>
                    </m.div>
                  ))}
                </div>
              )}
              <CartCrossSell />
              {cart && <KitUpsellBanner subtotal={Number(cart.cost.subtotalAmount.amount)} compact />}
            </div>
            <div className="lux-cart__foot">
              {cart && <p><LockSimple size={13} /> Shipping options and delivery timing are confirmed before payment.</p>}
              <div><span>Subtotal</span><strong>{cart ? money(cart.cost.subtotalAmount) : '$0.00'}</strong></div>
              <button disabled={!cart?.checkoutUrl || loading} onClick={checkout}>{loading ? 'Updating bag…' : promo.applied ? 'Checkout — WYX10 Applied' : 'Secure checkout'}</button>
              <Link href="/cart" onClick={() => setOpen(false)}>View full bag</Link>
            </div>
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}
