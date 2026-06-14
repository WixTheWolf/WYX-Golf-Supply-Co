'use client';

import type { Cart } from '@/types/shopify';
import { cartPromoState, formatMoney } from '@/lib/cartPromo';
import { fathersDayDaysLeft, isFathersDayWindow } from '@/lib/fathersDay';

export function CartPromoSummary({ cart }: { cart: Cart | null }) {
  const promo = cartPromoState(cart);
  const daysLeft = fathersDayDaysLeft();
  const fathersDay = isFathersDayWindow();
  if (!cart?.lines.length) {
    return (
      <>
        <p className="promo-note">Use <strong>{promo.code}</strong> at checkout for 10% off your first order.</p>
        {fathersDay && <p className="promo-note" style={{ marginTop: '0.35rem' }}>Father&apos;s Day is June 21 — {daysLeft} day{daysLeft !== 1 ? 's' : ''} left.</p>}
      </>
    );
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