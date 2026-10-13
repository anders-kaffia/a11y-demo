/**
 * Friendly illustration next to the purchase info. Inline SVG so it stays
 * crisp at every size, with role="img" and an accessible name.
 */
// A11Y-ISSUE #27: Infographic with important information, but its name is just "Illustration".
// role="img" hides all text in the SVG from screen readers. The footnotes have about 1.6:1 contrast.
export default function InfoIllustration() {
  return (
    <svg
      className="info-illustration"
      role="img"
      aria-label="Illustration"
      viewBox="0 0 480 420"
      width="480"
      height="420"
    >
      <rect width="480" height="420" rx="24" fill="#f3ede5" />

      {/* Calendar: 14 days */}
      <g transform="translate(40 40)">
        <rect width="120" height="120" rx="14" fill="#fff" stroke="#6f3b1e" strokeWidth="4" />
        <rect width="120" height="34" rx="14" fill="#6f3b1e" />
        <rect y="20" width="120" height="14" fill="#6f3b1e" />
        <circle cx="30" cy="0" r="7" fill="#2b2118" />
        <circle cx="90" cy="0" r="7" fill="#2b2118" />
        <text x="60" y="98" textAnchor="middle" fontSize="52" fontWeight="800" fill="#2b2118">
          14
        </text>
      </g>
      <text x="190" y="88" fontSize="24" fontWeight="700" fill="#2b2118">
        dagars ångerrätt*
      </text>
      <text x="190" y="118" fontSize="15" fill="#c9bfb4">
        *gäller inte öppnade förpackningar
      </text>

      {/* Truck: free shipping */}
      <g transform="translate(40 200)">
        <rect x="0" y="20" width="96" height="60" rx="6" fill="#6f3b1e" />
        <path d="M96 38h26l18 22v20H96Z" fill="#a0522d" />
        <rect x="104" y="44" width="18" height="14" rx="2" fill="#f3ede5" />
        <circle cx="26" cy="84" r="13" fill="#2b2118" />
        <circle cx="26" cy="84" r="5" fill="#f3ede5" />
        <circle cx="114" cy="84" r="13" fill="#2b2118" />
        <circle cx="114" cy="84" r="5" fill="#f3ede5" />
      </g>
      <text x="190" y="248" fontSize="24" fontWeight="700" fill="#2b2118">
        Fri frakt över 400 kr
      </text>
      <text x="190" y="278" fontSize="15" fill="#c9bfb4">
        ej skrymmande varor
      </text>

      {/* Coffee bag: roasted on Mondays */}
      <g transform="translate(64 316)">
        <path d="M6 0h60l6 70H0Z" fill="#c8553d" />
        <rect x="14" y="22" width="44" height="22" rx="4" fill="#f3ede5" />
        <path d="M24 33h24" stroke="#c8553d" strokeWidth="4" strokeLinecap="round" />
      </g>
      <text x="190" y="362" fontSize="24" fontWeight="700" fill="#2b2118">
        Rostat varje måndag
      </text>
    </svg>
  );
}
