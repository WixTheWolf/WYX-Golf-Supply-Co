# Meta Ad Creative Playbook — WYX Golf Supply Co.

**Account:** `mwixted1`  
**Ad account:** `act_47116609` → [Ads Manager](https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=47116609)  
**Pixel:** `2129816234251975` → [Events Manager](https://business.facebook.com/events_manager2/list/pixel/2129816234251975)  
**Landing pages:** `/lp/hidden-gems` (paid traffic, noindex) → canonical `/hidden-gems`  
**Code:** `lib/marketing/metaCampaigns.ts` · internal board: `/marketing/meta`  
**Storefront pixel:** `NEXT_PUBLIC_META_PIXEL_ID` on Vercel → `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`  
**Checkout pixel:** Shopify Admin → Customer events → custom pixel (Purchase)

---

## Campaign 1: Hidden Gems — Cart Life (TOFU)

| Field | Copy |
|-------|------|
| **Primary** | Your cart is missing three things: a phone mount that doesn't wobble, cup holders that actually hold tumblers, and an umbrella clip for surprise rain. WYX10 saves 10%. |
| **Headline** | Cart Upgrades Under $35 |
| **Description** | Phone mount, cup holders, umbrella clip |
| **CTA** | Shop Now |
| **URL** | `https://wyxgolfsupply.com/lp/hidden-gems?utm_source=facebook&utm_medium=paid_social&utm_campaign=meta_hidden_gems_cart` |

**Creative brief (static image):** Split screen — left: phone sliding off cart console (problem). Right: magnetic mount holding phone on cart frame (solution). Text overlay: "Cart upgrades under $35."

**15s video script:**
1. (0–3s) POV cart path — phone rattling in cupholder. Text: "Every cart has this problem."
2. (3–8s) Clamp mount install, phone locked. Text: "Magnetic mount. $34."
3. (8–12s) Silicone cup holders on frame. Text: "Cup holders that don't wobble."
4. (12–15s) Logo + WYX10. CTA: Shop Hidden Gems.

---

## Campaign 2: Backyard Practice (MOFU)

| Field | Copy |
|-------|------|
| **Primary** | No range trip required. Divot board, pop-up chipping net, putting arc — gear golfers buy after seeing a friend use it. WYX10 for 10% off. |
| **Headline** | Practice Gear Under $50 |
| **URL** | `...utm_campaign=meta_hidden_gems_train` |

**Creative:** Backyard clip — chipping net pop-up in 10 seconds. Overlay: "30-second setup. Real reps."

---

## Campaign 3: Bag Upgrade Kit (BOFU / retargeting)

| Field | Copy |
|-------|------|
| **Primary** | Four pieces. One kit. Fixes the annoyances in every weekend bag. WYX10 takes 10% off. |
| **Headline** | The Bag Upgrade Kit |
| **URL** | `/weekend-golfer-bag-upgrade-kit?utm_campaign=meta_bag_upgrade_kit` |

**Audience:** Site visitors 7d, AddToCart 14d, no Purchase.

---

## Campaign 4: Golf Gifts Under $60 (gift season)

| Field | Copy |
|-------|------|
| **Primary** | Shopping for a golfer? Skip the sleeve of balls. Useful gifts under $60 that earn a permanent bag spot. |
| **Headline** | Golf Gifts He'll Actually Use |
| **URL** | `/golf-gifts-under-60?utm_campaign=meta_gifts_under_60` |

---

## Campaign 5: Ball Retriever hook (single SKU)

| Field | Copy |
|-------|------|
| **Primary** | One pond save pays for this. 15ft retriever, bag-pocket size. WYX10 for 10% off. |
| **Headline** | Stop Paying the $4 Ball Tax |
| **URL** | `/lp/hidden-gems?utm_campaign=meta_ball_retriever` |

---

## Budget starter (week 1)

| Campaign | Daily budget | Goal |
|----------|--------------|------|
| Hidden Gems Cart | $15 | Purchases |
| Hidden Gems Train | $10 | Add to cart |
| Retarget Kit | $8 | Purchases |

**Kill rule:** CPA > 1.4× product gross margin after 3 days → pause ad set, swap creative.

---

## Tracking checklist

1. Add Meta Pixel ID to Vercel production env  
2. Shopify Admin → Settings → Customer events → connect Meta  
3. Verify events: PageView → ViewContent → AddToCart → InitiateCheckout → Purchase (Shopify)  
4. Use UTM campaigns above in Ads Manager for clean reporting