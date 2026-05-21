# WYX Golf Supply Co.

Static marketing site for WYX Golf Supply Co.

## Local build

```sh
npm run build
```

The build copies `src/` and `public/images/` into `dist/`.

## Vercel

`vercel.json` explicitly sets:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- `framework`: `null`

This keeps Vercel from guessing between repo root and `public/`.
