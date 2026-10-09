import { useState } from 'react';

/**
 * Accessible modal dialog: role="dialog", aria-modal, labelled and described,
 * real <label> on the input and a named close button.
 */
export default function NewsletterDialog({ onClose, onSubscribe }) {
  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setInvalid(true);
      return;
    }
    onSubscribe(email);
  };

  return (
    <div className="backdrop">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-title"
        aria-describedby="newsletter-desc"
        className="dialog"
      >
        <h2 id="newsletter-title">Get 10% off your first order</h2>
        <p id="newsletter-desc">
          Join our newsletter for brewing tips, new arrivals and members-only offers.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="newsletter-email">Email</label>
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            value={email}
            className={invalid ? 'invalid' : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              setInvalid(false);
            }}
          />
          <button type="submit" className="primary">
            Subscribe
          </button>
        </form>

        <button type="button" className="dialog-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}
