/**
 * Configures Meta tracking for WYX:
 * 1) Adds NEXT_PUBLIC_META_PIXEL_ID to Vercel production (if META_PIXEL_ID env is set)
 * 2) Prints Shopify Customer Events custom pixel snippet for checkout Purchase events
 *
 * Usage:
 *   META_PIXEL_ID=1234567890 npx tsx scripts/setup-meta-tracking.ts
 *   npx tsx --env-file .env.local scripts/setup-meta-tracking.ts
 */
import { execSync } from 'node:child_process';

const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;

function addVercelEnv(name: string, value: string) {
  execSync(`printf %s "${value.replace(/"/g, '\\"')}" | vercel env add ${name} production --force`, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
}

function customPixelSnippet(id: string) {
  return `// Shopify Admin → Settings → Customer events → Add custom pixel
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${id}');
fbq('track','PageView');
analytics.subscribe('product_viewed', (event) => {
  fbq('track','ViewContent', { content_ids: [event.data.productVariant.product.id], content_type: 'product', value: event.data.productVariant.price?.amount, currency: event.data.productVariant.price?.currencyCode });
});
analytics.subscribe('product_added_to_cart', (event) => {
  fbq('track','AddToCart', { content_ids: [event.data.cartLine.merchandise.product.id], content_type: 'product', value: event.data.cartLine.cost?.totalAmount?.amount, currency: event.data.cartLine.cost?.totalAmount?.currencyCode });
});
analytics.subscribe('checkout_started', () => { fbq('track','InitiateCheckout'); });
analytics.subscribe('checkout_completed', (event) => {
  fbq('track','Purchase', { value: event.data.checkout?.totalPrice?.amount, currency: event.data.checkout?.totalPrice?.currencyCode });
});`;
}

async function main() {
  if (!pixelId) {
    console.log('ℹ️  No META_PIXEL_ID set.');
    console.log('   Create a pixel in Shopify Admin → Sales channels → Facebook & Instagram → Settings → Share data settings → Create new');
    console.log('   Then rerun: META_PIXEL_ID=<your_id> npx tsx scripts/setup-meta-tracking.ts');
    process.exit(0);
  }

  console.log(`📡 Configuring Meta Pixel ${pixelId}...`);
  addVercelEnv('NEXT_PUBLIC_META_PIXEL_ID', pixelId);
  console.log('✅ Added NEXT_PUBLIC_META_PIXEL_ID to Vercel production');
  console.log('\n--- Shopify Customer Events custom pixel (paste in Admin) ---\n');
  console.log(customPixelSnippet(pixelId));
  console.log('\n--- Redeploy ---\n');
  console.log('Run: npx vercel --prod --yes');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});