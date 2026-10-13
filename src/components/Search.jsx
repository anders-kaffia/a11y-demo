import { useEffect, useRef, useState } from 'react';
import { searchResults } from '../searchResults.js';

const SearchIcon = () => (
  <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M10 2a8 8 0 0 1 6.3 12.9l5.4 5.4-1.4 1.4-5.4-5.4A8 8 0 1 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"
    />
  </svg>
);

const PAGE_SIZE = 24;
// Matches the hit count in the summary; also caps the DOM at ~1 300 results
const TOTAL_HITS = 1312;

/**
 * Product search with advanced filters. Every field has a label and the
 * form is a search landmark.
 */
export default function Search() {
  // /sok?q=... comes from the quick search in the header
  const initialQuery = new URLSearchParams(window.location.search).get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(initialQuery.trim() || null);
  const [count, setCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(query.trim() || 'kaffe');
    setCount(PAGE_SIZE);
  };

  // Infinite scroll: load the next page as soon as the end of the list comes into view
  // A11Y-ISSUE #21: New results load before you reach the footer – it cannot be reached by keyboard.
  // Nothing is announced to screen readers when new results have loaded.
  useEffect(() => {
    if (!submitted || loading || count >= TOTAL_HITS) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLoading(true);
        setTimeout(() => {
          setCount((c) => Math.min(c + PAGE_SIZE, TOTAL_HITS));
          setLoading(false);
        }, 500);
      },
      { rootMargin: '800px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [submitted, loading, count]);

  const visibleResults = Array.from(
    { length: count },
    (_, i) => searchResults[i % searchResults.length]
  );

  return (
    <section className="search" aria-labelledby="search-title">
      <h1 id="search-title">Sök</h1>

      <form role="search" aria-label="Sök i sortimentet" onSubmit={handleSubmit}>
        <div className="search-bar">
          <input
            type="search"
            aria-label="Sök"
            placeholder="Sök kaffe, tillbehör och artiklar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Sök">
            <SearchIcon />
          </button>
        </div>

        {/* Four columns side by side, matches the desktop design */}
        {/* A11Y-ISSUE #17: Four fixed columns – horizontal scrolling when zoomed, column-wise tab order. */}
        {/* A11Y-ISSUE #20: The search button is far away from the search field. */}
        <fieldset className="search-filters">
          <legend>Avancerad sökning</legend>

          <div className="filter-col">
            <label htmlFor="f-category">Kategori</label>
            <select id="f-category">
              <option>Alla</option>
              <option>Kaffe</option>
              <option>Utrustning</option>
              <option>Presentkort</option>
              <option>Artiklar</option>
            </select>

            <label htmlFor="f-origin">Ursprung</label>
            <select id="f-origin">
              <option>Alla</option>
              <option>Afrika</option>
              <option>Sydamerika</option>
              <option>Asien</option>
            </select>
          </div>

          <div className="filter-col">
            <label htmlFor="f-roast">Rostningsgrad</label>
            <select id="f-roast">
              <option>Alla</option>
              <option>Ljus</option>
              <option>Mellan</option>
              <option>Mörk</option>
            </select>

            <label htmlFor="f-method">Bryggmetod</label>
            <select id="f-method">
              <option>Alla</option>
              <option>Bryggare</option>
              <option>Espresso</option>
              <option>Presskanna</option>
              <option>Pour over (t.ex. V60)</option>
            </select>
          </div>

          <div className="filter-col">
            <label htmlFor="f-price-min">Pris från (kr inkl. moms)</label>
            <input id="f-price-min" type="number" inputMode="numeric" />

            <label htmlFor="f-price-max">Pris t.o.m. (kr inkl. moms)</label>
            <input id="f-price-max" type="number" inputMode="numeric" />
          </div>

          <div className="filter-col">
            <label htmlFor="f-sort">Sortera efter</label>
            <select id="f-sort">
              <option>Relevans</option>
              <option>Senast publicerat</option>
              <option>Pris (stigande)</option>
              <option>Pris (fallande)</option>
            </select>

            <div className="filter-check">
              <input id="f-stock" type="checkbox" />
              <label htmlFor="f-stock">Endast i lager</label>
            </div>
            <div className="filter-check">
              <input id="f-eco" type="checkbox" />
              <label htmlFor="f-eco">Endast ekologiskt</label>
            </div>

            <button type="submit" className="primary">
              Visa resultat
            </button>
          </div>
        </fieldset>
      </form>

      {submitted && (
        // A11Y-ISSUE #16: No heading, no list (<ul>/<ol>), the number of results is not announced and
        // focus is not moved. The results are also irrelevant and have meaningless titles.
        <div className="results">
          <div className="results-summary">
            Visar 1–{count} av 1 312 träffar för ”{submitted}”
          </div>

          {visibleResults.map((result, index) => (
            <div className="result" key={index}>
              <a href="#main" className="result-title">
                {result.title}
              </a>
              <div className="result-meta">{result.meta}</div>
              <div className="result-snippet">{result.snippet}</div>
            </div>
          ))}

          <div ref={sentinelRef} className="results-more">
            {loading && 'Laddar fler resultat …'}
          </div>
        </div>
      )}
    </section>
  );
}
