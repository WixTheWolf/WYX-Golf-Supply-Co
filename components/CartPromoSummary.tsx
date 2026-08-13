'use client';

import type { Cart } from '@/types/shopify';
import { cartPromoState, formatMoney } from '@/lib/cartPromo';

export function CartPromoSummary({ cart }: { cart: Cart | null }) {
  const promo = cartPromoState(cart);

  if (!cart?.lines.length) {
    return <p className="promo-note">New to WYX? Try <strong>{promo.code}</strong> for 10% off your first order.</p>;
  }

  if (promo.applied && promo.savings > 0) {
    return (
      <p className="promo-note promo-applied">
        <strong>{promo.code} applied</strong> — you save {formatMoney(promo.savings, promo.currency)}.
      </p>
    );
  }

  if (promo.applied) {
    return <p className="promo-note promo-applied"><strong>{promo.code} applied.</strong></p>;
  }

  return <p className="promo-note">New to WYX? Enter <strong>{promo.code}</strong> at checkout for 10% off your first order.</p>;
}
