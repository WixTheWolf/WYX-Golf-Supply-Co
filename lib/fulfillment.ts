import { getVerifiedProduct } from '@/lib/shopify/verifiedDropshipCatalog';
import type { Product } from '@/types/shopify';

export function fulfillmentShipEstimate(product: Product): string | null {
  const verified = getVerifiedProduct(product.handle);
  if (verified?.usShipDays) return verified.usShipDays;

  const tags = product.tags || [];
  if (tags.includes('fulfillment-us') || tags.includes('supplier-spocket')) return '2-5';
  if (tags.includes('fulfillment-topdawg')) return '2-5';
  if (tags.includes('fulfillment-collective')) return '3-7';
  if (tags.includes('fulfillment-aliexpress') || tags.includes('supplier-dsers')) return '7-12';
  if (tags.includes('fulfillment-wholesale')) return '3-5';

  return null;
}

export function fulfillmentTrustLabel(product: Product): string | null {
  const days = fulfillmentShipEstimate(product);
  if (!days) return null;
  return `Ships in ${days} business days (US)`;
}