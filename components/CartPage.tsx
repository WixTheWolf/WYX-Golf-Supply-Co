'use client';

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

  return (
    <section className="page-hero">
      <p className="eyebrow">Your Bag</p>
      <h1>Ready For The Round?</h1>
      <CartPromoSummary cart={cart} />
      {error && <p className="error">{error}</p>}
      {!cart?.lines.length ? (
        <>
          <p>Your bag is empty. Start with the Bag Upgrade Kit or browse the current Short List.</p>
          <div className="actions" style={{ marginTop: '1rem' }}>
            <Link className="button primary" href="/weekend-golfer-bag-upgrade-kit?discount=WYX10">Shop The Kit</Link>
            <Link className="button secondary dark" href="/products">Shop The Short List</Link>
          </div>
        </>
      ) : (
        <div className="cart-page-lines">
          {cart.lines.map((line) => (
            <div className="cart-line wide" key={line.id}>
              {line.merchandise.product.featuredImage && <Image src={line.merchandise.product.featuredImage.url} alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title} width={110} height={110} />}
              <div>
                <h2>{line.merchandise.product.title}</h2>
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
          <KitUpsellBanner subtotal={Number(cart.cost.subtotalAmount.amount)} />
          <div className="cart-summary">
            <p className="promo-note">Shipping options, rates, and delivery estimates are confirmed before payment.</p>
            <p><span>Subtotal</span><strong>{money(cart.cost.subtotalAmount)}</strong></p>
            <button className="button primary" disabled={loading || !cart.checkoutUrl} onClick={() => {
              trackEvent('InitiateCheckout', {
                value: Number(cart.cost.subtotalAmount.amount),
                currency: cart.cost.subtotalAmount.currencyCode,
                num_items: cart.totalQuantity,
                content_ids: cart.lines.map((line) => line.merchandise.id)
              });
              window.location.href = cart.checkoutUrl;
            }}>{promo.applied ? 'Checkout — WYX10 Applied' : 'Secure Checkout'}</button>
          </div>
          <ShareWyx label="Almost done? Share WYX while you checkout" />
        </div>
      )}
    </section>
  );
}
