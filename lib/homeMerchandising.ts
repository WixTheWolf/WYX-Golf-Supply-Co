import type { Product } from '@/types/shopify';

export function createProductAllocator() {
  const used = new Set<string>();

  return {
    take(products: Product[], count: number) {
      const picked: Product[] = [];
      for (const product of products) {
        if (used.has(product.handle)) continue;
        used.add(product.handle);
        picked.push(product);
        if (picked.length === count) break;
      }
      return picked;
    },
    mark(products: Product[]) {
      products.forEach((product) => used.add(product.handle));
    },
    has(product: Product) {
      return used.has(product.handle);
    }
  };
}

export function comingSoonCards(count: number, labels: string[]) {
  return Array.from({ length: Math.max(0, count) }, (_, index) => ({
    title: labels[index] || 'Coming Soon',
    body: 'Being sourced now. We will not list it until photos, shipping, margin, and fulfillment are confirmed.',
    cta: 'Join The List'
  }));
}

