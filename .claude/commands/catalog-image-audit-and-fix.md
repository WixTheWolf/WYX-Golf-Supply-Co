---
name: catalog-image-audit-and-fix
description: Workflow command scaffold for catalog-image-audit-and-fix in WYX-Golf-Supply-Co.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /catalog-image-audit-and-fix

Use this workflow when working on **catalog-image-audit-and-fix** in `WYX-Golf-Supply-Co`.

## Goal

Audits and fixes product images to ensure correct supplier photos are used and mismatches are resolved.

## Common Files

- `scripts/audit-product-images.ts`
- `scripts/fix-all-product-images.ts`
- `scripts/fix-mismatched-images-batch*.ts`
- `data/verified-dropship-catalog.json`
- `lib/catalog.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Run or update audit scripts (e.g., scripts/audit-product-images.ts) to identify image issues.
- Run fix scripts (e.g., scripts/fix-all-product-images.ts, scripts/fix-mismatched-images-batch*.ts) to correct mismatches.
- Update product data files if new image URLs or mappings are needed.
- Commit changes to scripts and data files.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.