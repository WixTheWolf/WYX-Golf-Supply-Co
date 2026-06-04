# WYX Conversion Audit

## Working

- Vercel is the customer-facing storefront and product pages use Shopify product handles, images, variants, prices, and checkout cart IDs.
- Add to Bag, Buy Now, cart quantity changes, and checkout all route through Shopify cart/checkout.
- `WYX10` is appended to checkout URLs from the cart and buy-now flows.
- Products without active status, images, or purchasable variants are filtered out of the public catalog.
- Product pages include canonical Vercel URLs, product schema, FAQ schema, mobile sticky buy-now, trust elements, and benefit-led bullets.
- GA4, Meta Pixel, and TikTok Pixel scripts are supported through Vercel env vars.

## Fixed In This Pass

- Removed customer-facing ops language like supplier-backed fulfillment, source of truth, live supplier inventory, and repeated Shopify checkout phrasing.
- Repositioned the homepage around useful golf gear for weekend players, golf dads, range regulars, gifts, and bag essentials.
- Prioritized lower-friction, giftable products on the homepage instead of leading with premium bags.
- Added buyer-intent landing pages for golf gifts, golf gifts for dad, bag essentials, weekend golfers, bachelor party golf gifts, and clean-contact kits.
- Added stronger WYX kits: Weekend Warrior, Clean Contact, Range Rat, Golf Dad Gift, 12-Handicap Survival, and Bachelor Party Bag.
- Added $75 free-shipping goal messaging in cart and cart drawer.
- Added About, FAQ, and tracking setup documentation.

## Broken Or Manual

- I cannot verify live pixel purchase events until the real GA4, Meta, and TikTok IDs are installed and a test order is placed.
- Shopify checkout/post-purchase branding must still be reviewed visually in Shopify admin.
- Custom domain routing still needs DNS confirmation: primary domain to Vercel, Shopify retained for checkout/backend.
- Draft Shopify products with placeholder images or no inventory should remain unpublished until real media and inventory are fixed.

## Next Revenue Moves

- Keep adding low-risk, useful products first: towels, markers, gloves, grip tape, balls, caddies, club-care tools, and headcovers.
- Use `/golf-gifts`, `/golf-gifts-for-dad`, `/bag-essentials`, and `/clean-contact-kit` as ad and social landing pages.
- Run daily content around “3 things every golf bag should have before Saturday morning” and link directly to kits or intent pages.
