/**
 * PDP galleries must only show images that belong to the actual product.
 * Lifestyle/editorial photography can live elsewhere on WYX, but it must never
 * be injected into a sellable product gallery unless the supplier/product data
 * explicitly provides it for that product.
 */
export function lifestyleImagesFor(_handle: string, _category: string, productImages: string[]) {
  return [...new Set(productImages.filter(Boolean))].slice(0, 6);
}
