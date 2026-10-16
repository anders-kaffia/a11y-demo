import { useEffect, useRef, useState } from 'react';

// Presenter tip: add ?tid=30 to the URL to shorten the reservation time (in seconds)
const RESERVATION_SECONDS =
  Number(new URLSearchParams(window.location.search).get('tid')) || 180;

const grindLevels = ['Hela bönor', 'Grovmalet (presskanna)', 'Mellanmalet (bryggare)', 'Finmalet (espresso)'];

// Decorative QR-like pattern for the payment step
const qrCells = Array.from({ length: 21 * 21 }, (_, i) => ((i * 7919) % 13) < 6);

const QrCode = () => (
  // A11Y-ISSUE #32: The only text alternative is "QR-kod" – nothing about what is being approved.
  <svg role="img" aria-label="QR-kod" width="168" height="168" viewBox="0 0 21 21" className="qr">
    <rect width="21" height="21" fill="#fff" />
    {qrCells.map((on, i) =>
      on ? <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" fill="#2b2118" /> : null
    )}
  </svg>
);

/**
 * Modern floating label: a real <label>, so every field has an accessible name.
 */
// A11Y-ISSUE #36: The label sits inside the field like a placeholder, shrinks to 11 px when you type
// and is cut off when it is long. No autocomplete, so nothing can be filled in automatically.
const FloatField = ({ id, label, type = 'text', inputMode }) => (
  <div className="float-field">
    <input id={id} type={type} inputMode={inputMode} placeholder=" " />
    <label htmlFor={id}>{label}</label>
  </div>
);

/**
 * Grind selector. A proper ARIA slider with a label, min/max, value and value text.
 */
function GrindSlider({ value, onChange }) {
  const trackRef = useRef(null);
  const max = grindLevels.length - 1;

  const setFromPointer = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    onChange(Math.round(ratio * max));
  };

  // A11Y-ISSUE #34: The value can only be changed by dragging the thumb. Clicking the track does
  // nothing, and the arrow keys do nothing even though the thumb is focusable and has role="slider".
  return (
    <div className="grind">
      <span id="grind-label" className="grind-label">Malning</span>
      <div className="grind-track" ref={trackRef}>
        <div
          role="slider"
          tabIndex={0}
          aria-labelledby="grind-label"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={grindLevels[value]}
          className="grind-thumb"
          style={{ left: `${(value / max) * 100}%` }}
          onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
          onPointerMove={(e) => {
            if (e.buttons) setFromPointer(e.clientX);
          }}
        />
      </div>
      <div className="grind-value">{grindLevels[value]}</div>
    </div>
  );
}

/**
 * Checkout in three clear steps, with a reservation timer so items are not sold twice.
 */
export default function Checkout({ cart, onBack, onExpire, onComplete }) {
  const [step, setStep] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(RESERVATION_SECONDS);
  const [grind, setGrind] = useState(0);
  const [paid, setPaid] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // A11Y-ISSUE #31: The reservation runs out without warning and cannot be extended. Everything the
  // user has filled in is thrown away, and nothing says whether the order went through.
  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return undefined;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const lines = Object.values(
    cart.reduce((acc, product) => {
      acc[product.id] ??= { product, quantity: 0 };
      acc[product.id].quantity += 1;
      return acc;
    }, {})
  );
  const total = cart.reduce((sum, p) => sum + (p.salePrice ?? p.price), 0);

  // A11Y-ISSUE #33: The same thing has different names: "Varukorg" in the header, "Kundvagn" here,
  // "Din order" in step 1 and "beställning" on the final button.
  // A11Y-ISSUE #32: Focus is not moved and nothing is announced when the step changes.
  return (
    <section className="checkout" aria-labelledby="checkout-title">
      <button type="button" className="link-button" onClick={onBack}>
        ← Fortsätt handla
      </button>
      <h1 id="checkout-title">Kundvagn</h1>
      <p className="checkout-timer">
        Din order reserveras i {minutes}:{seconds}
      </p>
      <p className="checkout-steps">Steg {step} av 3</p>

      {step === 1 && (
        <form
          className="checkout-form checkout-columns"
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
        >
          <div className="checkout-column">
            <h2>Din order</h2>
            <ul className="checkout-lines">
              {lines.map(({ product, quantity }) => (
                <li key={product.id}>
                  <span>
                    {quantity} × {product.name}
                  </span>
                  <span>{quantity * (product.salePrice ?? product.price)} kr</span>
                </li>
              ))}
            </ul>
            <p className="checkout-total">Summa: {total} kr inkl. moms, exkl. frakt</p>

            <GrindSlider value={grind} onChange={setGrind} />
          </div>

          <div className="checkout-column">
            <h2>Leveransuppgifter</h2>
            {/* A11Y-ISSUE #18: Abbreviations without explanation ("ev.", "c/o", "Postnr.", "OCR"). */}
            <FloatField id="co-name" label="Namn" />
            <FloatField id="co-address" label="Gatuadress" />
            <FloatField id="co-careof" label="c/o (ev.)" />
            <div className="checkout-row">
              <FloatField id="co-zip" label="Postnr." inputMode="numeric" />
              <FloatField id="co-city" label="Ort" />
            </div>
            <FloatField id="co-email" type="email" label="E-post (för OCR och leveransavisering)" />

            <button type="submit" className="primary">
              Fortsätt
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="checkout-form">
          <h2>Betalning</h2>
          {/* A11Y-ISSUE #32: The user is asked to approve something without being told what, to whom or how much. */}
          <p>Skanna QR-koden med appen på din mobil och godkänn.</p>
          <QrCode />
          {paid ? (
            // A11Y-ISSUE #32: A big green "approved" message looks like the end of the purchase, but the
            // order has not been sent. The button that follows only says "Fortsätt".
            <p className="checkout-paid">✓ Betalningen är godkänd</p>
          ) : (
            <button type="button" className="secondary" onClick={() => setPaid(true)}>
              Jag har godkänt i appen
            </button>
          )}
          <button type="button" className="primary" disabled={!paid} onClick={() => setStep(3)}>
            Fortsätt
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="checkout-form">
          <h2>Granska och slutför</h2>
          {/* A11Y-ISSUE #32: The button that actually sends the order is below a long block of terms. */}
          <div className="checkout-terms">
            <p>
              Genom att slutföra köpet bekräftar du att du har tagit del av och godkänner Brew &amp;
              Beans allmänna köpvillkor, inkl. villkor för leverans, reklamation och ångerrätt, samt
              att dina personuppgifter behandlas i enlighet med vår integritetspolicy och gällande
              dataskyddslagstiftning, bl.a. GDPR, för att fullgöra avtalet och för att skicka
              orderbekräftelse, leveransavisering och OCR-nummer till angiven e-postadress.
            </p>
            <p>
              Reservation av varor sker först när betalningen har bekräftats av betaltjänsten och
              ordern har registrerats i vårt system, vilket normalt sker inom några sekunder men
              under perioder med hög belastning kan ta längre tid, och om reservationstiden löper ut
              innan ordern har registrerats återgår varorna till lagret och betalningen återförs
              automatiskt inom 3–5 bankdagar.
            </p>
            <p>
              Leveranstiden räknas från den dag ordern har registrerats och beror på valt
              leveranssätt, se avsnittet Bra att veta inför ditt köp på startsidan. Vid köp av
              presentkort gäller särskilda villkor.
            </p>
          </div>
          <div className="filter-check">
            <input
              id="co-terms"
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <label htmlFor="co-terms">Jag godkänner köpvillkoren</label>
          </div>
          <button type="button" className="primary" disabled={!accepted} onClick={onComplete}>
            Skicka beställning
          </button>
        </div>
      )}
    </section>
  );
}
