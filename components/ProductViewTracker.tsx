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
  brand?: string;
  imageUrl?: string;
};

export function ProductViewTracker({ productId, variantId, title, handle, price, category, brand, imageUrl }: ProductViewTrackerProps) {
  useEffect(() => {
    const value = Number(price.amount);
    const itemId = variantId || productId;
    trackEvent('ViewContent', {
      content_ids: [itemId],
      content_name: title,
      content_type: 'product',
      item_id: productId,
      item_variant: variantId,
      item_name: title,
      item_category: category,
      item_brand: brand,
      handle,
      value,
      currency: price.currencyCode,
      items: [{
        item_id: itemId,
        item_name: title,
        item_category: category,
        item_brand: brand,
        item_variant: variantId,
        price: value,
        quantity: 1
      }],
      klaviyo: {
        ProductID: productId,
        ProductName: title,
        SKU: variantId,
        Categories: [category],
        Brand: brand,
        Price: value,
        ImageURL: imageUrl,
        URL: window.location.href
      }
    });
  }, [brand, category, handle, imageUrl, price.amount, price.currencyCode, productId, title, variantId]);

  return null;
}
