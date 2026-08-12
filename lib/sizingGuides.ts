export type SizingGuide = {
  title: string;
  rows: Array<{ label: string; detail: string }>;
  tip: string;
};

const gloveSizing: SizingGuide = {
  title: 'Glove sizing',
  rows: [
    { label: 'S', detail: '7¼" hand circumference' },
    { label: 'M', detail: '7¾" — most men' },
    { label: 'ML', detail: '8" — in-between' },
    { label: 'L', detail: '8¼" — larger hands' },
    { label: 'XL', detail: '8½"+' },
  ],
  tip: 'Measure around your palm below the knuckles, excluding thumb. Cadet = shorter fingers, same palm width.',
};

const hatSizing: SizingGuide = {
  title: 'Hat fit',
  rows: [
    { label: 'Adjustable', detail: 'Snapback / strap — one size' },
    { label: 'Stretch fit', detail: 'Fits 7–7⅝ typical' },
  ],
  tip: 'Unstructured dad caps fit most head sizes. Rope hats run slightly shallow — great for average builds.',
};

const apparelSizing: SizingGuide = {
  title: 'Apparel sizing',
  rows: [
    { label: 'S', detail: 'Chest 34–36"' },
    { label: 'M', detail: 'Chest 38–40"' },
    { label: 'L', detail: 'Chest 42–44"' },
    { label: 'XL', detail: 'Chest 46–48"' },
  ],
  tip: 'Use the listed garment size as the starting point and review the product options before checkout.',
};

export function sizingGuideFor(category: string, title: string): SizingGuide | null {
  const text = `${category} ${title}`.toLowerCase();
  if (category === 'Gloves' || text.includes('glove')) return gloveSizing;
  if (category === 'Headwear' || /\b(hat|cap)\b/.test(text)) return hatSizing;
  // Belts need product-specific waist/trim guidance. Never reuse shirt chest sizing.
  if (/\bbelt\b/.test(text) || title.toLowerCase() === 'volcanic ash') return null;
  if (category === 'Apparel' || /\b(polo|shirt|hoodie|quarter|jacket|sock)\b/.test(text)) return apparelSizing;
  return null;
}
