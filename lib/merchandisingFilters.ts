import { categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { isPremiumGolfBag } from '@/lib/productQuality';
import type { Product } from '@/types/shopify';

const hiddenHandles = new Set([
  'syb-phone-pouch'
]);

const confirmedSupplierVendors = [
  'Blue Ridge Golf Co.',
  'Pins and Aces',
  'Stick Grips',
  'VukGripz',
  'VivanTee Golf',
  'OnPointGolf.us',
  "SHOCK'D Golf Balls"
];

export function isHiddenFromCoreStorefront(product: Product) {
  return hiddenHandles.has(product.handle);
}

export function isConfirmedSupplierProduct(product: Product) {
  return (product.vendor ? confirmedSupplierVendors.includes(product.vendor) : false) || product.handle === 'tri-fold-microfiber-golf-towel';
}

export function isCoreMerchProduct(product: Product) {
  return !isHiddenFromCoreStorefront(product) && !isPremiumGolfBag(product) && isConfirmedSupplierProduct(product);
}

export function coreMerchProducts(products: Product[]) {
  return products.filter(isCoreMerchProduct);
}

export function firstBuyProducts(products: Product[]) {
  const heroHandles = new Set([
    'tri-fold-microfiber-golf-towel',
    'blue-ridge-golf-co-golf-towels',
    'two-sided-metal-golf-ball-marker-5-color-combo-pack',
    'glove-accessory-caddie-gray',
    'magnet-caddie',
    'shockd-golf-balls'
  ]);
  return products.filter((product) => heroHandles.has(product.handle));
}

export function giftableProducts(products: Product[], limit = 12) {
  return products
    .filter((product) => Number(productPrice(product).amount) <= 60)
    .slice(0, limit);
}

export function bagUpgradeProducts(products: Product[], limit = 12) {
  return products
    .filter((product) => ['Golf Balls', 'Gloves', 'Grips', 'Towels', 'Accessories', 'Club Care'].includes(categoryFor(product)))
    .slice(0, limit);
}

export function tripProducts(products: Product[], limit = 12) {
  return products
    .filter((product) => /marker|towel|ball|caddie|glove|grip|headcover/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`))
    .slice(0, limit);
}
