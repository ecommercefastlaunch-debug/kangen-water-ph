import { useId } from "react";

/**
 * How the K8 sits at a sink, drawn the way the manual draws it (EN10, EN13):
 *
 *   tap → diverter on the spout → supply hose → the K8's inlet underneath
 *   the K8's top connector → flexible outlet, swung over the sink
 *   the K8's base → secondary pipe → into the sink
 *
 * The flexible outlet is never connected to the faucet. Carried over from the
 * owner's earlier K8 page; labels enlarged so they stay legible on a phone.
 */
export function ConnectDiagram({ className = "" }: { className?: string }) {
  const uid = useId();

  return (
    <svg viewBox="0 0 640 520" role="img" aria-labelledby={`${uid}-title ${uid}-desc`} className={className}>
      <title id={`${uid}-title`}>How the K8 connects to a kitchen faucet</title>
      <desc id={`${uid}-desc`}>
        A diverter fits on the faucet spout. A supply hose carries tap water from the diverter to the K8&apos;s inlet
        underneath. Processed water leaves through the flexible outlet on top of the machine, over the sink. A
        secondary pipe from the base carries the second stream into the sink.
      </desc>

      {/* Counter, sink and cabinet */}
      <path d="M20 382 H620" stroke="#0e1113" strokeOpacity="0.55" strokeWidth="1.25" />
      <path
        d="M60 382 V440 Q60 468 88 468 H272 Q300 468 300 440 V382"
        fill="#f2f8fa"
        stroke="#0e1113"
        strokeOpacity="0.4"
        strokeWidth="1.25"
      />
      <path d="M20 392 H620" stroke="#0e1113" strokeOpacity="0.12" />

      {/* Faucet */}
      <path d="M244 382 V214 C244 150 150 146 150 204 V212" fill="none" stroke="#8b949a" strokeWidth="10" strokeLinecap="round" />
      <path d="M244 382 V214 C244 150 150 146 150 204 V212" fill="none" stroke="#e4e8eb" strokeWidth="5" strokeLinecap="round" />
      <rect x="230" y="370" width="28" height="12" rx="3" fill="#c7ced3" />

      {/* Diverter on the spout, with its lever */}
      <rect x="134" y="210" width="34" height="34" rx="7" fill="#ffffff" stroke="#0e1113" strokeOpacity="0.7" strokeWidth="1.25" />
      <path d="M168 222 H186" stroke="#0e1113" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />

      {/* Supply hose: diverter → K8 inlet underneath */}
      <path d="M151 244 C151 300 190 372 260 376 L470 376" fill="none" stroke="#9aa3a9" strokeWidth="8" strokeLinecap="round" />
      <path d="M151 244 C151 300 190 372 260 376 L470 376" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
      <path className="flow-dash" d="M151 244 C151 300 190 372 260 376 L470 376" fill="none" stroke="#9aa3a9" strokeWidth="2" strokeLinecap="round" />

      {/* The K8 */}
      <rect x="400" y="188" width="156" height="180" rx="14" fill="#ffffff" stroke="#0e1113" strokeOpacity="0.7" strokeWidth="1.25" />
      <path d="M400 300 H556" stroke="#0e1113" strokeOpacity="0.15" />
      <rect x="466" y="206" width="26" height="72" rx="4" fill="#0a0c0f" />
      <rect x="470" y="220" width="18" height="44" rx="2" fill="#1765b0" opacity="0.85" />
      <rect x="520" y="330" width="16" height="16" rx="3" fill="#8b949a" opacity="0.5" />
      <rect x="452" y="170" width="30" height="20" rx="4" fill="#ffffff" stroke="#0e1113" strokeOpacity="0.7" strokeWidth="1.25" />
      {[414, 446, 510, 540].map((x) => (
        <rect key={x} x={x} y="368" width="8" height="13" rx="2" fill="#e4e8eb" stroke="#0e1113" strokeOpacity="0.4" />
      ))}

      {/* Flexible outlet: top connector → over the sink */}
      <path d="M452 180 C360 128 292 150 286 232 V300" fill="none" stroke="#9aa3a9" strokeWidth="9" strokeLinecap="round" />
      <path d="M452 180 C360 128 292 150 286 232 V300" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
      <path className="flow-dash" style={{ animationDelay: "0.4s" }} d="M452 180 C360 128 292 150 286 232 V300" fill="none" stroke="#3597bd" strokeWidth="2.25" strokeLinecap="round" />
      <path className="flow-dash" style={{ animationDelay: "0.8s" }} d="M286 304 V396" stroke="#3597bd" strokeWidth="2.5" strokeLinecap="round" />
      {/* A glass in the sink, catching it */}
      <path d="M268 390 L272 450 H300 L304 390 Z" fill="#e3f0f4" stroke="#0e1113" strokeOpacity="0.5" strokeWidth="1.25" />

      {/* Secondary pipe: base → into the sink */}
      <path d="M430 380 C400 400 340 392 318 404 L300 426" fill="none" stroke="#9aa3a9" strokeWidth="6" strokeLinecap="round" />
      <path d="M430 380 C400 400 340 392 318 404 L300 426" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />

      {/* Labels */}
      <g fontSize="19" fill="#373e43" fontFamily="inherit">
        <path d="M134 227 H112" stroke="#5c666c" strokeWidth="0.75" />
        <text x="16" y="221">Diverter</text>
        <text x="16" y="243" fill="#5c666c" fontSize="15">tap / K8 lever</text>

        <path d="M330 376 V336" stroke="#5c666c" strokeWidth="0.75" />
        <text x="276" y="328">Supply hose</text>

        <path d="M372 142 V112" stroke="#5c666c" strokeWidth="0.75" />
        <text x="372" y="102" textAnchor="middle">Flexible outlet</text>
        <text x="372" y="78" textAnchor="middle" fill="#5c666c" fontSize="15">your chosen water</text>

        <path d="M372 396 V484" stroke="#5c666c" strokeWidth="0.75" />
        <text x="380" y="502">Secondary pipe, to the sink</text>

        <text x="478" y="158" textAnchor="middle" fill="#0e1113" fontWeight="600">K8</text>
      </g>
    </svg>
  );
}
