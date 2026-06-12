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
  // Catalog-wide duplicate-image audit, 2026-06-12: an image-fix script mapped
  // one supplier photo to multiple unrelated products. Every handle below was
  // verified by direct CDN image inspection to show the WRONG product.
  // Hidden until a correct image is attached in Shopify (restoring unhides).
  'golf-tee-holder-bag-clip-10-tee', // shows alignment sticks
  'golf-tee-dispenser-holder-50-tees', // shows alignment sticks
  'golf-ball-personalized-stamp-initial', // shows alignment sticks
  'putting-alignment-mirror-folding-tour', // shows alignment sticks
  'golf-alignment-board-foot-trainer', // shows alignment sticks
  'golf-shoe-travel-bag-ventilated-divider', // shows towels
  'spocket-golf-rope-cap', // shows plain trucker cap, no rope
  'uv-sun-gaiter-golf-upf50', // shows swing-arm trainer band
  'golf-putting-gate-set-2-precision-gates', // shows auto-return putting mat
  'golf-swing-speed-trainer-weighted-stick', // shows posture band
  'golf-arm-sleeve-uv-protection-pair', // shows posture band
  'windproof-cart-umbrella-holder', // shows umbrella, not holder
  'golf-travel-essentials-bundle', // shows umbrella
  'extendable-ball-retriever-15ft', // shows hitting net
  'golf-cart-organizer-bag-6-pocket-panel', // shows hitting net
  'golf-cart-organizer-caddie-6-pocket', // shows hitting net
  'golf-practice-ball-set-12-foam-airflow', // shows ball-collection net
  'divot-board-swing-trainer', // shows impact-label driver face
  'yardage-book-holder-clip-on-scorecard', // shows impact-label driver face
  'golf-scorecard-pencil-set-12-erasers', // shows impact-label driver face
  'night-golf-glow-ball-set-12-led-core', // shows impact-label driver face
  'cord-golf-grip-regrip-kit-13-grips', // shows impact-label driver face
  'golf-glove-holder-dryer-clip', // shows glove pair
  'golf-compression-sock-set-3-pair', // shows glove pair
  'golf-rangefinder-case-magnetic-clip', // shows rangefinder, not case
  'mallet-putter-headcover-tour-knit', // shows gloves
  'driver-head-cover-knit-pom-pom-vintage', // shows gloves
  'performance-golf-polo-moisture-wicking', // shows gloves
  'iron-head-cover-set-4-piece', // shows gloves
  'golf-shoe-cleaning-kit-brush-spray', // shows groove-sharpener pens
  'putter-grip-pistol-jumbo-oversize', // shows groove-sharpener pens
  'switchblade-fork-divot-tool-one-click', // shows groove-sharpener pens
  'dual-sided-golf-club-brush-groove-pick', // shows groove-sharpener pens
  'stainless-golf-flask-8oz-ball-marker-lid', // shows towels
  'golf-quarter-zip-pullover-thermal', // shows glove 3-pack
  'golf-spike-wrench-cleat-kit-20' // shows groove-sharpener pens
]);

export function hasKnownImageMismatch(product: Product) {
  if (knownImageMismatchHandles.has(product.handle)) return true;
  return (product.tags || []).some((tag) => tag.toLowerCase().includes('placeholder-image'));
}
