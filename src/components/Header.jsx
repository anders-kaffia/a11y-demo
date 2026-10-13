import { useState } from 'react';

const SearchIcon = () => (
  <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M10 2a8 8 0 0 1 6.3 12.9l5.4 5.4-1.4 1.4-5.4-5.4A8 8 0 1 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"
    />
  </svg>
);

const CartIcon = () => (
  <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5.2 4l.6 3H21l-2 8H7.4L4.4 2H1v2h4.2Z"
    />
  </svg>
);

export default function Header({ cartCount, showSearch }) {
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <header className="site-header">
      <a href={import.meta.env.BASE_URL} className="logo">
        Brew &amp; Bean
      </a>

      <nav aria-label="Huvudmeny">
        <ul className="menu">
          <li
            className="has-submenu"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            {/* Disclosure pattern: button + aria-expanded + aria-controls */}
            {/* A11Y-ISSUE #2: aria-expanded toggles, but the submenu is only shown on CSS :hover. */}
            <button
              type="button"
              aria-expanded={shopOpen}
              aria-controls="shop-submenu"
              onClick={() => setShopOpen((open) => !open)}
            >
              Butik
            </button>
            <ul id="shop-submenu" className="submenu">
              <li><a href="#main">Sortrent</a></li>
              <li><a href="#main">Blandningar</a></li>
              <li><a href="#main">Utrustning</a></li>
              <li><a href="#main">Presentkort</a></li>
            </ul>
          </li>
          <li><a href="#main">Prenumerationer</a></li>
          <li><a href="#main">Om oss</a></li>
          <li><a href="#main">Kontakt</a></li>
        </ul>
      </nav>

      {showSearch && (
        <form
          role="search"
          aria-label="Snabbsök"
          action={`${import.meta.env.BASE_URL}sok/`}
          className="header-search"
        >
          <input type="search" name="q" aria-label="Sök" placeholder="Sök" />
          <button type="submit" aria-label="Sök">
            <SearchIcon />
          </button>
        </form>
      )}

      <button type="button" className="cart">
        <CartIcon />
        <span>Varukorg</span>
        {/* Hidden from screen readers: "left paren two right paren" sounds awful */}
        {/* A11Y-ISSUE #6: The item count is hidden from screen readers – the button is only called "Varukorg" (cart). */}
        <span aria-hidden="true">({cartCount})</span>
      </button>
    </header>
  );
}
