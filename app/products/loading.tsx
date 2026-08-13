export default function ShopLoading() {
  return <div className="lux-loading" aria-label="Loading the WYX edit"><div className="lux-loading__hero lux-skeleton" /><div className="lux-loading__grid">{Array.from({ length: 8 }, (_, index) => <div className="lux-skeleton" key={index} />)}</div></div>;
}
