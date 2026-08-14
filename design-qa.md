# WYX Redesign — Design QA

Reference: selected Direction 2 visual (`/workspace/scratch/c91efa0a02b6/generated_images/exec-34197bb1-b4f7-43fa-8c9c-cdc7f24c8bcf.png`, 1487 × 1058 px).

Implementation comparison evidence: `/workspace/scratch/c91efa0a02b6/generated_images/exec-83e1784e-b83b-42a9-8405-b5b28ea33efb.png` (1536 × 1024 px comparison board containing the browser-rendered implementation).

Viewport: 1363 × 936 CSS px at device-pixel ratio 1, homepage at top of page. The source and implementation were inspected together in two comparison passes. The comparison board normalizes both captures into one image; focused regions cover the hero headline, inset, product rail, CTAs, and first-section boundary.

## Pass 1 findings

| Priority | Finding | Resolution |
| --- | --- | --- |
| P1 | Hero LCP image was visually covered by an unintended stacking context. | Removed transform ownership from the image layer and made layer order explicit. |
| P1 | Headline scale pushed editorial copy and first conversion action too low. | Reduced desktop display scale and hero height; restored supporting copy and dual CTA. |
| P1 | Inset read as a tall product card instead of the reference's editorial detail crop. | Changed to a horizontal 1.52:1 crop with a restrained brass rule. |
| P2 | First purchasable content did not appear early enough. | Reduced hero height and retained the compact trust strip at the fold. |
| P2 | Demo catalog fallback left the local prototype visually empty. | Enabled realistic non-purchasable demo merchandising while production continues to use live Shopify data. |

## Final comparison

| Check | Result |
| --- | --- |
| Split hero and narrow product rail | Pass |
| Headline hierarchy and lower-left placement | Pass |
| Horizontal inset detail | Pass |
| Supporting copy and dual CTA | Pass |
| Next-section visibility | Pass |

## Responsive spacing hardening

| Priority | Finding | Resolution | Post-fix evidence |
| --- | --- | --- | --- |
| P2 | A legacy mobile rule reserved `92px` below every route, including pages without a sticky purchase bar. | Reset the global body padding through `650px`; the PDP panel continues to reserve its own purchase-bar space. | The active media path now resolves `body` to `padding-bottom: 0`; the production build completes across all 255 routes. |
| P2 | Display minimums were too large for several 320–360px content wells, risking clipped words in the Radar, Manifesto, newsletter, and Shop hero. | Added narrow-screen optical caps and a wrapped hero-action layout. | All narrow-screen display clamps now resolve between `48px` and `60px` at 320px, with 20–24px page gutters and no fixed-width text container. |
| P2 | Menu, bag, quick-add, and footer links did not consistently meet a comfortable mobile target size. | Set primary navigation and commerce controls to a minimum `44px` target and added safe-area padding to the sticky purchase control. | Component and media-query rules explicitly enforce `44px` minimum dimensions. |
| P3 | The decorative hero inset competed with the LCP image for preload priority. | Kept high priority only on the primary hero image. | The inset now remains responsive but lazy-loads normally. |

The responsive hardening did not change the desktop hero composition compared above. Page gutters now interpolate from 20px to 64px and section spacing from 80px to 144px, avoiding abrupt density changes between phone, tablet, laptop, and wide-desktop widths.

## Functional verification

- Homepage, shop, and product detail routes render without application console errors in a clean browser session.
- Cart drawer opens, closes, reports empty state, and exposes the disabled checkout state correctly.
- Shop renders 35 local catalog cards across 11 visible category filters; production remains Shopify-driven.
- Product detail navigation renders the cinematic gallery and purchasing panel.
- Accessibility spot check: one H1, one main landmark, no duplicate IDs, no unnamed buttons or links, no missing image alt attributes, and no horizontal overflow at the verified desktop viewport.
- Fresh post-hardening browser render: 1363 × 936 CSS px, DPR 1, 1348px document width, one H1, one main landmark, no unintended horizontal overflow, and no application console errors.
- Primary interactions retested: cart drawer open/close, homepage navigation, gallery and purchase-panel rendering, loading/empty states, and live Shopify-backed PDP controls.
- Production build: 255 routes generated successfully; homepage route payload 3.68 kB, shared first-load JavaScript 103 kB.

## Remaining findings

No actionable P0, P1, or P2 findings remain. A fresh raster capture at every physical handset size is not necessary for the unchanged art direction; the narrow-screen pass is governed by explicit fluid tokens, media constraints, safe-area rules, and minimum target sizes.

Final result: passed
