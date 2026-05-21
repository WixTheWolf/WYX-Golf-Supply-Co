# WYX Golf Supply Co.

Premium Next.js + Shopify Storefront API ecommerce site for WYX Golf Supply Co.

## Shopify Products

Create Shopify products with these exact handles:

- `long-game-rope-hat`
- `fairway-polo`
- `waffle-golf-towel`
- `leather-bag-tag`
- `club-care-kit`
- `wyx-golf-ball-set`

Recommended collections:

- `headwear`
- `apparel`
- `golf-gear`
- `accessories`
- `club-care`
- `core-collection`

Each product should have at least one active variant, a product image, description, price, and availability enabled for the Online Store / Storefront API sales channel.

## Environment Variables

Set these in Vercel and locally in `.env.local`:

```sh
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
NEXT_PUBLIC_SHOPIFY_API_VERSION=2026-01
```

If these variables are missing, the site builds with demo product data. Demo mode intentionally disables Add to Cart because real checkout requires Shopify.

## Storefront API Token

In Shopify Admin:

1. Go to **Settings → Apps and sales channels**.
2. Create or open a custom app.
3. Enable Storefront API access.
4. Grant access to products, collections, and cart/checkout capabilities.
5. Copy the Storefront access token into Vercel.

## Cart and Checkout Flow

- Product pages fetch Shopify products by handle.
- Add to Cart calls `/api/cart`.
- If no cart exists, the API creates a Shopify cart.
- If a cart exists, the API adds lines to the existing cart.
- Cart ID is stored in `localStorage`.
- Cart drawer and `/cart` can update quantities and remove lines.
- Checkout redirects to Shopify `cart.checkoutUrl`.

## Vercel Deployment

The project is a standard Next.js app. Vercel should detect Next.js automatically. `vercel.json` sets:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build"
}
```

Add the Shopify environment variables in **Vercel → Project Settings → Environment Variables** for Production and Preview.

## Test Checkout

1. Add the env vars.
2. Confirm each required Shopify product handle exists.
3. Deploy to Vercel.
4. Open a product page.
5. Click Add to Cart.
6. Confirm the cart drawer opens with the correct line item.
7. Update quantity and remove items.
8. Click Checkout and confirm redirect to Shopify checkout.

## SEO

Implemented:

- Metadata for homepage, products, product pages, story, journal, articles, cart, and policy pages.
- `robots.txt` via `app/robots.ts`.
- `sitemap.xml` via `app/sitemap.ts`.
- Product schema placeholders using Shopify product data.
- Article schema for journal posts.
- Descriptive image alt text and clean internal links.

## Analytics Placeholders

Recommended integrations before launch:

- Google Analytics 4: add measurement script in `app/layout.tsx` or through Vercel/Tag Manager.
- Meta Pixel: add via a consent-aware script component.
- TikTok Pixel: add only if paid social is active.
- Klaviyo: replace the newsletter placeholder with a Klaviyo embedded form or API-backed signup.

## Images

The repo currently contains WYX brand images as `.png` files in `public/images/`. If `.jpg` versions are added later, update `lib/demo.ts` image paths and Shopify product media accordingly.
