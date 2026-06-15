# WYX Tracking Setup

The storefront already loads analytics scripts when these Vercel environment variables are present:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_TIKTOK_PIXEL_ID`

All three (plus the Shopify and Klaviyo variables below) are listed in `.env.example` — copy that file to `.env.local` for local development and set the real values as Vercel Production env vars before launch.

## Implemented Storefront Events

`lib/analytics.ts` maps a single internal event name to the equivalent GA4, Meta Pixel, and TikTok Pixel event names, so each `trackEvent()` call fires on all three platforms at once:

| Internal name | GA4 | Meta Pixel | TikTok |
|---|---|---|---|
| `ViewContent` | `view_item` | `ViewContent` | `ViewContent` |
| `AddToCart` | `add_to_cart` | `AddToCart` | `AddToCart` |
| `InitiateCheckout` | `begin_checkout` | `InitiateCheckout` | `InitiateCheckout` |
| `Lead` | `generate_lead` | `Lead` | `SubmitForm` |
| `Purchase` | `purchase` | `Purchase` | `CompletePayment` |

Fired from:

- `ViewContent`: product page view through `ProductViewTracker`.
- `AddToCart`: single product add, kit add, and buy-now cart creation.
- `InitiateCheckout`: cart checkout and buy-now checkout (`CartPage.tsx`).
- `Lead`: email signup via `EmailCapture` → `/api/marketing/subscribe` (see [email-and-launch-flows.md](email-and-launch-flows.md)).
- `kit_click`: homepage kit button clicks (custom event, not mapped to the table above — passed through as-is).
- `Purchase`: **not currently fired from the storefront** — WYX uses Shopify's hosted checkout, so the purchase event must come from Shopify's own pixel/conversion integrations (see below), not from Vercel-side code.

## Email/CRM Tracking

- `KLAVIYO_PRIVATE_API_KEY`, `KLAVIYO_LIST_ID`, `KLAVIYO_API_REVISION` (in `.env.example`) enable the Klaviyo dual-write in `/api/marketing/subscribe`. Without these set, subscribers still land as Shopify customers with marketing consent and source/campaign tags — not lost, just not in Klaviyo.

## Stape CAPIG (Conversions API Gateway)

Server-side Meta events via Stape — improves match quality and deduplication.

| Setting | Value |
|---------|-------|
| Pixel | `2129816234251975` |
| CAPIG URL | `https://capig.stape.do` |
| Identifier | `tkduzrwn` |
| Admin | `mwixted1@gmail.com` |

**How it works:** Browser pixel on wyxgolfsupply.com fires normally. When the pixel is linked in the Stape CAPIG hub, each browser event is also forwarded server-side to Meta Conversions API (dedup is automatic).

**No storefront code change required** — keep `TrackingScripts.tsx` as-is.

**Verify (30 min after connect):**
1. Stape CAPIG hub → pixel `2129816234251975` → event count > 0
2. Meta Events Manager → pixel → Overview → browser + server events
3. Optional upgrade: Stape → Data Routing → custom domain `capig.wyxgolfsupply.com` (DNS CNAME)

Secrets in Vercel only: `META_CAPIG_URL`, `META_CAPIG_IDENTIFIER`, `META_CAPIG_API_KEY`.

## Manual Setup Still Needed

- Add the real GA4 measurement ID, Meta Pixel ID, and TikTok Pixel ID in Vercel Production env vars.
- Add `KLAVIYO_PRIVATE_API_KEY` and `KLAVIYO_LIST_ID` if Klaviyo is the chosen email platform (see [email-and-launch-flows.md](email-and-launch-flows.md)).
- **Purchase/conversion tracking**: connect GA4, Meta, and TikTok directly inside Shopify Admin → Settings → Customer events (or via each platform's Shopify app), since the `Purchase` event must fire from the Shopify checkout domain, not the Vercel storefront. The `lib/analytics.ts` event-name mapping above is provided so that if a future server-side or webhook-based purchase event is added, naming stays consistent across platforms.
- Place a low-price test order after pixels are connected and verify: `ViewContent` → `AddToCart` → `InitiateCheckout` (from Vercel/GA4/Meta/TikTok Events Manager) and `Purchase` (from Shopify's connected channels) all appear for the same session.
- Verify `Lead` events appear in GA4/Meta/TikTok after a test email signup, and confirm the resulting Shopify customer carries the expected `wyx-source:*` / `wyx-campaign:*` tags.
