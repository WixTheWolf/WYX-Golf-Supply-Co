import { availableProducts } from '@/lib/catalog';
import { escapeXml, productFeedItem, siteUrl } from '@/lib/feed';
import { getProducts } from '@/lib/shopify/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = availableProducts(await getProducts()).map(productFeedItem).filter((product) => product.image);
  const updated = new Date().toISOString();
  const items = products.map((product) => `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <title>${escapeXml(product.title)}</title>
      <description>${escapeXml(product.description)}</description>
      <link>${escapeXml(product.link)}</link>
      <g:link>${escapeXml(product.link)}</g:link>
      <g:image_link>${escapeXml(product.image)}</g:image_link>
      <g:availability>${product.availability}</g:availability>
      <g:price>${escapeXml(product.price)}</g:price>
      <g:condition>${product.condition}</g:condition>
      <g:brand>${escapeXml(product.brand)}</g:brand>
      <g:product_type>${escapeXml(product.productType)}</g:product_type>
      <g:google_product_category>${escapeXml(product.googleProductCategory)}</g:google_product_category>
      <g:identifier_exists>false</g:identifier_exists>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>WYX Golf Supply Co. Product Feed</title>
    <link>${siteUrl}</link>
    <description>Live supplier-backed golf products from WYX Golf Supply Co.</description>
    <lastBuildDate>${updated}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600'
    }
  });
}
