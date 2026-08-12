'use client';

import { useMemo, useState } from 'react';
import { useCart } from './CartProvider';
import type { ProductVariant } from '@/types/shopify';

type ProductPurchaseControlsProps = {
  variants: ProductVariant[];
  productTitle: string;
  compact?: boolean;
};

type OptionSelections = Record<string, string>;

export function ProductPurchaseControls({ variants, productTitle, compact = false }: ProductPurchaseControlsProps) {
  const availableVariants = useMemo(
    () => variants.filter((variant) => variant.availableForSale && !variant.id.startsWith('demo-')),
    [variants]
  );
  const requiresChoice = availableVariants.length > 1;
  const optionNames = useMemo(() => getOptionNames(availableVariants), [availableVariants]);
  const hasStructuredOptions = requiresChoice && optionNames.length > 0;
  const [selections, setSelections] = useState<OptionSelections>({});
  const [fallbackVariantId, setFallbackVariantId] = useState(requiresChoice ? '' : availableVariants[0]?.id || '');
  const selectedVariant = hasStructuredOptions
    ? findMatchingVariant(availableVariants, optionNames, selections)
    : availableVariants.find((variant) => variant.id === fallbackVariantId);
  const selectedVariantId = selectedVariant?.id || '';
  const { add, buyNow, loading, error } = useCart();

  async function addSelected() {
    if (!selectedVariantId) return;
    await add(selectedVariantId);
  }

  async function buySelected() {
    if (!selectedVariantId) return;
    await buyNow(selectedVariantId);
  }

  function selectOption(name: string, value: string) {
    setSelections((current) => ({ ...current, [name]: value }));
  }

  if (!availableVariants.length) {
    return <div><button className="button primary full" disabled>Currently Unavailable</button><p className="dev-note">This product is not available to purchase right now.</p></div>;
  }

  return (
    <div className={compact ? 'variant-purchase compact' : 'variant-purchase'}>
      {hasStructuredOptions && (
        <fieldset className="variant-selector">
          <legend>Choose your option</legend>
          <div style={{ display: 'grid', gridTemplateColumns: optionNames.length > 1 && !compact ? 'repeat(auto-fit, minmax(180px, 1fr))' : '1fr', gap: compact ? '.55rem' : '.75rem' }}>
            {optionNames.map((name) => {
              const values = valuesForOption(availableVariants, name, selections);
              return (
                <label key={name} style={{ display: 'grid', gap: '.38rem' }}>
                  <span style={{ color: '#aeb9b0', fontSize: compact ? '.62rem' : '.68rem', fontWeight: 850, letterSpacing: '.12em', textTransform: 'uppercase' }}>{cleanOptionName(name)}</span>
                  <select
                    aria-label={`${cleanOptionName(name)} for ${productTitle}`}
                    value={selections[name] || ''}
                    onChange={(event) => selectOption(name, event.target.value)}
                    style={selectStyle(compact)}
                  >
                    <option value="">Select {cleanOptionName(name).toLowerCase()}</option>
                    {values.map((value) => <option value={value} key={value}>{cleanOptionValue(value)}</option>)}
                  </select>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {requiresChoice && !hasStructuredOptions && (
        <fieldset className="variant-selector">
          <legend>Choose option</legend>
          <select
            aria-label={`Choose an option for ${productTitle}`}
            value={fallbackVariantId}
            onChange={(event) => setFallbackVariantId(event.target.value)}
            style={selectStyle(compact)}
          >
            <option value="">Select an option</option>
            {availableVariants.map((variant) => (
              <option value={variant.id} key={variant.id}>{variantLabel(variant)}</option>
            ))}
          </select>
        </fieldset>
      )}

      {selectedVariant ? (
        <>
          <p className="selected-variant-note">Selected: <strong>{variantLabel(selectedVariant)}</strong></p>
          <button className="button primary full" disabled={loading} onClick={addSelected}>{loading ? 'Adding...' : 'Add To Bag'}</button>
          <button className="button secondary dark full" disabled={loading} onClick={buySelected}>{loading ? 'Opening Checkout...' : 'Buy Now'}</button>
        </>
      ) : requiresChoice ? (
        <>
          {!compact && <p className="selected-variant-note">Choose your options to continue.</p>}
          <button className="button primary full" disabled>Select Options</button>
        </>
      ) : null}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

function getOptionNames(variants: ProductVariant[]) {
  const names: string[] = [];
  for (const variant of variants) {
    for (const option of variant.selectedOptions || []) {
      if (!option.value || option.value === 'Default Title' || option.name.toLowerCase() === 'title') continue;
      if (!names.includes(option.name)) names.push(option.name);
    }
  }
  return names;
}

function findMatchingVariant(variants: ProductVariant[], optionNames: string[], selections: OptionSelections) {
  if (optionNames.some((name) => !selections[name])) return undefined;
  return variants.find((variant) => optionNames.every((name) => optionValue(variant, name) === selections[name]));
}

function valuesForOption(variants: ProductVariant[], optionName: string, selections: OptionSelections) {
  const otherSelections = Object.entries(selections).filter(([name, value]) => name !== optionName && value);
  const values = variants
    .filter((variant) => otherSelections.every(([name, value]) => optionValue(variant, name) === value))
    .map((variant) => optionValue(variant, optionName))
    .filter((value): value is string => Boolean(value));
  return [...new Set(values)];
}

function optionValue(variant: ProductVariant, name: string) {
  return variant.selectedOptions?.find((option) => option.name === name)?.value;
}

function cleanOptionName(name: string) {
  return name.replace(/[_-]+/g, ' ').trim();
}

function cleanOptionValue(value: string) {
  return value.replace(/\s*\(Lefty Golfer\)\s*/i, ' · Lefty Golfer').trim();
}

function selectStyle(compact: boolean) {
  return {
    width: '100%',
    minHeight: compact ? 42 : 50,
    padding: compact ? '0.55rem 0.7rem' : '0.75rem 0.9rem',
    border: '1px solid rgba(230,255,225,.18)',
    borderRadius: 3,
    background: '#0c110d',
    color: '#f2f6ef',
    font: 'inherit',
    fontSize: compact ? '.72rem' : '.86rem',
    fontWeight: 700,
    letterSpacing: '.03em',
    cursor: 'pointer'
  } as const;
}

function variantLabel(variant: ProductVariant) {
  const selectedOptions = variant.selectedOptions?.filter((option) => option.value && option.value !== 'Default Title') || [];
  if (selectedOptions.length) return selectedOptions.map((option) => option.name.toLowerCase() === 'title' ? cleanOptionValue(option.value) : `${cleanOptionName(option.name)}: ${cleanOptionValue(option.value)}`).join(' / ');
  return variant.title === 'Default Title' ? 'Default option' : variant.title;
}
