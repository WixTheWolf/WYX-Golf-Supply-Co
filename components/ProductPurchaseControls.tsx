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
  const realVariants = useMemo(() => variants.filter((variant) => !variant.id.startsWith('demo-')), [variants]);
  const availableVariants = useMemo(() => realVariants.filter((variant) => variant.availableForSale), [realVariants]);
  const optionNames = useMemo(() => getOptionNames(realVariants), [realVariants]);
  const hasStructuredOptions = realVariants.length > 1 && optionNames.length > 0;
  const requiresChoice = hasStructuredOptions || availableVariants.length > 1;
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
          <div className="variant-option-groups">
            {optionNames.map((name) => {
              const values = valuesForOption(realVariants, name, selections);
              const buttonStyle = isButtonOption(name);
              return (
                <div className="variant-option-group" key={name}>
                  <span className="variant-option-label">{cleanOptionName(name)}</span>
                  {buttonStyle ? (
                    <div className="variant-chip-row" role="group" aria-label={`${cleanOptionName(name)} for ${productTitle}`}>
                      {values.map((value) => {
                        const available = optionValueIsAvailable(realVariants, name, value, selections);
                        const selected = selections[name] === value;
                        return (
                          <button
                            type="button"
                            key={value}
                            className={`variant-chip${selected ? ' selected' : ''}${available ? '' : ' unavailable'}`}
                            aria-pressed={selected}
                            disabled={!available}
                            onClick={() => selectOption(name, value)}
                          >
                            {cleanOptionValue(value)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <select
                      className="variant-select"
                      aria-label={`${cleanOptionName(name)} for ${productTitle}`}
                      value={selections[name] || ''}
                      onChange={(event) => selectOption(name, event.target.value)}
                    >
                      <option value="">Select {cleanOptionName(name).toLowerCase()}</option>
                      {values.map((value) => (
                        <option value={value} key={value} disabled={!optionValueIsAvailable(realVariants, name, value, selections)}>
                          {cleanOptionValue(value)}{optionValueIsAvailable(realVariants, name, value, selections) ? '' : ' — Sold out'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>
      )}

      {requiresChoice && !hasStructuredOptions && (
        <fieldset className="variant-selector">
          <legend>Choose option</legend>
          <select
            className="variant-select"
            aria-label={`Choose an option for ${productTitle}`}
            value={fallbackVariantId}
            onChange={(event) => setFallbackVariantId(event.target.value)}
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
          {!compact && <p className="selected-variant-note">Choose the available option you want to continue.</p>}
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
  const matching = variants.filter((variant) => otherSelections.every(([name, value]) => optionValue(variant, name) === value));
  const values = matching.map((variant) => optionValue(variant, optionName)).filter((value): value is string => Boolean(value));
  return [...new Set(values)];
}

function optionValueIsAvailable(variants: ProductVariant[], optionName: string, value: string, selections: OptionSelections) {
  const otherSelections = Object.entries(selections).filter(([name, selected]) => name !== optionName && selected);
  return variants.some((variant) =>
    variant.availableForSale
    && optionValue(variant, optionName) === value
    && otherSelections.every(([name, selected]) => optionValue(variant, name) === selected)
  );
}

function optionValue(variant: ProductVariant, name: string) {
  return variant.selectedOptions?.find((option) => option.name === name)?.value;
}

function isButtonOption(name: string) {
  const normalized = cleanOptionName(name).toLowerCase();
  return normalized === 'size' || normalized === 'waist' || normalized === 'shoe size';
}

function cleanOptionName(name: string) {
  return name.replace(/[_-]+/g, ' ').trim();
}

function cleanOptionValue(value: string) {
  return value.replace(/\s*\(Lefty Golfer\)\s*/i, ' · Lefty Golfer').trim();
}

function variantLabel(variant: ProductVariant) {
  const selectedOptions = variant.selectedOptions?.filter((option) => option.value && option.value !== 'Default Title') || [];
  if (selectedOptions.length) return selectedOptions.map((option) => option.name.toLowerCase() === 'title' ? cleanOptionValue(option.value) : `${cleanOptionName(option.name)}: ${cleanOptionValue(option.value)}`).join(' / ');
  return variant.title === 'Default Title' ? 'Default option' : variant.title;
}
