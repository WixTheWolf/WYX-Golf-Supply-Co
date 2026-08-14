# WYX Living Design System

## Brand principles

- **Selective, never scarce:** every surface should feel edited, but buying guidance must remain explicit.
- **Editorial before decorative:** asymmetry, scale, and motion explain hierarchy and product point of view.
- **Quiet confidence:** forest, cream, ink, and a single acid highlight replace promotional color noise.
- **Motion with a job:** movement reveals state, maintains context, or acknowledges an action. It never delays access.

## Foundations

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#0a110d` | Primary text, deep surfaces |
| `forest` | `#10271e` | Signature brand surface |
| `evergreen` | `#183a2d` | Interactive deep green |
| `cream` | `#f3efe5` | Primary canvas |
| `paper` | `#fbf8f0` | Elevated neutral surface |
| `oat` | `#ded5c4` | Image wells, dividers, skeletons |
| `brass` | `#b7a65a` | Editorial metadata |
| `acid` | `#d9e36b` | Focus, progress, conversion accent |

Display typography uses Archivo at heavy weights and tight optical spacing. Manrope carries body, commerce metadata, and controls. Page gutters scale fluidly from `20px` to `64px`; section spacing scales from `80px` to `144px`; the editorial content limit is `1440px`.

Narrow-screen display sizes are optically capped rather than mechanically scaled. At `320–560px`, long editorial words stay inside the frame, hero actions may wrap without losing order, and every primary navigation or commerce target is at least `44px` tall. Safe-area insets are respected by the hero and sticky purchase controls.

## Motion tokens

| Name | Timing | Purpose |
| --- | --- | --- |
| Instant | `160ms` | Hover and button acknowledgement |
| Quick | `280ms` | Menus and route exits |
| Standard | `520ms` | Content reveal and image changes |
| Cinematic | `860ms` | Hero entrances only |
| Tactile spring | `380 / 32 / .72` | Drawers and direct manipulation |
| Soft spring | `170 / 26 / .9` | Scroll progress and ambient response |

All motion uses `prefers-reduced-motion`, Framer Motion user reduction, transform/opacity-first animation, and one-time viewport entrances.

## Components

- `MotionProvider` and `PageTransition`: one lazy animation boundary, route continuity, global scroll progress.
- `EditorialHero`: server-supplied LCP asset, restrained parallax, editorial product rail.
- `ProductCard`: secondary-image reveal, quick add, option routing, consistent product metadata.
- `EditorialStory`: sticky product narrative on desktop, linear visual-first story on mobile.
- `ProductGallery`: fluid gallery state, keyboard-focusable image controls, responsive thumbnails.
- `CartProvider`: optimistic drawer opening, branded pending/empty/error states, Shopify checkout handoff.
- `Reveal`: reusable one-time section entrance with reduced-motion support.

## Accessibility and performance

- WCAG 2.2 AA color contrast, visible acid focus rings, semantic controls, labelled dialogs, and Escape dismissal.
- Server Components own product discovery and catalog data. Client components are limited to motion and commerce interactions.
- The primary hero image alone uses `next/image` priority and `fetchPriority="high"`; the editorial inset and below-fold product imagery load normally so they do not compete with LCP.
- Animation uses transform and opacity; backdrop blur is limited to compact navigation and modal layers.
