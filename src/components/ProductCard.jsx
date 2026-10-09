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

export default function ProductCard({ product, onAdd }) {
  const [wished, setWished] = useState(false);
  const onSale = product.salePrice !== undefined;

  return (
    <article className={`card${product.soldOut ? ' card--sold-out' : ''}`}>
      {/* Content order is handled with CSS grid areas for the layout */}
      <button type="button" className="card-add" onClick={() => onAdd(product)}>
        Add to cart
      </button>

      <div className="card-price">
        {onSale ? (
          <>
            <s>${product.price}</s> <span className="sale">${product.salePrice}</span>
          </>
        ) : (
          <>${product.price}</>
        )}
      </div>

      <div className="card-title">{product.name}</div>
      <p className="card-desc">{product.description}</p>

      <img className="card-img" src={product.image} alt={product.photoFile} width="320" height="220" />

      {product.soldOut && (
        // Purely visual label, the image already conveys the product
        <span className="badge" aria-hidden="true">Sold out</span>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-label="Add to wishlist"
        aria-pressed={wished}
        className="card-wish"
        onClick={() => setWished((w) => !w)}
      >
        <HeartIcon filled={wished} />
      </div>
    </article>
  );
}
