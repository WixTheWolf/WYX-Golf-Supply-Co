# WYX Cinematic Homepage — Design QA

## Target and method

- Reference: `docs/design-source-cinematic-home.webp` (selected WYX contact-sheet direction).
- Implementation: homepage at a 1363 × 936 desktop viewport plus a 390 × 844 mobile viewport.
- Comparison: reference and working homepage were rendered together in a temporary same-viewport browser comparison board. The board was removed after QA.
- Primary journey exercised in the browser: hero film, play/pause, film scrubber, product action, cart drawer, Escape dismissal, focus restoration, and responsive layout.

## Pass 1 — findings and corrections

| Severity | Surface | Finding | Correction |
| --- | --- | --- | --- |
| P1 | Typography / layout | The initial display face was not condensed enough at the target scale, clipping the final letters of “ROUND” and “STARTS” and weakening headline comprehension. | Self-hosted the WYX Condensed face through `next/font/local`, then optically condensed the four display lines while preserving their target height and left alignment. |
| P1 | Motion / image quality | The first full-screen film cut contained black transition intervals that read as loading failures. | Rebuilt the field film as a 10.4-second H.264 sequence with overlapping bag, course, and product scenes and 0.6-second crossfades. |
| P2 | Content / conversion | The live product name was forced into one line and visibly truncated in the commerce panel. | Replaced single-line ellipsis with a two-line clamp and tightened the responsive optical size. |
| P2 | Color / imagery | The right product frame was too dark when inactive and the product disappeared into the surface. | Raised the inactive product exposure while keeping the active/hover lift distinct. |
| P2 | Behavior / accessibility | The field-film dialog did not initially suppress the persistent header or explicitly restore keyboard focus. | Hide the cinematic header while the modal is open, autofocus the close control, dismiss with Escape, restore body scroll, and return focus to the originating film button. |
| P2 | Mobile | The invalid mobile inset declaration could leave the frame target extending under metadata. | Replaced it with an explicit bottom offset and verified the horizontal film cards at 390 px. |

## Pass 2 — final comparison

- **Fonts and typography:** headline family, condensation, line height, cream tone, and optical scale now preserve the reference’s oversized editorial impact while keeping all four words readable. Small caps, metadata, and commerce hierarchy remain consistent.
- **Spacing and layout:** the left display column, three-frame deck, numbered top rule, bottom notes, commerce block, and scrubber retain the target hierarchy. Grid gaps, dividers, frame edges, and vertical rhythm remain crisp at the tested desktop viewport.
- **Viewport resilience:** the 390 × 844 pass resolves the desktop contact sheet into a legible stacked headline plus horizontal film rail. Navigation collapses to the existing menu pattern, tap targets remain practical, metadata wraps without collision, and the commerce action remains full-width.
- **Colors and tokens:** ink, forest, warm paper, and acid-lime accents match the intended luxury field-film palette. Active and focus states retain sufficient differentiation without introducing unrelated status colors.
- **Image quality and asset fidelity:** all three visible frames use real WYX photographic assets with art-directed crops and no CSS illustration substitutes. Desktop loads the 186 KB motion loop after image readiness; mobile, reduced-motion, and data-saver users retain the still image.
- **Copy and content:** live Shopify product title and price replace concept placeholders. The headline, field notes, tee-time data, and calls to action are coherent in the storefront context.
- **Icons:** Phosphor icons use one family and consistent stroke/fill treatment for film, expand, wind, close, pause, and directional actions.
- **States and interactions:** active-frame scrub works by pointer and keyboard; play/pause updates its accessible label; the full-screen film opens, plays, closes, and restores focus; the product action opens the cart optimistically. Without local Shopify credentials, the existing branded cart error state appears rather than a silent failure.
- **Accessibility:** semantic heading/region structure, alt text, labelled controls, visible focus styles, Escape dismissal, focus restoration, 44 px-plus primary targets, reduced-motion handling, and data-saver handling were verified.
- **Performance:** production build succeeds; homepage route is 8.37 KB with 165 KB first-load JavaScript. Hero videos are H.264, muted, inline, and lightweight (186 KB loop; 433 KB full film). Animation is transform/opacity-first and pointer response uses motion values rather than React renders.
- **AI shortcut artifacts:** none found. The implementation uses real photography, live catalog data, the existing navigation/cart system, real icons, and the established WYX design tokens.

## Verification

- `npx tsc --noEmit` — passed.
- `npm run build` — passed (Next.js 15.5.23; 255 static pages generated).
- `git diff --check` — passed.
- Browser console — no application errors; only the cloud-browser extension diagnostic and a pre-existing Framer scroll-container warning were observed.

final result: passed
