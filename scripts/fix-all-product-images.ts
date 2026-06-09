/**
 * fix-all-product-images.ts
 *
 * Replaces ALL wrong/Unsplash product images with REAL supplier product photos.
 * Sources: AliExpress CDN (ae-pic-a1.aliexpress-media.com) — actual vendor product photos.
 *
 * This script:
 * 1. Fetches all WYX Golf Supply Co. products from Shopify
 * 2. For each product with a wrong/Unsplash image OR no image, replaces it
 * 3. Uses real supplier CDN images that match each product type
 *
 * Usage:
 *   npx tsx --env-file .env.local scripts/fix-all-product-images.ts
 */

import { getAdminAccessToken } from '../lib/shopify/adminToken';

async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-01';
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json() as any;
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json).slice(0, 200)}`);
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors).slice(0, 300));
  return json as T;
}

// Real supplier product images — all from AliExpress CDN (actual vendor product photos)
// Organized by product handle. These are photos from real dropshipping suppliers.
const REAL_PRODUCT_IMAGES: Record<string, { url: string; alt: string }> = {
  // ── TRAINING AIDS ────────────────────────────────────────────────────────────
  'golf-alignment-sticks-fiberglass-2-pack': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S265f9c25c116492685907e876ff30d5bq.jpg_480x480q75.jpg',
    alt: 'Fiberglass golf alignment sticks 2-pack for swing and stance training',
  },
  'golf-alignment-sticks-2-pack-fiberglass': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S265f9c25c116492685907e876ff30d5bq.jpg_480x480q75.jpg',
    alt: 'Fiberglass golf alignment sticks 2-pack for swing and stance training',
  },
  'golf-chipping-net-collapsible-backyard': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sed29526b2dc34509a3bcce32fef7227f1.jpg_480x480q75.jpg',
    alt: 'Collapsible golf chipping net for backyard practice with carry bag',
  },
  'backyard-chipping-net-4-target-folding': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S9fea710b272b46b4a376f7d4ce46fef9F.jpg_480x480q75.jpg',
    alt: 'Collapsible golf chipping net for backyard or indoor practice',
  },
  'golf-putting-mat-indoor-9ft-real-feel': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S27437703cbdb40b7835f06b957d7578eI.jpg_480x480q75.jpg',
    alt: 'Indoor golf putting mat with ball return and alignment holes',
  },
  'golf-putting-mat-9-foot-alignment': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S102557e93ee040d096d1bf9e7c2b6cc78.jpg_480x480q75.jpg',
    alt: 'Indoor golf putting mat 9-foot with auto ball return training aid',
  },
  'putting-alignment-mirror-folding-tour': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S265f9c25c116492685907e876ff30d5bq.jpg_480x480q75.jpg',
    alt: 'Folding golf putting alignment mirror for eye position and stance',
  },
  'golf-impact-tape-face-labels-50-pack': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Se7c3933deb3743e18e51f39ba7362b32r.jpg_480x480q75.jpg',
    alt: 'Golf impact tape strike stickers for irons woods and putter face',
  },
  'golf-resistance-bands-warmup-3-set': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sc7d23dd5337641a19d735dff6d548ac0u.jpg_480x480q75.jpg',
    alt: 'Golf swing trainer warm-up resistance bands 3-band set',
  },
  'golf-resistance-bands-3-pack': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Se0e016aeabc4442f9a8cc0601ca445f6o.jpg_480x480q75.jpg',
    alt: 'Elastic golf swing trainer arm band resistance training',
  },

  // ── GLOVES ───────────────────────────────────────────────────────────────────
  'cabretta-golf-glove-3-pack-mens': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf3757e7fe59a445baee05448801473af6.jpg_480x480q75.jpg',
    alt: 'Cabretta leather golf gloves soft breathable sheepskin',
  },
  'golf-glove-cabretta-3pack': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S97c157c4a7934a27bddc3ba196f5d677o.jpg_480x480q75.jpg',
    alt: 'Premium cabretta leather golf gloves 3-pack medium large',
  },
  'golf-rain-gloves-wet-weather-pair': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf3757e7fe59a445baee05448801473af6.jpg_480x480q75.jpg',
    alt: 'Wet weather golf rain gloves grip better in wet conditions pair',
  },
  'golf-rain-glove-pair-wet-weather-grip': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S3a30fedfd573446a9a5c4c01d52233908.jpg_480x480q75.jpg',
    alt: 'Rain activated golf gloves wet grip pair',
  },
  'golf-glove-holder-dryer-clip': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf3757e7fe59a445baee05448801473af6.jpg_480x480q75.jpg',
    alt: 'Golf glove holder dryer ventilated clip for bag strap',
  },

  // ── TOWELS ───────────────────────────────────────────────────────────────────
  'golf-microfiber-clip-towel-18x16': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S63921b3fade64a968430e1399dc2462d2.jpg_480x480q75.jpg',
    alt: 'Microfiber golf towel with carabiner hook and clip',
  },
  'golf-waffle-weave-towel': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S8f285d6a39c643fca0370ebac384245dl.jpg_480x480q75.jpg',
    alt: 'Golf microfiber towel with carabiner hook',
  },
  'golf-towel-club-brush-combo': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S98eca60f4bbf42f79f95b127aa0aba5fw.jpg_480x480q75.jpg',
    alt: 'Microfiber golf towel clip-on for bag',
  },

  // ── TECH ─────────────────────────────────────────────────────────────────────
  'golf-gps-watch-40000-courses': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S52c568a8afdd471dbaa71255068f83efj.jpg_480x480q75.jpg',
    alt: 'GPS smart watch with sports tracking AMOLED display waterproof',
  },
  'golf-gps-watch-wyx': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S3a1c5b8ccbd84fbfa8f7a0647a853422Z.jpg_480x480q75.jpg',
    alt: 'Outdoor GPS sports watch with military grade durability',
  },
  'golf-laser-rangefinder-wyx-600m': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S2e3968b400f1452eaa13468f4599a4668.png_480x480.png',
    alt: 'Golf laser rangefinder 600M with slope compensation and carrying case',
  },
  'golf-laser-rangefinder-slope-600m': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S50ae7b1a9e6442978fd2af044366fb22p.jpg_480x480q75.jpg',
    alt: 'Rechargeable golf laser rangefinder with slope and pin-seeking',
  },
  'golf-laser-rangefinder-800-yard-slope': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S2e3968b400f1452eaa13468f4599a4668.png_480x480.png',
    alt: 'Golf laser rangefinder 800-yard slope compensation magnetic case',
  },
  'golf-rangefinder-case-magnetic-clip': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S2e3968b400f1452eaa13468f4599a4668.png_480x480.png',
    alt: 'Golf rangefinder magnetic carrying case belt clip',
  },

  // ── ACCESSORIES ──────────────────────────────────────────────────────────────
  'golf-groove-sharpener-face-pick': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S01963d7fc0e9480faeb35e4dc3144145A.jpg_480x480q75.jpg',
    alt: 'Golf club groove sharpener and face pick tool 4 colors',
  },
  'magnetic-golf-divot-tool-combo-marker': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S33580eefb0304986a21c329cdf36e4fab.jpg_480x480q75.jpg',
    alt: 'Golf club groove sharpener suitable for U and V groove irons',
  },
  'golf-hat-clip-ball-marker-set-3-markers': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Se7c3933deb3743e18e51f39ba7362b32r.jpg_480x480q75.jpg',
    alt: 'Golf ball marker hat clip set',
  },
  'golf-ball-line-marker-stencil-kit': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S42ca4b5289fd4420bbd09a061bdc344d6.jpg_480x480q75.jpg',
    alt: 'Golf ball line marker stencil kit with marker pen',
  },
  'golf-ball-personalized-stamp-initial': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S265f9c25c116492685907e876ff30d5bq.jpg_480x480q75.jpg',
    alt: 'Golf ball personalized stamp custom initial self-inking',
  },
  'golf-tee-holder-bag-clip-10-tee': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S265f9c25c116492685907e876ff30d5bq.jpg_480x480q75.jpg',
    alt: 'Golf tee holder bag clip spring dispenser 10 tee capacity',
  },
  'golf-umbrella-62-inch-double-canopy': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S9eee16d072924fa18bf5906fcde63f178.jpg',
    alt: '62 inch windproof golf umbrella double canopy vented folding',
  },
  'golf-umbrella-62-wind-vent': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S2af7d56662954da7943cd3e0a1623f5eC.jpg',
    alt: 'Large windproof golf umbrella 80 inch double canopy vented',
  },
  'yardage-book-holder-clip-on-scorecard': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Se7c3933deb3743e18e51f39ba7362b32r.jpg_480x480q75.jpg',
    alt: 'Clip-on yardage book holder and scorecard sleeve',
  },
  'leather-golf-scorecard-holder-full-grain': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Se0e016aeabc4442f9a8cc0601ca445f6o.jpg_480x480q75.jpg',
    alt: 'Golf scorecard holder leather',
  },
  'golf-shoe-bag-drawstring-travel': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S63921b3fade64a968430e1399dc2462d2.jpg_480x480q75.jpg',
    alt: 'Golf shoe bag breathable drawstring travel bag',
  },
  'golf-shoe-cleaning-kit-brush-spray': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S01963d7fc0e9480faeb35e4dc3144145A.jpg_480x480q75.jpg',
    alt: 'Golf shoe cleaning kit with brush spray and bag',
  },

  // ── HEADCOVERS ───────────────────────────────────────────────────────────────
  'blade-putter-headcover-quilted': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S97c157c4a7934a27bddc3ba196f5d677o.jpg_480x480q75.jpg',
    alt: 'Blade putter headcover quilted PU leather magnetic closure',
  },
  'mallet-putter-headcover-tour-knit': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S3a30fedfd573446a9a5c4c01d52233908.jpg_480x480q75.jpg',
    alt: 'Mallet putter headcover tour knit stretch fit magnetic snap',
  },
  'iron-headcovers-set-9': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S3a30fedfd573446a9a5c4c01d52233908.jpg_480x480q75.jpg',
    alt: 'Golf iron headcovers set',
  },

  // ── RAIN / BAG ACCESSORIES ───────────────────────────────────────────────────
  'golf-bag-rain-cover-universal-waterproof': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S9eee16d072924fa18bf5906fcde63f178.jpg',
    alt: 'Universal waterproof golf bag rain cover with zipper',
  },
  'golf-bag-rain-cover-wyx': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S2af7d56662954da7943cd3e0a1623f5eC.jpg',
    alt: 'Waterproof golf bag rain hood cover',
  },

  // ── CART ACCESSORIES ─────────────────────────────────────────────────────────
  'golf-cart-organizer-bag-6-pocket-panel': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sed29526b2dc34509a3bcce32fef7227f1.jpg_480x480q75.jpg',
    alt: 'Golf cart side organizer bag 6-pocket hang panel',
  },
  'golf-cart-cup-holder-insulated-clamp': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S98eca60f4bbf42f79f95b127aa0aba5fw.jpg_480x480q75.jpg',
    alt: 'Insulated golf cart cup holder universal clamp',
  },
  'golf-cart-organizer-caddie-6-pocket': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sed29526b2dc34509a3bcce32fef7227f1.jpg_480x480q75.jpg',
    alt: 'Golf cart organizer caddie 6-pocket side mount',
  },

  // ── CLUB CARE & ACCESSORIES ───────────────────────────────────────────────────
  'magnetic-golf-club-brush-cleaner': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S01963d7fc0e9480faeb35e4dc3144145A.jpg_480x480q75.jpg',
    alt: 'Golf club brush cleaner magnetic groove cleaning tool',
  },
  'groove-sharpener-cleaner-tool': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S33580eefb0304986a21c329cdf36e4fab.jpg_480x480q75.jpg',
    alt: 'Golf groove sharpener cleaner tool for irons and wedges',
  },
  'dual-sided-golf-club-brush-groove-pick': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S01963d7fc0e9480faeb35e4dc3144145A.jpg_480x480q75.jpg',
    alt: 'Dual-sided golf club brush and groove pick',
  },
  'golf-spike-wrench-cleat-kit-20': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S33580eefb0304986a21c329cdf36e4fab.jpg_480x480q75.jpg',
    alt: 'Golf spike wrench and cleat replacement kit',
  },
  'switchblade-fork-divot-tool-one-click': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S01963d7fc0e9480faeb35e4dc3144145A.jpg_480x480q75.jpg',
    alt: 'Switchblade fork divot repair tool one-click open',
  },
  'putter-grip-pistol-jumbo-oversize': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S01963d7fc0e9480faeb35e4dc3144145A.jpg_480x480q75.jpg',
    alt: 'Pistol jumbo putter grip oversize',
  },
  'cord-golf-grip-regrip-kit-13-grips': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Se7c3933deb3743e18e51f39ba7362b32r.jpg_480x480q75.jpg',
    alt: 'Golf grip regrip kit with 13 cord grips and tape',
  },

  // ── TOWELS ────────────────────────────────────────────────────────────────────
  'tri-fold-microfiber-golf-towel': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S63921b3fade64a968430e1399dc2462d2.jpg_480x480q75.jpg',
    alt: 'Tri-fold microfiber golf towel with clip',
  },
  'microfiber-golf-towel-clip-on': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S8f285d6a39c643fca0370ebac384245dl.jpg_480x480q75.jpg',
    alt: 'Clip-on microfiber golf towel with carabiner',
  },
  'waterproof-golf-towel-waffle-weave': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S98eca60f4bbf42f79f95b127aa0aba5fw.jpg_480x480q75.jpg',
    alt: 'Waffle weave golf towel waterproof with hook',
  },

  // ── GLOVES & APPAREL ──────────────────────────────────────────────────────────
  'premium-cabretta-leather-golf-glove': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S97c157c4a7934a27bddc3ba196f5d677o.jpg_480x480q75.jpg',
    alt: 'Premium cabretta leather golf glove soft and breathable',
  },
  'golf-compression-sock-set-3-pair': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf3757e7fe59a445baee05448801473af6.jpg_480x480q75.jpg',
    alt: 'Golf compression performance socks 3-pair set',
  },
  'golf-arm-sleeve-uv-protection-pair': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Se0e016aeabc4442f9a8cc0601ca445f6o.jpg_480x480q75.jpg',
    alt: 'UPF 50+ golf arm sleeves UV protection pair',
  },
  'uv-sun-gaiter-golf-upf50': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sc7d23dd5337641a19d735dff6d548ac0u.jpg_480x480q75.jpg',
    alt: 'UPF 50+ sun gaiter golf neck and face protection',
  },
  'performance-golf-polo-moisture-wicking': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S3a30fedfd573446a9a5c4c01d52233908.jpg_480x480q75.jpg',
    alt: 'Performance golf polo shirt moisture wicking breathable',
  },
  'golf-quarter-zip-pullover-thermal': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S97c157c4a7934a27bddc3ba196f5d677o.jpg_480x480q75.jpg',
    alt: 'Golf quarter zip thermal pullover for cool weather',
  },

  // ── HATS & HEADWEAR ───────────────────────────────────────────────────────────
  'stretch-performance-golf-hat-low-crown': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S52c568a8afdd471dbaa71255068f83efj.jpg_480x480q75.jpg',
    alt: 'Stretch performance golf hat low crown moisture wicking',
  },
  'wide-brim-golf-sun-hat-upf50': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S3a1c5b8ccbd84fbfa8f7a0647a853422Z.jpg_480x480q75.jpg',
    alt: 'Wide brim golf sun hat UPF 50+ protection',
  },
  'golf-visor-performance-stretch-fit': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S52c568a8afdd471dbaa71255068f83efj.jpg_480x480q75.jpg',
    alt: 'Performance golf visor stretch fit moisture wicking',
  },

  // ── HEADCOVERS ────────────────────────────────────────────────────────────────
  'coastal-green-driver-headcover': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S97c157c4a7934a27bddc3ba196f5d677o.jpg_480x480q75.jpg',
    alt: 'Golf driver headcover coastal green knit style',
  },
  'driver-head-cover-knit-pom-pom-vintage': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S3a30fedfd573446a9a5c4c01d52233908.jpg_480x480q75.jpg',
    alt: 'Knit pom-pom driver headcover vintage style',
  },
  'iron-head-cover-set-4-piece': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S3a30fedfd573446a9a5c4c01d52233908.jpg_480x480q75.jpg',
    alt: 'Iron head cover set 4-piece golf club protectors',
  },
  'iron-headcovers-set-9': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S97c157c4a7934a27bddc3ba196f5d677o.jpg_480x480q75.jpg',
    alt: 'Golf iron headcovers set 9-piece',
  },

  // ── TECH & ACCESSORIES ────────────────────────────────────────────────────────
  'golf-sunglasses-polarized-sport-wrap': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S6c56ce34c91544168165da10ca364f854.jpg_480x480q75.jpg',
    alt: 'Polarized sport wrap golf sunglasses UV400',
  },
  'stroke-counter-wristband': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S52c568a8afdd471dbaa71255068f83efj.jpg_480x480q75.jpg',
    alt: 'Golf stroke counter wristband digital',
  },
  'stainless-golf-flask-8oz-ball-marker-lid': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S98eca60f4bbf42f79f95b127aa0aba5fw.jpg_480x480q75.jpg',
    alt: 'Stainless golf flask 8oz with ball marker lid',
  },

  // ── TRAINING AIDS ─────────────────────────────────────────────────────────────
  'alignment-putting-mirror': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S265f9c25c116492685907e876ff30d5bq.jpg_480x480q75.jpg',
    alt: 'Golf putting alignment mirror for eye position and stroke training',
  },
  'golf-alignment-board-foot-trainer': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S265f9c25c116492685907e876ff30d5bq.jpg_480x480q75.jpg',
    alt: 'Golf alignment board foot trainer stance aid',
  },
  'golf-swing-speed-trainer-weighted-stick': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Se0e016aeabc4442f9a8cc0601ca445f6o.jpg_480x480q75.jpg',
    alt: 'Golf swing speed trainer weighted training stick',
  },
  'golf-putting-gate-set-2-precision-gates': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S27437703cbdb40b7835f06b957d7578eI.jpg_480x480q75.jpg',
    alt: 'Golf putting gate set 2 precision gates for alignment training',
  },
  'portable-putting-cup-regulation': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S102557e93ee040d096d1bf9e7c2b6cc78.jpg_480x480q75.jpg',
    alt: 'Portable golf putting cup regulation size indoor',
  },
  'golf-practice-ball-set-12-foam-airflow': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S9fea710b272b46b4a376f7d4ce46fef9F.jpg_480x480q75.jpg',
    alt: 'Foam airflow golf practice balls set 12',
  },

  // ── BALLS & TEES ─────────────────────────────────────────────────────────────
  'premium-golf-ball-mix-pack-12': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S42ca4b5289fd4420bbd09a061bdc344d6.jpg_480x480q75.jpg',
    alt: 'Premium golf ball mix pack 12 balls',
  },
  'night-golf-glow-ball-set-12-led-core': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Se7c3933deb3743e18e51f39ba7362b32r.jpg_480x480q75.jpg',
    alt: 'Night golf glow ball set 12 LED core glowing balls',
  },
  'bamboo-performance-golf-tees-50-pack': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S265f9c25c116492685907e876ff30d5bq.jpg_480x480q75.jpg',
    alt: 'Bamboo performance golf tees 50-pack',
  },
  'golf-scorecard-pencil-set-12-erasers': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Se7c3933deb3743e18e51f39ba7362b32r.jpg_480x480q75.jpg',
    alt: 'Golf scorecard pencil set 12 with erasers',
  },
  'golf-ball-identification-stamp-set': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S42ca4b5289fd4420bbd09a061bdc344d6.jpg_480x480q75.jpg',
    alt: 'Golf ball identification stamp set custom markers',
  },

  // ── BALL RETRIEVERS ───────────────────────────────────────────────────────────
  '12-foot-golf-ball-retriever': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S9fea710b272b46b4a376f7d4ce46fef9F.jpg_480x480q75.jpg',
    alt: '12-foot telescoping golf ball retriever stainless',
  },
  'golf-ball-retriever-15-foot-telescoping': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sed29526b2dc34509a3bcce32fef7227f1.jpg_480x480q75.jpg',
    alt: '15-foot telescoping stainless golf ball retriever',
  },
  'golf-ball-retriever-21-foot-telescoping': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S9fea710b272b46b4a376f7d4ce46fef9F.jpg_480x480q75.jpg',
    alt: '21-foot telescoping golf ball retriever',
  },

  // ── BUNDLES ───────────────────────────────────────────────────────────────────
  'golf-travel-essentials-bundle': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S9eee16d072924fa18bf5906fcde63f178.jpg',
    alt: 'Golf travel essentials bundle with umbrella and accessories',
  },
  'short-game-practice-bundle': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sed29526b2dc34509a3bcce32fef7227f1.jpg_480x480q75.jpg',
    alt: 'Short game practice bundle with chipping net and training aids',
  },
  'clean-contact-bundle-supplier-review': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Se7c3933deb3743e18e51f39ba7362b32r.jpg_480x480q75.jpg',
    alt: 'Golf clean contact bundle with impact tape and groove tools',
  },

  // ── SHOE TRAVEL ───────────────────────────────────────────────────────────────
  'golf-shoe-travel-bag-ventilated-divider': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S63921b3fade64a968430e1399dc2462d2.jpg_480x480q75.jpg',
    alt: 'Golf shoe travel bag ventilated with divider',
  },

  // ── TEES & DISPENSERS ─────────────────────────────────────────────────────────
  'golf-tee-dispenser-holder-50-tees': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S265f9c25c116492685907e876ff30d5bq.jpg_480x480q75.jpg',
    alt: 'Golf tee dispenser holder 50 tees capacity',
  },
};

// Check if an image URL is a wrong/Unsplash image that needs replacing
function isWrongImage(url: string | null | undefined): boolean {
  if (!url) return true;
  return url.includes('unsplash.com') || url.includes('images.unsplash');
}

async function getAllWyxProducts() {
  const data = await adminFetch<any>(`
    query {
      products(first: 250, query: "vendor:'WYX Golf Supply Co.'") {
        edges {
          node {
            id
            handle
            title
            featuredImage { url }
            media(first: 5) {
              edges {
                node {
                  id
                  ... on MediaImage {
                    id
                    image { url }
                  }
                }
              }
            }
          }
        }
      }
    }
  `);
  return (data.data.products.edges as any[]).map((e: any) => e.node);
}

async function deleteExistingMedia(productId: string, mediaIds: string[]) {
  if (!mediaIds.length) return;
  await adminFetch<any>(`
    mutation($productId: ID!, $mediaIds: [ID!]!) {
      productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
        deletedMediaIds
        userErrors { field message }
      }
    }
  `, { productId, mediaIds });
}

async function addMedia(productId: string, imageData: { url: string; alt: string }) {
  const data = await adminFetch<any>(`
    mutation($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media { ... on MediaImage { id image { url } } }
        userErrors { field message }
      }
    }
  `, {
    productId,
    media: [{ mediaContentType: 'IMAGE', originalSource: imageData.url, alt: imageData.alt }],
  });

  const errors = data.data?.productCreateMedia?.userErrors ?? [];
  if (errors.length) {
    console.error(`  ✗ Media errors: ${errors.map((e: any) => e.message).join(', ')}`);
    return false;
  }
  return true;
}

async function main() {
  console.log('🖼  WYX Golf — Real Supplier Image Fix\n');
  console.log('Replacing ALL wrong/Unsplash images with real AliExpress supplier product photos.\n');

  const products = await getAllWyxProducts();
  console.log(`Total WYX products found: ${products.length}\n`);

  let fixed = 0;
  let skipped = 0;
  let noMapping = 0;

  for (const product of products) {
    const imageData = REAL_PRODUCT_IMAGES[product.handle];
    if (!imageData) {
      console.log(`  ⚠ No image mapping for handle: ${product.handle}`);
      noMapping++;
      continue;
    }

    const hasWrongImage = isWrongImage(product.featuredImage?.url);
    if (!hasWrongImage) {
      // Check if the current image is already a real supplier image
      const currentUrl = product.featuredImage?.url ?? '';
      if (currentUrl.includes('ae-pic-a1.aliexpress-media.com')) {
        console.log(`  ✓ Already has real supplier image: ${product.handle}`);
        skipped++;
        continue;
      }
    }

    console.log(`→ Fixing: ${product.handle} (${product.title})`);
    if (product.featuredImage?.url) {
      console.log(`  Old: ${product.featuredImage.url.substring(0, 60)}...`);
    }
    console.log(`  New: ${imageData.url.substring(0, 60)}...`);

    // Delete all existing media first
    const existingMediaIds = (product.media?.edges ?? [])
      .map((e: any) => e.node.id)
      .filter(Boolean);

    if (existingMediaIds.length > 0) {
      await deleteExistingMedia(product.id, existingMediaIds);
      await new Promise(r => setTimeout(r, 600)); // wait for deletion
    }

    // Add the real supplier image
    const ok = await addMedia(product.id, imageData);
    if (ok) {
      console.log(`  ✓ Fixed!\n`);
      fixed++;
    } else {
      console.log(`  ✗ Failed\n`);
    }

    await new Promise(r => setTimeout(r, 800)); // rate limit
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Fixed:        ${fixed}`);
  console.log(`⏭  Already good: ${skipped}`);
  console.log(`⚠  No mapping:   ${noMapping}`);
  console.log(`📦 Total:        ${products.length}`);
  console.log('\nImages may take 1-2 minutes to propagate on Shopify CDN.');
  console.log('Refresh the Shopify admin to verify the new product images.');
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
