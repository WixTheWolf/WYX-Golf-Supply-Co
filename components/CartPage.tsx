'use client';

import { LockSimple, Minus, Plus } from '@phosphor-icons/react';
import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CartPromoSummary } from '@/components/CartPromoSummary';
import { KitUpsellBanner } from '@/components/KitUpsellBanner';
import { ShareWyx } from '@/components/ShareWyx';
import { trackEvent } from '@/lib/analytics';
import { cartPromoState } from '@/lib/cartPromo';
import { money } from '@/lib/demo';
import { useCart } from './CartProvider';

export function CartPage() {
  const { cart, loading, error, update, remove } = useCart();
  const promo = cartPromoState(cart);

  function checkout() {
    if (!cart?.checkoutUrl) return;
    trackEvent('InitiateCheckout', { value: Number(cart.cost.subtotalAmount.amount), currency: cart.cost.subtotalAmount.currencyCode, num_items: cart.totalQuantity, content_ids: cart.lines.map((line) => line.merchandise.id) });
    window.location.href = cart.checkoutUrl;
  }

  return (
    <main className="lux-cart-page">
      <header><p className="lux-kicker">Your bag / WYX</p><h1 className="lux-display">Ready for<br />the round?</h1><CartPromoSummary cart={cart} /></header>
      {error && <p className="lux-cart-page__error" role="alert">{error}</p>}
      {!cart?.lines.length ? (
        <section className="lux-cart-page__empty"><p>A clean bag.<br />Plenty of room.</p><span>Start with the current WYX edit—pieces selected because they are useful, good-looking, or ideally both.</span><div><Link className="lux-button-dark" href="/products">Shop the current edit</Link><Link className="lux-link" href="/the-bag-test">How WYX picks</Link></div></section>
      ) : (
        <div className="lux-cart-page__layout">
          <section className="lux-cart-page__lines">
            {cart.lines.map((line, index) => (
              <m.article key={line.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }}>
                <Link href={`/products/${line.merchandise.product.handle}`}>{line.merchandise.product.featuredImage && <Image src={line.merchandise.product.featuredImage.url} alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title} fill sizes="180px" />}</Link>
                <div><p>WYX pick / {String(index + 1).padStart(2, '0')}</p><h2>{line.merchandise.product.title}</h2><span>{line.merchandise.title}</span><strong>{money(line.cost.totalAmount)}</strong><div><button onClick={() => line.quantity > 1 ? update(line.id, line.quantity - 1) : remove(line.id)} aria-label="Decrease quantity"><Minus size={13} /></button><b>{line.quantity}</b><button onClick={() => update(line.id, line.quantity + 1)} aria-label="Increase quantity"><Plus size={13} /></button><button onClick={() => remove(line.id)}>Remove</button></div></div>
              </m.article>
            ))}
          </section>
          <aside className="lux-cart-page__summary"><p className="lux-kicker">Order summary</p><div><span>Subtotal</span><strong>{money(cart.cost.subtotalAmount)}</strong></div><p><LockSimple size={13} /> Shipping and delivery timing appear before payment.</p><button disabled={loading || !cart.checkoutUrl} onClick={checkout}>{loading ? 'Updating…' : promo.applied ? 'Checkout — WYX10 Applied' : 'Secure checkout'}</button><Link href="/products">Keep shopping</Link><KitUpsellBanner subtotal={Number(cart.cost.subtotalAmount.amount)} /><ShareWyx label="Share WYX with a playing partner" /></aside>
        </div>
      )}
    </main>
  );
}
