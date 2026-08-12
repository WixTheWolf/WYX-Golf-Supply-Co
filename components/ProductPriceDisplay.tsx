import { priceWithWyx10 } from '@/lib/pricing';
import type { Money } from '@/types/shopify';

type Props = {
  price: Money;
  showSavings?: boolean;
  large?: boolean;
};

export function ProductPriceDisplay({ price, showSavings = true, large = true }: Props) {
  const { formattedBase, formattedSale } = priceWithWyx10(price);

  return (
    <div className={`product-price-display premium-price${large ? ' large' : ''}`}>
      <span className="product-price-base">{formattedBase}</span>
      {showSavings && (
        <p className="product-price-first-order">
          First WYX order? <strong>{formattedSale}</strong> with WYX10 when eligible.
        </p>
      )}
    </div>
  );
}
