import type { Cart } from '@/types/shopify';

export const launchCode = 'WYX10';

export function cartPromoState(cart: Cart | null) {
  const currency = cart?.cost.subtotalAmount.currencyCode || 'USD';
  const subtotal = Number(cart?.cost.subtotalAmount.amount || 0);
  const total = Number(cart?.cost.totalAmount.amount || subtotal);
  const applied = Boolean(
    cart?.discountCodes?.some((discount) => discount.code.toUpperCase() === launchCode && discount.applicable)
  );
  const savings = applied && total < subtotal ? subtotal - total : 0;
  return { code: launchCode, applied, savings, currency, subtotal, total };
}

export function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}