import { useState } from 'react';

const CartIcon = () => (
  <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5.2 4l.6 3H21l-2 8H7.4L4.4 2H1v2h4.2Z"
    />
  </svg>
);

export default function Header({ cartCount }) {
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <header className="site-header">
      <a href="/" className="logo">
        Brew &amp; Bean
      </a>

      <nav aria-label="Main">
        <ul className="menu">
          <li
            className="has-submenu"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            {/* Disclosure pattern: button + aria-expanded + aria-controls */}
            <button
              type="button"
              aria-expanded={shopOpen}
              aria-controls="shop-submenu"
              onClick={() => setShopOpen((open) => !open)}
            >
              Shop
            </button>
            <ul id="shop-submenu" className="submenu">
              <li><a href="#main">Single origin</a></li>
              <li><a href="#main">Blends</a></li>
              <li><a href="#main">Equipment</a></li>
              <li><a href="#main">Gift cards</a></li>
            </ul>
          </li>
          <li><a href="#main">Subscriptions</a></li>
          <li><a href="#main">About us</a></li>
          <li><a href="#main">Contact</a></li>
        </ul>
      </nav>

      <button type="button" className="cart">
        <CartIcon />
        <span>Cart</span>
        {/* Hidden from screen readers: "left paren two right paren" sounds awful */}
        <span aria-hidden="true">({cartCount})</span>
      </button>
    </header>
  );
}
