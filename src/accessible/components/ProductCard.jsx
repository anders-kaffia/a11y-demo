import { useEffect, useRef, useState } from 'react';

const stockText = {
  in: 'I lager. Beställ före kl. 14 på vardagar, så skickar vi samma dag.',
  low: 'Få kvar (3 st).',
  out: 'Slut i lager. Väntas åter vecka 3.',
};

// Describes what the photo shows, by product id
const altText = {
  1: 'Korg full med röda, mogna kaffebär som just har plockats.',
  2: 'Gröna, omogna kaffebär på en kvist i en kaffeodling.',
  3: 'Närbild på mörkrostade kaffebönor.',
  4: 'Säck av jute med texten Coffee, Produce of Kenya och en karta över Afrika.',
  5: 'Espresso med ljusbrun crema i ett litet glas på ett fat.',
  6: 'Kopp kaffe med crema på ett mörkblått fat, sedd ovanifrån.',
};

export const InfoIcon = () => (
  <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" className="notice-icon">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M7 12.5 10.5 16 17 8.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

const StockIcon = ({ stock }) => (
  // Shape and text carry the meaning, the colour is only extra
  <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" className={`stock-icon stock-icon--${stock}`}>
    {stock === 'in' && <path d="M2 8.5 6 12l8-8" fill="none" stroke="currentColor" strokeWidth="2.5" />}
    {/* An exclamation mark in a circle – clearly different from the triangle on "Mer om förpackningen" */}
    {stock === 'low' && (
      <>
        <circle cx="8" cy="8" r="6.75" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 4v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="8" cy="11.75" r="1.25" fill="currentColor" />
      </>
    )}
    {stock === 'out' && <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="2.5" />}
  </svg>
);

export default function ProductCard({ product, inCart, onAdd, onCartClick }) {
  const [saved, setSaved] = useState(false);
  const [wishStatus, setWishStatus] = useState('');
  // The cart count when the notice was closed; it comes back when the count changes
  const [dismissedAt, setDismissedAt] = useState(null);
  const addRef = useRef(null);
  const showNotice = inCart > 0 && inCart !== dismissedAt;

  useEffect(() => {
    if (inCart === 0) setDismissedAt(null);
  }, [inCart]);
  const price = product.salePrice ?? product.price;
  const headingId = `product-${product.id}`;

  return (
    <article className="card" aria-labelledby={headingId}>
      <img className="card-img" src={product.image} alt={altText[product.id]} width="320" height="220" />
      <h3 id={headingId}>{product.name}</h3>
      <p className="card-desc">{product.description}</p>

      <p className={`card-stock card-stock--${product.stock}`}>
        <StockIcon stock={product.stock} />
        {stockText[product.stock]}
      </p>

      <p className="card-price">
        {product.salePrice !== undefined ? (
          <>
            <span className="sale">Nu {price} kr</span>{' '}
            <span className="card-price-old">(ordinarie pris {product.price} kr)</span>
          </>
        ) : (
          <>{price} kr</>
        )}
      </p>

      <details className="card-details">
        <summary>Mer om förpackningen</summary>
        <ul>
          <li>250 g hela bönor.</li>
          <li>Jämförpris: {price * 4} kr/kg.</li>
          <li>Bäst före: cirka 12 månader efter rostning.</li>
        </ul>
      </details>

      <div className="card-actions">
        {product.soldOut ? (
          <p className="card-sold-out">Slutsåld</p>
        ) : (
          <button type="button" className="primary" ref={addRef} onClick={() => onAdd(product)}>
            Lägg i varukorgen<span className="visually-hidden">: {product.name}</span>
          </button>
        )}
        {/* The label says the current state; the hidden text says what pressing it does */}
        <button
          type="button"
          className={saved ? 'secondary is-saved' : 'secondary'}
          onClick={() => {
            setSaved(!saved);
            setWishStatus(saved ? `${product.name} är borttagen från önskelistan.` : `${product.name} är sparad i önskelistan.`);
          }}
        >
          {saved ? (
            <>
              Sparad<span className="visually-hidden"> – ta bort {product.name} från önskelistan</span>
            </>
          ) : (
            <>
              Spara<span className="visually-hidden"> {product.name} i önskelistan</span>
            </>
          )}
        </button>
      </div>
      <p role="status" className="visually-hidden">
        {wishStatus}
      </p>

      {/* The status text is always in the DOM, so screen readers announce it when it changes
          (also when the count goes from 1 to 2). The notice stays until it is closed. */}
      <div className={showNotice ? 'notice' : undefined}>
        {showNotice && <InfoIcon />}
        <div className="notice-body">
          <p role="status">{showNotice ? `${product.name} ligger i varukorgen (${inCart} st).` : ''}</p>
          {showNotice && (
            <button type="button" className="link-button" onClick={onCartClick}>
              Gå till varukorgen
            </button>
          )}
        </div>
        {showNotice && (
          <button
            type="button"
            className="notice-close"
            aria-label={`Stäng meddelandet om ${product.name}`}
            onClick={() => {
              setDismissedAt(inCart);
              addRef.current?.focus();
            }}
          >
            ×
          </button>
        )}
      </div>
    </article>
  );
}
