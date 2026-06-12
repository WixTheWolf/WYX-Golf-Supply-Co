export default function Loading() {
  return (
    <section className="page-hero" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="skeleton" style={{ width: '8rem', height: '.85rem', marginBottom: '1.2rem' }} />
      <div className="skeleton" style={{ width: '70%', height: '3.4rem', marginBottom: '1rem' }} />
      <div className="skeleton" style={{ width: '92%', height: '1rem', marginBottom: '.5rem' }} />
      <div className="skeleton" style={{ width: '64%', height: '1rem', marginBottom: '2rem' }} />
      <div className="product-grid skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="product-card" key={i}>
            <div className="skeleton" style={{ aspectRatio: '4/3' }} />
            <div className="product-card-body">
              <div className="skeleton" style={{ width: '40%', height: '.7rem', marginBottom: '.6rem' }} />
              <div className="skeleton" style={{ width: '82%', height: '1.4rem', marginBottom: '.6rem' }} />
              <div className="skeleton" style={{ width: '46%', height: '1.1rem' }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
