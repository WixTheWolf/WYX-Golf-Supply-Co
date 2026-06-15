import { imageMap } from '@/lib/starterProducts';

/** Category lifestyle / flat-lay fallbacks when Shopify has only supplier photos. */
const categoryLifestyle: Record<string, string> = {
  Headwear: imageMap.ropeHat,
  Apparel: imageMap.polo,
  Towels: imageMap.towel,
  Accessories: imageMap.leather,
  'Club Care': imageMap.care,
  'Training Aids': imageMap.iron,
  Grips: imageMap.care,
  Gloves: imageMap.leather,
};

const handleLifestyle: Record<string, string> = {
  'tri-fold-microfiber-golf-towel': imageMap.towel,
  'weekend-golfer-bag-upgrade-kit': imageMap.walk,
};

export function lifestyleImagesFor(handle: string, category: string, productImages: string[]) {
  const lifestyle = handleLifestyle[handle] || categoryLifestyle[category] || imageMap.leather;
  const unique = new Set(productImages.filter(Boolean));
  if (!unique.has(lifestyle)) unique.add(lifestyle);
  return [...unique].slice(0, 4);
}