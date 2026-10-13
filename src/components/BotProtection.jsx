import { useEffect, useRef } from 'react';

/**
 * Invisible bot protection (stand-in for an invisible reCAPTCHA widget).
 * It is visually hidden so it doesn't disturb the design, but it stays
 * available to assistive technology, and it has a proper label.
 */
export default function BotProtection() {
  const checkboxRef = useRef(null);

  // The widget needs focus to start its "human interaction" check
  useEffect(() => {
    checkboxRef.current?.focus();
  }, []);

  return (
    <div className="visually-hidden">
      <input ref={checkboxRef} type="checkbox" id="bot-check" />
      <label htmlFor="bot-check">Jag är inte en robot</label>
      <p>Skyddas av reCAPTCHA. Integritet – Villkor</p>
    </div>
  );
}
