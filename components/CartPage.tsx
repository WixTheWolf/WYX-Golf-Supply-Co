'use client';

import Image from 'next/image';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { money } from '@/lib/demo';
import { useCart } from './CartProvider';

const launchCode = 'WYX10';

export function CartPage() {
  const { cart, loading, error, update, remove } = useCart();
  return (
    <section className="page-hero">
      <p className="eyebrow">Your Bag</p>
      <h1>Ready For The Round?</h1>
      <p className="promo-note">Launch code <strong>{launchCode}</strong> saves 10% at checkout.</p>
      {error && <p className="error">{error}</p>}
      {!cart?.lines.length ? (
        <p>Your bag is empty. <Link className="text-link" href="/products">Explore the supply room</Link>.</p>
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
          <div className="cart-summary">
            <p><span>Subtotal</span><strong>{money(cart.cost.subtotalAmount)}</strong></p>
            <button className="button primary" disabled={loading} onClick={() => {
              trackEvent('InitiateCheckout', {
                value: Number(cart.cost.subtotalAmount.amount),
                currency: cart.cost.subtotalAmount.currencyCode,
                num_items: cart.totalQuantity,
                content_ids: cart.lines.map((line) => line.merchandise.id)
              });
              window.location.href = checkoutUrlWithDiscount(cart.checkoutUrl);
            }}>Checkout With WYX10</button>
          </div>
        </div>
      )}
    </section>
  );
}

function checkoutUrlWithDiscount(checkoutUrl: string) {
  const url = new URL(checkoutUrl);
  url.searchParams.set('discount', launchCode);
  return url.toString();
}
