/**
 * A stylised electrolysis cell: filtered water in at the bottom, eight plates,
 * two streams out of the top. It explains the idea — it is not a drawing of
 * the K8's internals, and it is always captioned as an illustration.
 */
export function CellSchematic({ className = "" }: { className?: string }) {
  const xs = Array.from({ length: 8 }, (_, i) => 78 + i * 29);
  return (
    <svg viewBox="0 0 360 420" role="img" aria-label="Illustration of an electrolysis cell with eight plates: filtered water in, two streams out" className={className}>
      <defs>
        <linearGradient id="kw-cell-plate" x1="0" x2="1">
          <stop offset="0" stopColor="#9aa3a9" />
          <stop offset="0.45" stopColor="#f4f6f7" />
          <stop offset="1" stopColor="#a5aeb4" />
        </linearGradient>
        <linearGradient id="kw-cell-water" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#e3f0f4" />
          <stop offset="1" stopColor="#c9e3ea" />
        </linearGradient>
        <marker id="kw-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#2b6a88" />
        </marker>
      </defs>

      <rect x="52" y="78" width="256" height="264" rx="20" fill="url(#kw-cell-water)" stroke="#0e1113" strokeOpacity="0.55" strokeWidth="1.25" />
      {xs.map((x) => (
        <rect key={x} x={x} y="104" width="9" height="212" rx="2.5" fill="url(#kw-cell-plate)" stroke="#5c666c" strokeOpacity="0.5" strokeWidth="0.75" />
      ))}

      <line x1="180" y1="404" x2="180" y2="350" stroke="#2b6a88" strokeWidth="1.5" markerEnd="url(#kw-arrow)" />
      <text x="192" y="396" fontSize="13" fill="#5b636c">Filtered water in</text>

      <line x1="118" y1="72" x2="118" y2="22" stroke="#2b6a88" strokeWidth="1.5" markerEnd="url(#kw-arrow)" />
      <line x1="242" y1="72" x2="242" y2="22" stroke="#2b6a88" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#kw-arrow)" />
      <text x="110" y="16" fontSize="13" fill="#15181c" textAnchor="end">To the flexible pipe</text>
      <text x="250" y="16" fontSize="13" fill="#5b636c">To the sink</text>
    </svg>
  );
}
