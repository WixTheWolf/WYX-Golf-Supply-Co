import Link from 'next/link';

type Props = {
  subtotal?: number;
  compact?: boolean;
};

export function KitUpsellBanner({ subtotal = 0, compact = false }: Props) {
  const remaining = Math.max(0, 75 - subtotal);

  return (
    <div className={`kit-upsell${compact ? ' compact' : ''}`} aria-label="Bag Upgrade Kit upsell">
      <div>
        <strong>{compact ? 'Add the Bag Upgrade Kit' : 'Complete the bag upgrade'}</strong>
        <p>
          {remaining > 0
            ? `Five fixes in one kit — towel, marker, grip, groove tool, caddie. ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(remaining)} from the $75 shipping goal.`
            : 'Five practical upgrades in one order. WYX10 auto-applied at checkout.'}
        </p>
      </div>
      <Link className="button secondary compact" href="/weekend-golfer-bag-upgrade-kit?discount=WYX10">
        {compact ? 'View Kit' : 'Shop The Kit'}
      </Link>
    </div>
  );
}