import { useEffect, useRef, useState } from 'react';
import { InfoIcon } from './ProductCard.jsx';

const steps = ['Varukorg och adress', 'Betalning', 'Granska och skicka'];
const grindOptions = ['Hela bönor', 'Grovmalet (för presskanna)', 'Mellanmalet (för bryggare)', 'Finmalet (för espresso)'];

const fields = [
  { id: 'name', label: 'Namn', autoComplete: 'name' },
  { id: 'address', label: 'Gatuadress', autoComplete: 'street-address' },
  { id: 'zip', label: 'Postnummer', autoComplete: 'postal-code', inputMode: 'numeric' },
  { id: 'city', label: 'Ort', autoComplete: 'address-level2' },
  { id: 'email', label: 'E-postadress', autoComplete: 'email', type: 'email', hint: 'Vi skickar bekräftelsen och fakturan hit.' },
];

/**
 * Checkout without a time limit. The same word ("varukorg", "beställning") is used everywhere, focus
 * moves to the heading of each new step, and the last page is a receipt with an order number.
 */
const errorText = (f) => `Fyll i ${f.label.toLowerCase()}${f.id === 'email' ? ', till exempel namn@exempel.se' : ''}.`;

export default function Checkout({ cart, details, onDetailsChange, onAdd, onRemove, onRemoveAll, onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [grind, setGrind] = useState(grindOptions[0]);
  const [errors, setErrors] = useState([]);
  const [order, setOrder] = useState(null);
  const [notice, setNotice] = useState('');
  const headingRef = useRef(null);
  const errorRef = useRef(null);
  const firstRender = useRef(true);
  const linesHeadingRef = useRef(null);
  const emptyHeadingRef = useRef(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, order]);

  useEffect(() => {
    if (errors.length) errorRef.current?.focus();
  }, [errors]);

  useEffect(() => {
    if (cart.length === 0) emptyHeadingRef.current?.focus();
  }, [cart.length]);

  // "Ta bort en" lowers the count; with only one left the same button says "Ta bort" and removes the line
  const decrease = (product, quantity) => {
    if (quantity > 1) {
      onRemove(product.id);
      setNotice(`Du tog bort en ${product.name}. Nu har du ${quantity - 1} st.`);
    } else {
      onRemoveAll(product.id);
      setNotice(`Du tog bort ${product.name} från varukorgen.`);
      linesHeadingRef.current?.focus();
    }
  };

  const increase = (product, quantity) => {
    onAdd(product);
    setNotice(`Du lade till en ${product.name}. Nu har du ${quantity + 1} st.`);
  };

  const lines = Object.values(
    cart.reduce((acc, product) => {
      acc[product.id] ??= { product, quantity: 0 };
      acc[product.id].quantity += 1;
      return acc;
    }, {})
  );
  const total = cart.reduce((sum, p) => sum + (p.salePrice ?? p.price), 0);

  if (order) {
    return (
      <section className="checkout" aria-labelledby="checkout-title">
        <h1 id="checkout-title" ref={headingRef} tabIndex={-1}>
          Tack! Din beställning är skickad
        </h1>
        <div className="confirmation">
          <p>
            Ordernummer: <strong>{order.number}</strong>
          </p>
          <p>Vi har skickat en bekräftelse till {order.email}. Du behöver inte göra något mer.</p>
          <p>Kaffet skickas nästa måndag när det har rostats.</p>
        </div>
        <button type="button" className="primary" onClick={onBack}>
          Tillbaka till butiken
        </button>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="checkout" aria-labelledby="checkout-title">
        <h1 id="checkout-title" ref={emptyHeadingRef} tabIndex={-1}>
          Varukorg
        </h1>
        <p>Din varukorg är tom.</p>
        <button type="button" className="primary" onClick={onBack}>
          Tillbaka till butiken
        </button>
      </section>
    );
  }

  const validate = (event) => {
    event.preventDefault();
    const missing = fields.filter((f) =>
      f.id === 'email' ? !/^\S+@\S+\.\S+$/.test(details.email) : !details[f.id].trim()
    );
    setErrors(missing.map((f) => f.id));
    if (missing.length === 0) setStep(1);
  };

  return (
    <section className="checkout" aria-labelledby="checkout-title">
      <button type="button" className="link-button" onClick={onBack}>
        Tillbaka till butiken
      </button>
      <h1 id="checkout-title">Varukorg</h1>
      <p>Det finns ingen tidsgräns. Det du fyller i sparas även om du går tillbaka till butiken.</p>

      <ol className="steps" aria-label="Steg i beställningen">
        {steps.map((label, i) => (
          <li key={label} aria-current={i === step ? 'step' : undefined} className={i < step ? 'done' : undefined}>
            Steg {i + 1}: {label}
          </li>
        ))}
      </ol>

      <h2 ref={headingRef} tabIndex={-1}>
        Steg {step + 1} av 3: {steps[step]}
      </h2>

      {step === 0 && (
        <form onSubmit={validate} noValidate className="checkout-form">
          {errors.length > 0 && (
            <div className="error-summary" ref={errorRef} tabIndex={-1}>
              <h3>Du behöver rätta {errors.length === 1 ? 'en sak' : `${errors.length} saker`}</h3>
              <ul>
                {errors.map((id) => {
                  const field = fields.find((f) => f.id === id);
                  return (
                    <li key={id}>
                      <a
                        href={`#co-${id}`}
                        aria-describedby={`summary-${id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(`co-${id}`).focus();
                        }}
                      >
                        {field.label}
                      </a>{' '}
                      <span id={`summary-${id}`}>– {errorText(field)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <h3 ref={linesHeadingRef} tabIndex={-1}>
            Det här ligger i din varukorg
          </h3>
          <div className={notice ? 'notice' : undefined}>
            {notice && <InfoIcon />}
            <p role="status" className="notice-body">{notice}</p>
            {notice && (
              <button
                type="button"
                className="notice-close"
                aria-label="Stäng meddelandet"
                onClick={() => {
                  setNotice('');
                  linesHeadingRef.current?.focus();
                }}
              >
                ×
              </button>
            )}
          </div>
          <ul className="checkout-lines">
            {lines.map(({ product, quantity }) => (
              <li key={product.id}>
                <p className="line-text">
                  <strong>{product.name}</strong>
                  <br />
                  {quantity} st, {quantity * (product.salePrice ?? product.price)} kr
                </p>
                {/* The product name is in every button's name, so it is clear which product they change */}
                <div className="line-buttons">
                  <button type="button" className="secondary" onClick={() => decrease(product, quantity)}>
                    {quantity > 1 ? 'Ta bort en' : 'Ta bort'}
                    <span className="visually-hidden"> {product.name}</span>
                  </button>
                  <button type="button" className="secondary" onClick={() => increase(product, quantity)}>
                    Lägg till en<span className="visually-hidden"> {product.name}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="checkout-total">Totalt: {total} kr med moms. Frakten väljer du i nästa steg.</p>

          <fieldset>
            <legend>Hur vill du ha kaffet?</legend>
            {grindOptions.map((option) => (
              <div className="radio" key={option}>
                <input
                  type="radio"
                  id={`grind-${option}`}
                  name="grind"
                  checked={grind === option}
                  onChange={() => setGrind(option)}
                />
                <label htmlFor={`grind-${option}`}>{option}</label>
              </div>
            ))}
          </fieldset>

          <h3>Vart ska vi skicka beställningen?</h3>
          <p>Alla fält måste fyllas i.</p>
          {fields.map((f) => {
            const invalid = errors.includes(f.id);
            const describedBy = [f.hint && `co-${f.id}-hint`, invalid && `co-${f.id}-error`].filter(Boolean).join(' ');
            return (
              <div className="field" key={f.id}>
                <label htmlFor={`co-${f.id}`}>{f.label}</label>
                {f.hint && <p id={`co-${f.id}-hint`} className="hint">{f.hint}</p>}
                {invalid && (
                  <p id={`co-${f.id}-error`} className="field-error">
                    <strong>Fel:</strong> {errorText(f)}
                  </p>
                )}
                <input
                  id={`co-${f.id}`}
                  type={f.type ?? 'text'}
                  autoComplete={f.autoComplete}
                  inputMode={f.inputMode}
                  value={details[f.id]}
                  aria-invalid={invalid ? 'true' : undefined}
                  aria-describedby={describedBy || undefined}
                  onChange={(e) => onDetailsChange({ ...details, [f.id]: e.target.value })}
                />
              </div>
            );
          })}

          <button type="submit" className="primary">
            Gå vidare till betalning
          </button>
        </form>
      )}

      {step === 1 && (
        <div className="checkout-form">
          <p>
            Du betalar med faktura. Fakturan skickas till {details.email}, och du betalar den inom
            30 dagar. Du behöver inte logga in eller använda någon app.
          </p>
          <p>
            Att betala: <strong>{total} kr</strong> till Brew &amp; Bean Rosteri AB.
          </p>
          <div className="button-row">
            <button type="button" className="secondary" onClick={() => setStep(0)}>
              Tillbaka till steg 1
            </button>
            <button type="button" className="primary" onClick={() => setStep(2)}>
              Gå vidare och granska beställningen
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="checkout-form">
          <p>Beställningen är inte skickad än. Kontrollera uppgifterna och tryck sedan på ”Skicka beställningen”.</p>
          <dl className="review">
            <dt>Varor</dt>
            <dd>
              {lines.map(({ product, quantity }) => `${quantity} st ${product.name}`).join(', ')}
            </dd>
            <dt>Malning</dt>
            <dd>{grind}</dd>
            <dt>Adress</dt>
            <dd>
              {details.name}, {details.address}, {details.zip} {details.city}
            </dd>
            <dt>Betalning</dt>
            <dd>Faktura på {total} kr till {details.email}</dd>
          </dl>
          <p>
            När du skickar beställningen godkänner du våra <a href="#main">köpvillkor</a>.
          </p>
          <div className="button-row">
            <button type="button" className="secondary" onClick={() => setStep(0)}>
              Ändra uppgifter
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => {
                setOrder({ number: `BB-${Math.floor(100000 + Math.random() * 900000)}`, email: details.email });
                onComplete();
              }}
            >
              Skicka beställningen
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
