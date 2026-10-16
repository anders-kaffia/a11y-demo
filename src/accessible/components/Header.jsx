import { useEffect, useRef, useState } from 'react';
import ThemeToggle from './ThemeToggle.jsx';

const CartIcon = () => (
  <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5.2 4l.6 3H21l-2 8H7.4L4.4 2H1v2h4.2Z"
    />
  </svg>
);

export default function Header({ cartCount, showSearch, onCartClick }) {
  const [shopOpen, setShopOpen] = useState(false);
  const shopRef = useRef(null);

  // The submenu opens and closes on click, closes with Esc and when focus or a click leaves it
  useEffect(() => {
    if (!shopOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShopOpen(false);
        shopRef.current.querySelector('button').focus();
      }
    };
    const onOutside = (e) => {
      if (!shopRef.current.contains(e.target)) setShopOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onOutside);
    document.addEventListener('focusin', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onOutside);
      document.removeEventListener('focusin', onOutside);
    };
  }, [shopOpen]);

  return (
    <header className="site-header">
      <div className="header-top">
        <a href={`${import.meta.env.BASE_URL}tillganglig/`} className="logo">
          Brew &amp; Bean <span className="visually-hidden">– startsida</span>
        </a>

        <nav aria-label="Huvudmeny">
          <ul className="menu">
            <li className="has-submenu" ref={shopRef}>
              <button
                type="button"
                aria-expanded={shopOpen}
                aria-controls="shop-submenu"
                onClick={() => setShopOpen((open) => !open)}
              >
                Butik
              </button>
              <ul id="shop-submenu" className="submenu" hidden={!shopOpen}>
                <li><a href="#products-title">Sortrent</a></li>
                <li><a href="#products-title">Blandningar</a></li>
                <li><a href="#products-title">Utrustning</a></li>
                <li><a href="#products-title">Presentkort</a></li>
              </ul>
            </li>
            <li><a href="#main">Prenumerationer</a></li>
            <li><a href="#main">Om oss</a></li>
            <li><a href="#footer-title">Kontakt</a></li>
          </ul>
        </nav>
        <ThemeToggle />
      </div>

      <div className="header-actions">
        {showSearch && (
          <form role="search" action={`${import.meta.env.BASE_URL}tillganglig/sok/`} className="header-search">
            <label htmlFor="quick-search">Sök</label>
            <input id="quick-search" type="search" name="q" />
            <button type="submit">Sök</button>
          </form>
        )}

        <button type="button" className="cart" onClick={onCartClick}>
          <CartIcon />
          Varukorg ({cartCount} {cartCount === 1 ? 'vara' : 'varor'})
        </button>
      </div>
    </header>
  );
}
