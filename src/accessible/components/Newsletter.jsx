import { useRef, useState } from 'react';

/**
 * Newsletter sign-up placed in the page instead of a pop-up. Errors are shown as text next to the
 * field, and the confirmation stays on screen.
 */
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const inputRef = useRef(null);
  const doneRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Skriv en e-postadress, till exempel namn@exempel.se.');
      inputRef.current.focus();
      return;
    }
    setDone(email);
    // Wait for the confirmation to render, then move focus to it
    setTimeout(() => doneRef.current?.focus());
  };

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <h2 id="newsletter-title">Nyhetsbrev: få 10 % rabatt</h2>
      {done ? (
        <div className="confirmation" tabIndex={-1} ref={doneRef}>
          <p>
            <strong>Tack! Du är nästan klar.</strong>
          </p>
          <p>
            Vi har skickat ett mejl till {done}. Klicka på länken i mejlet för att börja få
            nyhetsbrevet. Där finns också din rabattkod.
          </p>
        </div>
      ) : (
        <>
          <p>Vi skickar tips och erbjudanden ungefär två gånger i månaden. Du kan sluta när du vill.</p>
          <form onSubmit={handleSubmit} noValidate className="newsletter-form">
            <label htmlFor="newsletter-email">E-postadress</label>
            {error && (
              <p id="newsletter-error" className="field-error">
                <strong>Fel:</strong> {error}
              </p>
            )}
            <input
              id="newsletter-email"
              ref={inputRef}
              type="email"
              autoComplete="email"
              value={email}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={error ? 'newsletter-error' : undefined}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
            <button type="submit" className="primary">
              Prenumerera på nyhetsbrevet
            </button>
          </form>
        </>
      )}
    </section>
  );
}
