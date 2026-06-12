```markdown
# WYX-Golf-Supply-Co Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you how to contribute effectively to the WYX-Golf-Supply-Co codebase, a Next.js (TypeScript) project for managing a golf supply e-commerce catalog. You'll learn the project's coding conventions, how to add or update products, manage catalog images, activate products, create landing pages, and handle supplier sourcing. Each workflow is documented with step-by-step instructions and suggested commands for streamlined collaboration.

## Coding Conventions

**File Naming**
- Use `camelCase` for files and folders.
  - Example: `productReadiness.ts`, `verifiedDropshipCatalog.json`

**Import Style**
- Use alias imports for modules.
  - Example:
    ```typescript
    import { getProduct } from '@/lib/catalog';
    import Header from '@/components/Header';
    ```

**Export Style**
- Mixed: both named and default exports are used.
  - Example (named):
    ```typescript
    export function getProductById(id: string) { ... }
    ```
  - Example (default):
    ```typescript
    export default function ProductPage() { ... }
    ```

**Commit Patterns**
- Prefix with `feat`, `fix`, or `ops`.
- Keep commit messages concise (~64 characters).
  - Example: `feat: add new golf bag kit landing page`

## Workflows

### Add or Update Catalog Products
**Trigger:** When you want to add new products, hidden gems, or update catalog data (images, tags, supplier info).
**Command:** `/add-product`

1. Edit or add product data in:
    - `lib/catalog.ts`
    - `data/verified-dropship-catalog.json`
2. Update or create product pages in `app/` (e.g., `app/products/[handle]/page.tsx`, `app/golf-*.tsx`).
3. Update merchandising/category/tag logic in `lib/merchandising*.ts`.
4. Run or update scripts as needed:
    - `scripts/seed-hidden-gems.ts`
    - `scripts/activate-wyx-drafts.ts`
    - `scripts/fix-all-product-images.ts`
5. Update documentation if necessary (e.g., `docs/vendor-sourcing-hit-list.md`, `docs/dropship-sourcing-playbook.md`).

**Example:**
```typescript
// lib/catalog.ts
export const catalog = [
  {
    handle: 'pro-golf-bag',
    name: 'Pro Golf Bag',
    images: ['https://...'],
    tags: ['bag', 'pro'],
    supplier: 'TopDawg'
  },
  // ...
];
```

---

### Catalog Image Audit and Fix
**Trigger:** When you want to verify or correct product images in the catalog.
**Command:** `/fix-images`

1. Run audit scripts to identify image issues:
    - `scripts/audit-product-images.ts`
2. Run fix scripts to correct mismatches:
    - `scripts/fix-all-product-images.ts`
    - `scripts/fix-mismatched-images-batch*.ts`
3. Update product data files if new image URLs or mappings are needed.
4. Commit changes to scripts and data files.

**Example:**
```bash
npx ts-node scripts/audit-product-images.ts
npx ts-node scripts/fix-all-product-images.ts
```

---

### Go Live or Activate Catalog
**Trigger:** When you want to launch new products or collections and make them available for purchase.
**Command:** `/go-live-catalog`

1. Run activation scripts:
    - `scripts/activate-wyx-drafts.ts`
    - `scripts/go-live-catalog.ts`
    - `scripts/enable-wyx-inventory.ts`
2. Update `package.json` to add or modify script entries if needed.
3. Update readiness logic in `lib/productReadiness.ts`.
4. Commit changes and verify products are live.

**Example:**
```json
// package.json
"scripts": {
  "go-live": "ts-node scripts/go-live-catalog.ts"
}
```

---

### Add or Update Landing Pages and Navigation
**Trigger:** When you want to launch a new campaign, kit, or reorganize site navigation.
**Command:** `/add-landing-page`

1. Add or edit landing/category/kit pages in `app/` (e.g., `app/the-bag-test/page.tsx`, `app/golf-*.tsx`).
2. Update `app/layout.tsx` and `components/Header.tsx` for navigation changes.
3. Update routing helpers in `lib/intentPages.ts` if needed.
4. Update documentation to reflect new flows or offers.

**Example:**
```tsx
// app/the-bag-test/page.tsx
export default function TheBagTestPage() {
  return <div>Welcome to The Bag Test!</div>;
}
```

---

### Supplier Sourcing and Verification
**Trigger:** When you want to onboard new suppliers, verify product sources, or document sourcing processes.
**Command:** `/supplier-audit`

1. Update or create supplier logs and catalog audit data:
    - `data/supplier-outreach-log.json`
    - `data/topdawg-*.json`
2. Run or update supplier scripts:
    - `scripts/send-supplier-outreach.ts`
    - `scripts/audit-topdawg-golf-catalog.ts`
    - `scripts/finalize-topdawg-connection.ts`
3. Update or create sourcing documentation:
    - `docs/dropship-sourcing-playbook.md`
    - `docs/supplier-outreach-pack.md`
    - `docs/vendor-sourcing-hit-list.md`

**Example:**
```json
// data/supplier-outreach-log.json
[
  {
    "supplier": "TopDawg",
    "contacted": "2024-05-12",
    "status": "pending"
  }
]
```

## Testing Patterns

- Test files use the pattern `*.test.*` (e.g., `catalog.test.ts`).
- Testing framework is not explicitly specified; check for test scripts or dependencies in `package.json`.
- Example test file:
  ```typescript
  // catalog.test.ts
  import { getProductById } from '@/lib/catalog';

  test('gets product by id', () => {
    expect(getProductById('pro-golf-bag')).toBeDefined();
  });
  ```

## Commands

| Command            | Purpose                                                        |
|--------------------|----------------------------------------------------------------|
| /add-product       | Add or update products in the catalog                          |
| /fix-images        | Audit and fix product images                                   |
| /go-live-catalog   | Activate or publish products to the storefront                 |
| /add-landing-page  | Add or update landing/category/kit pages and navigation        |
| /supplier-audit    | Audit, verify, and document supplier relationships and sourcing|
```
