import { NextResponse } from 'next/server';
import { categoryFor, saleReadyProducts, supplierName } from '@/lib/catalog';
import { escapeXml, productDescription, productUrl } from '@/lib/feed';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { getProducts } from '@/lib/shopify/products';
import { cleanText } from '@/lib/text';
import type { Product, ProductVariant } from '@/types/shopify';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SITE = 'https://wyxgolfsupply.com';

function variantId(variant: ProductVariant) {
  return variant.sku?.trim() || variant.id.replace('gid://shopify/ProductVariant/', 'wyx-variant-');
}

function productGroupId(product: Product) {
  return product.id.replace('gid://shopify/Product/', 'wyx-product-').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50);
}

function option(variant: ProductVariant, names: string[]) {
  const match = variant.selectedOptions?.find((item) => names.includes(item.name.toLowerCase().replace(/[_-]+/g, ' ').trim()));
  return match?.value?.trim() || '';
}

function variantTitle(product: Product, variant: ProductVariant) {
  const base = cleanText(product.title);
  const details = (variant.selectedOptions || [])
    .filter((item) => item.value && item.value !== 'Default Title' && item.name.toLowerCase() !== 'title')
    .map((item) => cleanText(item.value));
  return details.length ? `${base} - ${details.join(' / ')}` : base;
}

function itemXml(product: Product, variant: ProductVariant) {
  const image = variant.image?.url || product.featuredImage?.url || product.images[0]?.url || '';
  const description = productDescription(product) || `Shop ${cleanText(product.title)} at WYX Golf Supply Co.`;
  const size = option(variant, ['size', 'shoe size', 'waist']);
  const color = option(variant, ['color', 'colour']);
  const gtin = variant.barcode?.trim() || '';
  const category = categoryFor(product);
  const hasVariants = product.variants.filter((item) => !item.id.startsWith('demo-')).length > 1;

  return `
    <item>
      <g:id>${escapeXml(variantId(variant))}</g:id>
      <title>${escapeXml(variantTitle(product, variant))}</title>
      <description>${escapeXml(description)}</description>
      <link>${escapeXml(productUrl(product))}</link>
      <g:image_link>${escapeXml(image)}</g:image_link>
      <g:availability>${variant.availableForSale ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:condition>new</g:condition>
      <g:price>${Number(variant.price.amount).toFixed(2)} ${escapeXml(variant.price.currencyCode)}</g:price>
      <g:brand>${escapeXml(supplierName(product))}</g:brand>
      <g:google_product_category>Sporting Goods &gt; Outdoor Recreation &gt; Golf</g:google_product_category>
      <g:product_type>${escapeXml(category)}</g:product_type>
      ${hasVariants ? `<g:item_group_id>${escapeXml(productGroupId(product))}</g:item_group_id>` : ''}
      ${size ? `<g:size>${escapeXml(size)}</g:size>` : ''}
      ${color ? `<g:color>${escapeXml(color)}</g:color>` : ''}
      ${gtin ? `<g:gtin>${escapeXml(gtin)}</g:gtin>` : ''}
    </item>`;
}

export async function GET() {
  const products = coreMerchProducts(saleReadyProducts(await getProducts({ fresh: true })));
  const items = products.flatMap((product) =>
    product.variants
      .filter((variant) => !variant.id.startsWith('demo-'))
      .map((variant) => itemXml(product, variant))
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>WYX Golf Supply Co.</title>
    <link>${SITE}</link>
    <description>Premium golf apparel, gear, gifts and accessories selected by WYX.</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    }
  });
}
