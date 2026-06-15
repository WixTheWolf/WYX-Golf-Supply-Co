import type { Money } from '@/types/shopify';

export const WYX10_DISCOUNT = 0.1;

export function wyx10Price(amount: number | string) {
  return Number(amount) * (1 - WYX10_DISCOUNT);
}

export function formatPrice(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function priceWithWyx10(price: Money) {
  const base = Number(price.amount);
  return {
    base,
    sale: wyx10Price(base),
    currency: price.currencyCode,
    formattedBase: formatPrice(base, price.currencyCode),
    formattedSale: formatPrice(wyx10Price(base), price.currencyCode),
    savings: formatPrice(base - wyx10Price(base), price.currencyCode),
  };
}