import Link from 'next/link';

export function ComingSoonCard({ title, body, href = '/the-roo' }: { title: string; body: string; href?: string }) {
  return (
    <article className="coming-soon-card">
      <p className="eyebrow">Coming Soon</p>
      <h3>{title}</h3>
      <p>{body}</p>
      <Link className="text-link" href={href}>Join The List</Link>
    </article>
  );
}

