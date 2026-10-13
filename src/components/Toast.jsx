/**
 * Notification toast. Uses role="status" so screen readers announce it politely.
 */
export default function Toast({ message }) {
  // A11Y-ISSUE #5: The live region is created together with its text – screen readers often miss it.
  if (!message) return null;

  return (
    <div role="status" className="toast">
      {message}
    </div>
  );
}
