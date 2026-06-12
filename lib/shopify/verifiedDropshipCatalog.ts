import catalogJson from '@/data/verified-dropship-catalog.json';

export type VerifiedDropshipProduct = {
  handle: string;
  title: string;
  category: string;
  retailPrice: string;
  supplierCost: string;
  supplier: string;
  supplierUrl: string;
  supplierSku: string;
  imageUrl: string;
  imageAlt: string;
  imageVerified: boolean;
  status: 'active' | 'draft';
  usShipDays: string;
  tags: string[];
};

export type VerifiedDropshipCatalog = {
  updatedAt: string;
  fulfillmentPriority: string[];
  products: VerifiedDropshipProduct[];
};

export const verifiedDropshipCatalog = catalogJson as VerifiedDropshipCatalog;

export function getVerifiedProduct(handle: string) {
  return verifiedDropshipCatalog.products.find((p) => p.handle === handle);
}

export function categoryToProductType(category: string): string {
  const map: Record<string, string> = {
    Hats: 'Headwear',
    Accessories: 'Accessories',
    'Golf Balls': 'Golf Balls',
    Practice: 'Training Aids',
    'Swing Correction': 'Training Aids',
    Tech: 'Golf Tech',
  };
  return map[category] || 'Accessories';
}

export function categoryToCollection(category: string): string {
  const map: Record<string, string> = {
    Hats: 'hats',
    Accessories: 'accessories',
    'Golf Balls': 'golf-balls',
    Practice: 'golf-training-aids',
    'Swing Correction': 'golf-training-aids',
    Tech: 'golf-tech',
  };
  return map[category] || 'accessories';
}