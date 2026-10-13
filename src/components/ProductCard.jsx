import { useState } from 'react';

const HeartIcon = ({ filled }) => (
  <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24">
    <path
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.2 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.8 0 6 3.8 4.5 7.3C19.5 16.4 12 21 12 21Z"
    />
  </svg>
);

// A11Y-ISSUE #29: This information is only shown in tooltips on mouse hover.
const stockInfo = {
  in:
    'I lager. Beställ före kl. 14 på vardagar så skickas paketet samma dag. Beställningar ' +
    'som läggs under helger skickas nästa vardag. Leveranstiden till ombud är normalt ' +
    '1–3 arbetsdagar, men kan vara längre under högsäsong.',
  low:
    'Få kvar, endast 3 st i lager. Varan reserveras inte förrän beställningen är betald, så ' +
    'om flera kunder handlar samtidigt kan den ta slut innan du hunnit till kassan. Nästa ' +
    'rostning av den här sorten planeras till vecka 47.',
  out:
    'Slut i lager. Nästa skörd väntas åter vecka 3. Du kan bevaka produkten under Mina sidor, ' +
    'så skickar vi ett mejl när den finns i lager igen. Bevakningen gäller i 90 dagar och ' +
    'kan avslutas när som helst.',
};

export default function ProductCard({ product, onAdd }) {
  const [wished, setWished] = useState(false);
  const onSale = product.salePrice !== undefined;

  return (
    <article className={`card${product.soldOut ? ' card--sold-out' : ''}`}>
      {/* Content order is handled with CSS grid areas for the layout */}
      {/* A11Y-ISSUE #7: The button and price come before the name in the DOM – wrong reading and focus order. */}
      {/* A11Y-ISSUE #8: Six identical "Lägg i varukorgen" (add to cart) buttons without the product name. */}
      <button type="button" className="card-add" onClick={() => onAdd(product)}>
        Lägg i varukorgen
      </button>

      <div className="card-price">
        {onSale ? (
          <>
            {/* A11Y-ISSUE #11: <s> is not announced as strikethrough – it reads "189 kr 139 kr". */}
            <s>{product.price} kr</s> <span className="sale">{product.salePrice} kr</span>
          </>
        ) : (
          <>{product.price} kr</>
        )}
        {/* Extra details on hover keep the card clean */}
        {/* A11Y-ISSUE #29: Tooltips on :hover only – not focusable, hidden from screen readers. */}
        <span className="has-tooltip card-info">
          <span className="info-icon" aria-hidden="true">i</span>
          <span className="tooltip">
            Jämförpris {(product.salePrice ?? product.price) * 4} kr/kg. Förpackningen innehåller 250 g
            hela bönor och har en envägsventil som håller kaffet färskt. Bäst före ca 12 månader
            från rostningsdatum, som står på påsens baksida. Priset gäller endast i webbutiken och
            kan skilja sig från priset i vårt café. Prenumeranter får 10 % rabatt på ordinarie
            pris.
          </span>
        </span>
        {/* A11Y-ISSUE #28: Stock status is only a coloured dot, which disappears in high contrast mode (#30). */}
        <span className="has-tooltip">
          <span className={`stock-dot stock-dot--${product.stock}`} />
          <span className="tooltip">{stockInfo[product.stock]}</span>
        </span>
      </div>

      {/* A11Y-ISSUE #9: The product name looks like a heading but is a <div>. */}
      <div className="card-title">{product.name}</div>
      <p className="card-desc">{product.description}</p>
      {/* A11Y-ISSUE #23: Yet another "Läs mer" (read more) link without context, pointing to href="#". */}
      <a href="#" className="card-more">
        Läs mer
      </a>

      {/* A11Y-ISSUE #10, #23: Image link whose name becomes the file name, e.g. "DSC_0042.jpg". */}
      <a href="#" className="card-img-link">
        <img className="card-img" src={product.image} alt={product.photoFile} width="320" height="220" />
      </a>

      {product.soldOut && (
        // Purely visual label, the image already conveys the product
        // A11Y-ISSUE #12: "Slutsåld" (sold out) is hidden from screen readers with aria-hidden.
        <span className="badge" aria-hidden="true">Slutsåld</span>
      )}

      {/* A11Y-ISSUE #13: <div role="button"> without keyboard handling – Enter/Space do nothing. */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Lägg till i önskelistan"
        aria-pressed={wished}
        className="card-wish"
        onClick={() => setWished((w) => !w)}
      >
        <HeartIcon filled={wished} />
      </div>
    </article>
  );
}
