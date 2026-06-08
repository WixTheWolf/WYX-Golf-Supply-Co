# WYX Golf Supply Co.

Headless Next.js storefront for the WYX Golf Supply Shopify store.

## Selling Flow

- Shopify Collective is the supplier layer for product imports, inventory sync, supplier fulfillment, and automatic supplier payments.
- Products approved and published in Shopify are discovered through the Storefront API.
- The storefront automatically lists available products, infers useful shopping categories, and fetches product details directly from Shopify.
- Cart creation, quantity updates, and removal use `/api/cart`.
- Checkout redirects to the Shopify checkout URL, so this app never handles payment details directly.

Supplier discovery and initial imports remain in Shopify Collective. A daily curator then checks imported Shopify products and automatically activates, tags, and publishes qualified golf listings. It rejects off-category products, missing images, missing suppliers, and prices outside the configured range.

## Catalog Health

`GET /api/health/catalog` returns the current sellable product count and category totals.

`GET /api/health/public-commerce` confirms that the Storefront API and modern Admin API client credentials are configured without exposing secret values.

`GET /api/cron/catalog-curator` is called daily by Vercel with `CRON_SECRET`. Set `WYX_AUTO_PUBLISH=true` to apply qualified product updates. When false, it reports proposed actions without changing Shopify.

## Environment Variables

Set these in Vercel and locally in `.env.local`:

```sh
SHOPIFY_STORE_DOMAIN=wyxgolfsupply.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_CLIENT_ID=
SHOPIFY_CLIENT_SECRET=
SHOPIFY_API_VERSION=2026-01
CRON_SECRET=
WYX_AUTO_PUBLISH=true
```

If Storefront API variables are missing, the site builds with non-purchasable demo product data.

## Shopify Collective Workflow

1. Review or connect suppliers in Shopify Collective Discovery.
2. Import candidate golf products from the supplier catalog.
3. The daily WYX curator scores imported products and publishes qualified listings.
4. The storefront picks up newly published products automatically.
5. Use `/api/health/catalog` to verify sellable product totals.

## Local Development

```sh
npm install
npm run dev
```

## Verification

```sh
npm run build
```

### Optional ECC plugin setup

If you use an environment that supports the plugin marketplace, you can add the ECC plugin and install it with:

```sh
/plugin marketplace add https://github.com/affaan-m/ECC
/plugin install ecc@ecc
```

A helper script is also available at `scripts/install-ecc-plugin.sh`.

> Note: the current shell environment does not expose a `plugin` CLI command, so I could not run those commands here.

The live storefront is deployed to `https://wyx-golf-supply-co.vercel.app`.
