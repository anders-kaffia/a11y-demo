/**
 * Notification toast. Uses role="status" so screen readers announce it politely.
 */
export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div role="status" className="toast">
      {message}
    </div>
  );
}
