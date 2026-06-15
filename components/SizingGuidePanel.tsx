import type { SizingGuide } from '@/lib/sizingGuides';

export function SizingGuidePanel({ guide }: { guide: SizingGuide }) {
  return (
    <div className="sizing-guide conversion-panel" aria-label={guide.title}>
      <strong>{guide.title}</strong>
      <ul>
        {guide.rows.map((row) => (
          <li key={row.label}><strong>{row.label}</strong> — {row.detail}</li>
        ))}
      </ul>
      <p className="sizing-tip">{guide.tip}</p>
    </div>
  );
}