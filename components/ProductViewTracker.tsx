'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import type { Money } from '@/types/shopify';

type ProductViewTrackerProps = {
  productId: string;
  variantId?: string;
  title: string;
  handle: string;
  price: Money;
  category: string;
};

export function ProductViewTracker({ productId, variantId, title, handle, price, category }: ProductViewTrackerProps) {
  useEffect(() => {
    trackEvent('ViewContent', {
      content_ids: [variantId || productId],
      content_name: title,
      content_type: 'product',
      item_id: productId,
      item_variant: variantId,
      item_name: title,
      item_category: category,
      handle,
      value: Number(price.amount),
      currency: price.currencyCode
    });
  }, [category, handle, price.amount, price.currencyCode, productId, title, variantId]);

  return null;
}
