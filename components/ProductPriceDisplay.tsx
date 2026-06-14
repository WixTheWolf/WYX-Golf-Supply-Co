import { priceWithWyx10 } from '@/lib/pricing';
import type { Money } from '@/types/shopify';

type Props = {
  price: Money;
  showSavings?: boolean;
  large?: boolean;
};

export function ProductPriceDisplay({ price, showSavings = true, large = true }: Props) {
  const { formattedBase, formattedSale, savings } = priceWithWyx10(price);

  return (
    <div className={`product-price-display${large ? ' large' : ''}`}>
      <span className="product-price-sale">{formattedSale}</span>
      <span className="product-price-was">{formattedBase}</span>
      <span className="product-price-code">with WYX10</span>
      {showSavings && <p className="product-price-savings">You save {savings} on your first order.</p>}
    </div>
  );
}