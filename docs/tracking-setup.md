# WYX Tracking Setup

The storefront already loads analytics scripts when these Vercel environment variables are present:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_TIKTOK_PIXEL_ID`

Implemented storefront events:

- `ViewContent`: product page view through `ProductViewTracker`.
- `AddToCart`: single product add, kit add, and buy-now cart creation.
- `InitiateCheckout`: cart checkout and buy-now checkout.
- `kit_click`: homepage kit button clicks.

Manual setup still needed:

- Add the real GA4 measurement ID, Meta Pixel ID, and TikTok Pixel ID in Vercel Production env vars.
- Connect the same pixels/channels inside Shopify admin where available so checkout and purchase events can be attributed after the hosted checkout.
- Place a low-price test order after pixels are connected and verify purchase attribution in Shopify, GA4, Meta Events Manager, and TikTok Events Manager.
