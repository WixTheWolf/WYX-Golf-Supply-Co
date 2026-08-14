# WYX Full-Bleed Field Film — Design QA

## Target and method

- Source visual truth: `/workspace/scratch/c91efa0a02b6/upload/e47e7f97-26fc-4e8b-86d7-dbe729e35d6c.png` — the user-provided Safari failure capture.
- Source pixels: `2047 × 1331`, including macOS and Safari chrome. The page-content region represents an approximately `1024 × 586` CSS-pixel Safari viewport at Retina density.
- Rendered implementation: Vercel preview deployment `dpl_HGANCa14Bp7FF4zY9jvUx1EinqVt`, commit `71fc845d9a1b47a0c3c07d7c4978a9c5185cb833`.
- Implementation capture: browser-rendered homepage at `1363 × 936` CSS pixels, DPR `1`, top-of-page state. The protected preview URL is the durable implementation reference; the viewport capture was emitted and inspected in the cloud browser.
- Density normalization: the source was inspected at original Retina pixels and interpreted at half-density for layout; the implementation was captured at DPR `1`. Because the browser surface does not expose viewport resizing, the exact Safari dimensions were additionally validated against the short-desktop media query (`max-width: 1100px`, `max-height: 720px`) and the measured safe-area geometry. No pixel-for-pixel claim is made across different browser chrome or densities.
- Full-view comparison evidence: source and implementation viewport captures were opened together in one comparison input. Focused regions were not separated because the headline, navigation, product panel, scene rail, and first-section boundary were all clearly readable in the full-view input.

## Pass 1 — source failure findings and corrections

| Severity | Surface | Source evidence | Correction | Post-fix evidence |
| --- | --- | --- | --- | --- |
| P0 | Typography / responsive layout | “THE ROUND STARTS HERE” was clipped by a fixed off-canvas display column at the user’s Safari width. | Removed the contact-sheet title column and horizontal scale hack. The new two-line heading lives inside the main safe-area grid, uses a viewport-capped condensed size, and only clips vertically for entrance motion. | Both line containers report equal `scrollWidth` and `clientWidth`; the full headline is visible in every sampled film scene. |
| P1 | Motion / composition | The first screen read as three static cards rather than one cinematic experience. | Replaced the contact sheet with one full-bleed, looping 10.4-second field film with bag, first-tee, and product scenes plus a scene rail that scrubs to each chapter. | Browser playback reached `readyState 4`, advanced continuously, and synchronized the active scene from `01` through `03`. |
| P1 | Brand / navigation | The cream header broke the dark film mood and separated navigation from the hero. | Forced the home header onto an ink glass surface with paper typography, including a robust home-content selector fallback. | Browser-computed header values are `rgba(4, 7, 5, 0.82)` and `rgb(251, 248, 240)`. |
| P1 | Commerce / image quality | The third frame exposed a live product cutout on a flat gray background, making the hero feel like a catalog collage. | Removed the product image from the hero and replaced it with a compact, text-first live edit panel with title, rationale, price, and direct commerce action. | “PIMENTO WAFFLE” and `$59.99` remain fully readable without introducing a low-quality image well. |
| P2 | Short desktop resilience | The original desktop layout assumed enough height for a 820px contact sheet and pushed key conversion content below the visible Safari window. | Added a `max-height: 720px` desktop composition with reduced optical type, compact actions/product panel, and a 64px rail while retaining a `560px` minimum hero. | The calculated Safari failure viewport keeps the two-line heading, both CTAs, product action, and film rail in the first hero composition without horizontal overflow. |

## Pass 2 — final comparison

- **Fonts and typography:** the self-hosted WYX Condensed face is fully readable, materially large, and no longer depends on independent horizontal scaling. The two-line hierarchy, `.79` line height, cream tone, and small-cap metadata preserve the editorial aggression without sacrificing comprehension.
- **Spacing and layout:** the safe-area grid owns both headline and commerce. Responsive gutters, a bounded right rail, compact short-viewport rules, and a full-width bottom scene rail prevent collisions and restore a deliberate vertical rhythm.
- **Viewport resilience:** desktop browser evidence shows no document-level horizontal overflow (`scrollWidth` equals the content width). The exact Safari-sized breakpoint has explicit type and spacing caps; phone layouts switch to a single flex column with wrapped actions and a full-width commerce panel.
- **Colors and tokens:** the final hero uses ink, paper, and acid-lime from the WYX system. Dark translucent surfaces preserve film continuity; acid is reserved for chapter state, focus, and conversion.
- **Image quality and asset fidelity:** the hero uses the real WYX bag, coastal golfer, and hat scenes in the lightweight H.264 film. The priority `next/image` poster protects LCP; the film crossfades only after it can play. No placeholder, CSS illustration, or inline SVG substitute is present.
- **Copy and content:** “THE ROUND STARTS HERE.” is complete. Supporting copy communicates the WYX proposition, and the live Shopify product title/price remain product-specific and readable.
- **Icons:** Phosphor Arrow, Play, Pause, Wind, and Close icons share one family and consistent optical weight.
- **States and interactions:** scene `03` seeks the film to approximately `7.15s`; play/pause changes the native media state; the full-screen film opens, autofocuses Close, dismisses with Escape, restores focus to “Watch field film,” and restores page scrolling.
- **Accessibility:** one semantic H1, labelled scene/toggle/dialog controls, visible focus styling, keyboard dismissal, focus restoration, reduced-motion behavior, data-saver behavior, and practical primary target sizes are present.
- **Performance:** `npm run build` succeeds with 255 generated routes. Homepage output is `7.37 kB` with `164 kB` first-load JavaScript. The 433KB film is not bundled into JavaScript and loads with `preload="metadata"` over the priority poster.
- **AI shortcut artifacts:** none found. The build uses live catalog data, real brand photography, real icon components, the existing cart/navigation system, and established tokens.

## Primary interactions tested

- Film autoplay and scene synchronization.
- Scene-rail seek to the current edit.
- Play and pause control.
- Full-screen film open, Escape close, and focus restoration.
- Dark home navigation computed styles.
- Headline line-box overflow and document-level horizontal overflow.

## Console and build verification

- `./node_modules/.bin/tsc --noEmit` — passed.
- `npm run build` — passed (Next.js 15.5.23; 255 routes generated).
- `git diff --check` — passed.
- Vercel preview — `READY`.
- Browser console — no application errors. Only the cloud-browser extension metadata diagnostic was present.

final result: passed
