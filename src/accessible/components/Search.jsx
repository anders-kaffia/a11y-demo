import { useEffect, useRef, useState } from 'react';
import { products } from '../../products.js';

const base = `${import.meta.env.BASE_URL}tillganglig/`;

// A small, curated index: only current pages, each with a descriptive title
const index = [
  ...products.map((p) => ({
    title: p.name,
    type: 'Kaffe',
    text: p.description,
    inStock: !p.soldOut,
  })),
  { title: 'Kaffekvarn Hario Skerton Pro', type: 'Utrustning', text: 'Manuell kaffekvarn för hela bönor.', inStock: true },
  { title: 'Presentkort 500 kr', type: 'Presentkort', text: 'Ge bort kaffe. Gäller i 12 månader.', inStock: true },
  { title: 'Så brygger du kaffe i presskanna', type: 'Artikel', text: 'Steg för steg: mängd kaffe, malning och tid.', inStock: true },
  { title: 'Så länge håller kaffe', type: 'Artikel', text: 'Oöppnat kaffe håller i cirka 3–6 månader.', inStock: true },
  { title: 'Leverans och frakt', type: 'Artikel', text: 'Leveranssätt, tider och priser. Gratis frakt över 400 kr.', inStock: true },
];

const categories = ['Alla', 'Kaffe', 'Utrustning', 'Presentkort', 'Artikel'];

export default function Search() {
  const initialQuery = new URLSearchParams(window.location.search).get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('Alla');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [submitted, setSubmitted] = useState(initialQuery.trim() ? { q: initialQuery.trim(), category, onlyInStock } : null);
  const headingRef = useRef(null);

  // After every search, move focus to the result heading so screen readers say how many hits there were
  useEffect(() => {
    if (submitted) headingRef.current?.focus();
  }, [submitted]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted({ q: query.trim(), category, onlyInStock });
  };

  const words = submitted?.q.toLowerCase().split(/\s+/).filter(Boolean) ?? [];
  const results = submitted
    ? index.filter(
        (item) =>
          words.every((w) => `${item.title} ${item.text} ${item.type}`.toLowerCase().includes(w)) &&
          (submitted.category === 'Alla' || item.type === submitted.category) &&
          (!submitted.onlyInStock || item.inStock)
      )
    : [];

  return (
    <section className="search" aria-labelledby="search-title">
      <h1 id="search-title">Sök</h1>

      <form role="search" onSubmit={handleSubmit} className="search-form">
        <label htmlFor="search-query">Vad letar du efter?</label>
        <div className="search-bar">
          <input
            id="search-query"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="primary">
            Sök
          </button>
        </div>

        <fieldset className="search-filters">
          <legend>Begränsa sökningen</legend>
          <label htmlFor="f-category">Visa bara</label>
          <select id="f-category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div className="checkbox">
            <input
              id="f-stock"
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
            />
            <label htmlFor="f-stock">Visa bara varor som finns i lager</label>
          </div>
        </fieldset>
      </form>

      {submitted && (
        <div className="results">
          <h2 ref={headingRef} tabIndex={-1}>
            {results.length} {results.length === 1 ? 'träff' : 'träffar'}
            {submitted.q && <> för ”{submitted.q}”</>}
          </h2>
          {results.length === 0 ? (
            <p>Kontrollera stavningen, sök på ett kortare ord eller välj ”Alla” under ”Visa bara”.</p>
          ) : (
            <ul className="result-list">
              {results.map((item) => (
                <li key={item.title}>
                  <h3>
                    <a href={`${base}#main`}>{item.title}</a>
                  </h3>
                  <p className="result-type">{item.type}</p>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
