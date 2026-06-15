import Script from 'next/script';

const shopDomain = process.env.NEXT_PUBLIC_JUDGE_ME_SHOP_DOMAIN || 'wyxgolfsupply.myshopify.com';
const publicToken = process.env.NEXT_PUBLIC_JUDGE_ME_PUBLIC_TOKEN;

/** Judge.me widgets — install app in Shopify Admin, then add token to Vercel. */
export function JudgeMeScripts() {
  if (!publicToken) return null;
  return (
    <>
      <Script id="judge-me-config" strategy="afterInteractive">
        {`window.jdgm=window.jdgm||{};jdgm.SHOP_DOMAIN='${shopDomain}';jdgm.PUBLIC_TOKEN='${publicToken}';`}
      </Script>
      <Script src="https://cdn.judge.me/widget.js" strategy="afterInteractive" />
    </>
  );
}

type JudgeMeReviewsProps = {
  productId?: string;
  productTitle?: string;
};

export function JudgeMeProductReviews({ productId, productTitle }: JudgeMeReviewsProps) {
  if (!publicToken) {
    return (
      <div className="judge-me-placeholder conversion-panel">
        <strong>Reviews coming soon</strong>
        <p>We&apos;re a new shop — honest reviews publish after our first customer orders. Every product passes The Bag Test before it lists.</p>
      </div>
    );
  }
  return (
    <div
      className="jdgm-widget jdgm-review-widget"
      data-id={productId}
      data-product-title={productTitle}
      data-auto-install="false"
    />
  );
}

export function JudgeMeStoreBadge() {
  if (!publicToken) return null;
  return <div className="jdgm-widget jdgm-all-reviews-text" data-from-snippet="true" />;
}