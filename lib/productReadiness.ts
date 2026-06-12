import type { Product } from '@/types/shopify';

const wyxText = /\bwyx\b|wyx golf|wyxgolf/i;
const colorWords = ['black', 'white', 'green', 'blue', 'navy', 'red', 'gray', 'grey', 'tan', 'cream', 'brown', 'orange', 'yellow', 'pink', 'purple'];

function mediaText(product: Product) {
  return [
    product.featuredImage?.url,
    product.featuredImage?.altText,
    ...(product.images || []).flatMap((image) => [image.url, image.altText])
  ].filter(Boolean).join(' ');
}

function variantColorValue(product: Product) {
  return product.variants
    .flatMap((variant) => variant.selectedOptions || [])
    .filter((option) => /color|colour/i.test(option.name))
    .map((option) => option.value)
    .filter(Boolean);
}

export function productReadinessFlags(product: Product) {
  const flags: string[] = [];
  const media = mediaText(product);
  const text = `${product.title} ${product.description} ${product.vendor || ''} ${product.productType || ''} ${(product.tags || []).join(' ')}`;
  const colors = variantColorValue(product);

  if (!product.featuredImage?.url && !product.images.length) flags.push('missing-image');
  if (product.vendor !== 'WYX Golf Supply Co.' && wyxText.test(media) && !wyxText.test(text)) flags.push('possibly-fake-wyx-image');
  if (colors.length > 1 && product.variants.some((variant) => !variant.image?.url)) flags.push('multi-color-needs-variant-images');
  if (colors.length === 1) {
    const onlyColor = colors[0].toLowerCase();
    const mediaLower = media.toLowerCase();
    const conflictingColor = colorWords.find((color) => color !== onlyColor && mediaLower.includes(color));
    if (conflictingColor && !mediaLower.includes(onlyColor)) flags.push('variant-color-image-mismatch');
  }
  if (/custom|personalized|embroidered|logo/i.test(text) && !/custom|personalized|embroidered|logo/i.test(product.description)) flags.push('customization-needs-clear-copy');
  return flags;
}

export function hasMisleadingProductMedia(product: Product) {
  const flags = productReadinessFlags(product);
  return flags.includes('possibly-fake-wyx-image') || flags.includes('variant-color-image-mismatch');
}

/**
 * Manually confirmed image/product mismatches that automated checks miss
 * (e.g. a WYX-vendor product whose featured image shows an unrelated item).
 * Reviewed via direct CDN image inspection.
 */
const knownImageMismatchHandles = new Set<string>([
  // Both tee products carry the same supplier photo of ALIGNMENT STICKS
  // (verified by direct CDN inspection 2026-06-12). Hidden until a correct
  // product image is attached in Shopify.
  'golf-tee-holder-bag-clip-10-tee',
  'golf-tee-dispenser-holder-50-tees'
]);

export function hasKnownImageMismatch(product: Product) {
  if (knownImageMismatchHandles.has(product.handle)) return true;
  return (product.tags || []).some((tag) => tag.toLowerCase().includes('placeholder-image'));
}
