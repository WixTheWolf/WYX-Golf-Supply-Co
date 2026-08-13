# WYX Redesign — Design QA

Reference: selected Direction 2 visual (`exec-34197bb1-b4f7-43fa-8c9c-cdc7f24c8bcf.png`)

Viewport: 1363 × 936 desktop, homepage at top of page. The source and implementation were inspected together in two comparison passes.

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

## Functional verification

- Homepage, shop, and product detail routes render without application console errors in a clean browser session.
- Cart drawer opens, closes, reports empty state, and exposes the disabled checkout state correctly.
- Shop renders 35 local catalog cards across 11 visible category filters; production remains Shopify-driven.
- Product detail navigation renders the cinematic gallery and purchasing panel.
- Accessibility spot check: one H1, one main landmark, no duplicate IDs, no unnamed buttons or links, no missing image alt attributes, and no horizontal overflow at the verified desktop viewport.
- Production build: 255 routes generated successfully; homepage route payload 3.68 kB, shared first-load JavaScript 103 kB.

Final result: passed
