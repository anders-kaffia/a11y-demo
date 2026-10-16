const confettiColors = ['#c8553d', '#e8a87c', '#6f3b1e', '#f2c14e', '#7ad38f', '#5b8def'];

// 28 pieces that burst up from the toast and fall away
const pieces = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI - Math.PI; // upper half circle
  const distance = 120 + ((i * 37) % 140);
  return {
    x: Math.round(Math.cos(angle) * distance * 1.4),
    up: Math.round(Math.abs(Math.sin(angle)) * distance) + 40,
    rotate: (i * 97) % 720,
    color: confettiColors[i % confettiColors.length],
    delay: (i % 5) * 30,
  };
});

/**
 * Notification toast. Uses role="status" so screen readers announce it politely.
 * A little confetti makes adding to the cart feel rewarding.
 */
export default function Toast({ toast }) {
  // A11Y-ISSUE #5: The live region is created together with its text – screen readers often miss it.
  if (!toast) return null;

  return (
    <>
      {/* A11Y-ISSUE #37: The animation ignores the user's "reduce motion" setting. */}
      {toast.confetti && (
        <div className="confetti" aria-hidden="true" key={toast.id}>
          {pieces.map((p, i) => (
            <span
              key={i}
              style={{
                '--x': `${p.x}px`,
                '--up': `${p.up}px`,
                '--r': `${p.rotate}deg`,
                background: p.color,
                animationDelay: `${p.delay}ms`,
              }}
            />
          ))}
        </div>
      )}
      <div role="status" className="toast">
        {toast.message}
      </div>
    </>
  );
}
