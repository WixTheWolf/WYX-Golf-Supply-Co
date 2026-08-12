export type SizingGuide = {
  title: string;
  rows: Array<{ label: string; detail: string }>;
  tip: string;
};

/**
 * Only return sizing guidance when it has been verified against the supplier's
 * product-specific chart. Generic chest, glove, hat, belt, or shoe measurements
 * are intentionally not shown because they can create bad fit expectations.
 *
 * Add future verified guides by exact product title/handle through product data,
 * not by broad category assumptions.
 */
export function sizingGuideFor(_category: string, _title: string): SizingGuide | null {
  return null;
}
