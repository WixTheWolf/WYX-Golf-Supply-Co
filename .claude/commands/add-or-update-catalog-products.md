---
name: add-or-update-catalog-products
description: Workflow command scaffold for add-or-update-catalog-products in WYX-Golf-Supply-Co.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-catalog-products

Use this workflow when working on **add-or-update-catalog-products** in `WYX-Golf-Supply-Co`.

## Goal

Adds new products to the catalog or updates existing product data, including images, merchandising tags, and supplier links.

## Common Files

- `lib/catalog.ts`
- `data/verified-dropship-catalog.json`
- `app/products/[handle]/page.tsx`
- `app/golf-*.tsx`
- `lib/merchandising*.ts`
- `scripts/seed-*.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or add product data in lib/catalog.ts, data/verified-dropship-catalog.json, or related catalog files.
- Update or create product pages in app/ (e.g., app/products/[handle]/page.tsx, app/golf-*.tsx).
- Update merchandising/category/tag logic in lib/merchandising*.ts.
- Run or update scripts to seed, activate, or fix products (e.g., scripts/seed-hidden-gems.ts, scripts/activate-wyx-drafts.ts, scripts/fix-all-product-images.ts).
- Update documentation as needed (e.g., docs/vendor-sourcing-hit-list.md, docs/dropship-sourcing-playbook.md).

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.