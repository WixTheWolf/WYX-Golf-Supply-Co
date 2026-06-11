# Email Capture & Launch Flows

## What's Already Built

The storefront-side infrastructure for email capture is functional and does not need code changes to launch:

- `EmailCapture` (`components/EmailCapture.tsx`) is placed on ~30+ landing pages, each passing a unique `source` (e.g. `golf-gifts-for-beginners`) and `campaign` (e.g. `beginner_golf_gifts`) prop.
- Submissions hit `app/api/marketing/subscribe/route.ts`, which:
  1. Validates email format, requires explicit marketing consent, and rejects honeypot-filled bot submissions.
  2. Creates/updates a Shopify Customer with `emailMarketingConsent: SUBSCRIBED` and tags `wyx-email-subscriber`, `wyx-launch-list`, `wyx-source:<source>`, `wyx-campaign:<campaign>`.
  3. If `KLAVIYO_PRIVATE_API_KEY` and `KLAVIYO_LIST_ID` are set, also pushes the profile into a Klaviyo list with the same `source`/`campaign` properties.
  4. Falls back to a Shopify metaobject lead record (`$app:wyx_lead_capture`) if the customer-create call fails (e.g. missing `write_customers` scope), so no submission is silently lost.

This means **segmentation by acquisition page is already live** — every subscriber is tagged with exactly which landing page and campaign they signed up from, which is enough to run page-relevant follow-ups without any new code.

## What's Missing (Manual / Account Setup)

1. **Klaviyo account + API key**: `KLAVIYO_PRIVATE_API_KEY` and `KLAVIYO_LIST_ID` are blank in `.env.example`. Without them, subscribers land only as Shopify customers with marketing consent — usable for Shopify Email, but not for the flows below until Klaviyo (or Shopify Email flows) is configured.
2. **The actual flow content** — welcome series, bonus delivery, abandoned cart, post-purchase. None of this exists yet; it's email-platform configuration, not code.

## Recommended Flow Sequence

### 1. Welcome / Bonus Delivery (triggers on `wyx-email-subscriber` tag added)

This is the highest-leverage flow because it's what makes the email capture worth the signup in the first place. Per the binding constraints, none of these bonuses carry fabricated dollar values — they're framed as useful, not "free $47 gifts."

- **Email 1 (immediate)**: Deliver "The Bag Audit Checklist" — a short, practical checklist for what's actually in a golfer's bag vs. what's missing. Include the WYX10 code again (already shown on-site, but repetition in the inbox drives the actual redemption).
- **Email 2 (Day 2)**: Deliver "The Gift-Giver's Cheat Sheet" — useful for subscribers who came from gift-intent pages (`golf-gifts-for-*`); for subscribers from non-gift pages (e.g. `golf-club-care`), lead with the checklist instead and hold the cheat sheet for a later send. This is where the `source`/`campaign` tags pay off — segment the welcome series by acquisition intent rather than sending identical content to everyone.
- **Email 3 (Day 4-5)**: Feature the Weekend Golfer's Bag Upgrade Kit directly, framed around "The Bag Test" positioning. This is the conversion email — by now the subscriber has received two pieces of real value and a discount reminder.
- **Optional Email 4 (Day 7)**: "Optional Gift Reminder" — only relevant for subscribers tagged from gift-intent sources, framed as an opt-in reminder ahead of a relevant occasion (Father's Day, holidays, etc.) rather than generic urgency.

### 2. Abandoned Cart (requires Shopify Email or Klaviyo cart-recovery integration)

- Standard 3-email cadence (1hr / 24hr / 72hr) is appropriate. Keep WYX10 visible in at least one of the three — do not introduce a *second*, larger discount, since stacking discounts undermines the "WYX10 = the discount" consistency established sitewide.
- Copy should reference the specific abandoned product where possible (Shopify's native abandoned-checkout email already does this) — avoid generic "you forgot something" copy that could apply to any store.

### 3. Post-Purchase (order confirmation + follow-up)

- **Order confirmation**: Shopify's default transactional email, customized with WYX branding. No code changes needed beyond Shopify theme/notification settings (note: WYX uses Shopify checkout directly, so this is configured in Shopify Admin → Settings → Notifications, not in the Vercel storefront).
- **Day 14 follow-up**: A single "how's it going" email referencing The Bag Test Promise (30-day window) — reminds the customer the guarantee is real and gives a low-pressure path to contact support if something's wrong, before the 30-day window closes. This is a trust-reinforcement email, not an upsell.
- **No fake review requests**: per the binding constraint against fake testimonials, any review-request email must go to a real review platform (or be skipped entirely) — do not solicit reviews into a system that doesn't display them.

### 4. Launch Announcement (one-time, to existing `wyx-launch-list` tag)

- A single announcement email when the rebuilt site goes live, leading with the Bag Upgrade Kit and WYX10. Keep it short — the existing subscriber base (however small) is the easiest first-week revenue, and over-explaining the rebuild ("we redesigned everything!") is internal-facing framing that doesn't matter to the customer.

## Segmentation Reference

| Tag pattern | Meaning | Use for |
|---|---|---|
| `wyx-email-subscriber` | Any confirmed opt-in | Base list for all flows |
| `wyx-launch-list` | All subscribers (current single list) | Launch announcement |
| `wyx-source:<page>` | Which landing page they signed up from | Personalizing welcome series subject lines |
| `wyx-campaign:<name>` | Campaign grouping (e.g. `beginner_golf_gifts`, `wife_golf_gifts`) | Segmenting gift-intent vs. utility-intent subscribers for Email 2 |

## Net Assessment

The hard part (capture infrastructure, consent handling, tagging, Shopify/Klaviyo dual-write with fallback) is already built and doesn't block launch. The remaining work is entirely email-platform configuration: get a Klaviyo key (or commit to Shopify Email), write the 3-4 welcome emails using the bonus content already named in the brief, and configure Shopify's native abandoned-cart and order-confirmation emails. None of this requires further storefront code changes.
