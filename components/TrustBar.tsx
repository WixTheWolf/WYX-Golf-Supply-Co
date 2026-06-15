import Link from 'next/link';

const badges = [
  { label: 'Secure Checkout', detail: 'Shopify payments' },
  { label: 'Bag Test Standard', detail: 'Curated for weekend bags', href: '/the-bag-test' },
  { label: 'WYX10', detail: '10% off first order' },
  { label: '30-Day Promise', detail: 'We make it right', href: '/shipping-returns' },
];

export function TrustBar({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`trust-bar${compact ? ' compact' : ''}`} aria-label="Why shop WYX">
      {badges.map((badge) => (
        badge.href ? (
          <Link key={badge.label} href={badge.href} className="trust-bar-item">
            <strong>{badge.label}</strong>
            <span>{badge.detail}</span>
          </Link>
        ) : (
          <div key={badge.label} className="trust-bar-item">
            <strong>{badge.label}</strong>
            <span>{badge.detail}</span>
          </div>
        )
      ))}
    </div>
  );
}