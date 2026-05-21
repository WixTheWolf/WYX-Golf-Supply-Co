# WYX Golf Supply Co.

Premium static ecommerce catalog for WYX Golf Supply Co.

## Local build

```sh
npm run build
```

The build generates `dist/` from `scripts/build.js`, `src/styles.css`, and `public/images/`.

## Vercel

`vercel.json` explicitly sets:

- `framework`: `null`
- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`

This prevents Vercel from guessing between repo root and `public/`.

## Images

The current GitHub repo contains branded images as `.png` files in `public/images/`. Image filenames are centralized in `scripts/build.js` so they can be switched to `.jpg` if the repository later includes those exact files.
