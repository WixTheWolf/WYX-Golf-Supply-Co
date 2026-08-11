'use client';

import type { Cart } from '@/types/shopify';
import { cartPromoState, formatMoney } from '@/lib/cartPromo';

export function CartPromoSummary({ cart }: { cart: Cart | null }) {
  const promo = cartPromoState(cart);

  if (!cart?.lines.length) {
    return <p className="promo-note">First order? Use <strong>{promo.code}</strong> for the advertised 10% offer.</p>;
  }

  if (promo.applied && promo.savings > 0) {
    return (
      <p className="promo-note promo-applied">
        <strong>{promo.code} applied</strong> — you save {formatMoney(promo.savings, promo.currency)}.
      </p>
    );
  }

  if (promo.applied) {
    return <p className="promo-note promo-applied"><strong>{promo.code} applied</strong> — Shopify will confirm the final discount at checkout.</p>;
  }

  return <p className="promo-note"><strong>{promo.code}</strong> was not applied automatically. Enter it at checkout if this is your first order.</p>;
}
