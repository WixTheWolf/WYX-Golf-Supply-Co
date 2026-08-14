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

## 2026 motion edition comparison

The live production homepage and the motion build were captured at the same 1363 × 936 viewport and submitted together in one visual comparison input. Combined evidence: `/workspace/scratch/c91efa0a02b6/generated_images/exec-e1d03651-bcc7-43b8-a634-7ce537b33097.png` (1536 × 1024 px). This pass treats the current live site as the composition and brand reference while evaluating the requested film and motion layer.

| Priority | Finding | Resolution |
| --- | --- | --- |
| P1 | A global legacy heading rule forced the sticky editorial story title to ink on forest, creating materially low contrast. | Added an explicit paper-color story title and confirmed the computed color is `rgb(251, 248, 240)` in the live browser state. The dark Radar title received the same explicit treatment. |
| P2 | Continuous motion needed a user-controlled stop and a deliberate low-bandwidth fallback. | Added a labelled play/pause control; the film only hydrates on viewports above 760px and is disabled for reduced-motion and data-saver users. Mobile retains the art-directed static LCP image. |
| P2 | The first ticker implementation could settle at its final transform after hot replacement. | Moved the infinite editorial ticker to a compositor-only CSS keyframe with hover pause and an explicit reduced-motion stop. Browser sampling confirmed different transform matrices 650ms apart. |
| P2 | Quick add could visually report success after a failed cart request. | Changed `add` to return an explicit success boolean; the animated “Added to bag” acknowledgement now appears only after Shopify confirms the cart update. |
| P3 | Scroll observers warned when measuring a statically positioned story container, and Next flagged the smooth-scroll contract. | Made the story root positioned and declared `data-scroll-behavior="smooth"` on the document element. |

## Motion and interaction verification

- Field film: real 1600 × 900 H.264 MP4, 9.2 seconds, 1,586,089 bytes, muted, inline, looped, `preload="metadata"`, lightweight poster, and progressively crossfaded over the server-rendered LCP image.
- Playback: browser state reached readyState 4 and advanced continuously; the labelled control changed the media from playing to paused and back to playing.
- Hero choreography: masked two-line headline entrance, inset clip reveal, product-rail slide, cursor-reactive inset spring, and scroll-linked media depth use transform/opacity-first animation.
- Product interaction: pointer sampling produced a live 3D transform matrix and revealed the quick action at full opacity; touch layouts retain the always-visible 44px action.
- Editorial story: scrolling changed the active story from “The Long Game Rope Hat” to “The WYX Golf Hoodie”; the section progress meter resolved to a 0.5202 scale at the sampled midpoint.
- Route continuity: local product navigation rendered the cinematic PDP and the branded curtain completed at a zero-width transform instead of obstructing content.
- Motion accessibility: Framer Motion uses `reducedMotion="user"`; video and continuous animation are removed under `prefers-reduced-motion`; controls remain semantic and keyboard-focusable.
- Production build: 255 routes generated successfully; homepage route payload 5.92 kB, shared first-load JavaScript 103 kB, and total homepage first-load JavaScript 162 kB. The 1.6 MB film is not part of the JavaScript bundle and is requested only after hydration on eligible wide viewports.

## Final visual judgment

The split hero, lower-left display hierarchy, product rail, CTA positions, trust boundary, palette, typography, and editorial restraint remain continuous with the live reference. The motion build changes the hero from a product-texture still to a brand-world field film without changing the page’s buying hierarchy. The pause control is visible but subordinate, copy remains legible across every sampled film frame, and no actionable P0, P1, or P2 visual findings remain.

Final result: passed
