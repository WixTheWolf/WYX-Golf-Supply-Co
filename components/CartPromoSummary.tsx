'use client';

import type { Cart } from '@/types/shopify';
import { cartPromoState, formatMoney } from '@/lib/cartPromo';

export function CartPromoSummary({ cart }: { cart: Cart | null }) {
  const promo = cartPromoState(cart);
  if (!cart?.lines.length) {
    return <p className="promo-note">Use <strong>{promo.code}</strong> at checkout for 10% off your first order.</p>;
  }
  if (promo.applied && promo.savings > 0) {
    return (
      <p className="promo-note promo-applied">
        <strong>{promo.code} applied</strong> — you save {formatMoney(promo.savings, promo.currency)} at checkout.
      </p>
    );
  }
  if (promo.applied) {
    return <p className="promo-note promo-applied"><strong>{promo.code} applied</strong> — discount confirms at checkout.</p>;
  }
  return <p className="promo-note"><strong>{promo.code}</strong> will be applied at checkout for 10% off your first order.</p>;
}