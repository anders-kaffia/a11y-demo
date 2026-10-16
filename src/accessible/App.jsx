import { useEffect, useState } from 'react';
import VersionSwitch from '../shared/VersionSwitch.jsx';
import Header from './components/Header.jsx';
import InfoBanner from './components/InfoBanner.jsx';
import ProductCard from './components/ProductCard.jsx';
import PurchaseInfo from './components/PurchaseInfo.jsx';
import Newsletter from './components/Newsletter.jsx';
import Search from './components/Search.jsx';
import Checkout from './components/Checkout.jsx';
import Footer from './components/Footer.jsx';
import { products } from '../products.js';

const isSearchPage = /\/sok\/?$/.test(window.location.pathname);
const isCartPage = /\/varukorg\/?$/.test(window.location.pathname);

const emptyDetails = { name: '', address: '', zip: '', city: '', email: '' };

// The cart is its own page, so the cart and the address are saved between page loads. The cart is kept
// in localStorage so it is the same in every tab; the address only in sessionStorage.
const load = (storage, key, fallback) => {
  try {
    return JSON.parse(storage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const save = (storage, key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {}
};

export default function App() {
  const [cart, setCart] = useState(() =>
    load(localStorage, 'cart', []).map((id) => products.find((p) => p.id === id)).filter(Boolean)
  );
  // Kept here so nothing is lost when the user leaves the checkout and comes back
  const [details, setDetails] = useState(() => load(sessionStorage, 'checkout-details', emptyDetails));

  useEffect(() => save(localStorage, 'cart', cart.map((p) => p.id)), [cart]);
  useEffect(() => save(sessionStorage, 'checkout-details', details), [details]);

  useEffect(() => {
    if (isCartPage) document.title = 'Varukorg – Brew & Bean (tillgänglig version)';
  }, []);

  const addToCart = (product) => setCart([...cart, product]);

  const removeFromCart = (productId) => {
    const index = cart.findIndex((p) => p.id === productId);
    setCart(cart.filter((_, i) => i !== index));
  };

  const removeAllOf = (productId) => setCart(cart.filter((p) => p.id !== productId));

  const completeCheckout = () => {
    setCart([]);
    setDetails(emptyDetails);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Hoppa till huvudinnehållet
      </a>
      <VersionSwitch />
      <InfoBanner />
      <Header cartCount={cart.length} showSearch={!isSearchPage} isCartPage={isCartPage} />

      <main id="main" tabIndex={-1}>
        {isCartPage ? (
          <Checkout
            cart={cart}
            details={details}
            onDetailsChange={setDetails}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onRemoveAll={removeAllOf}
            onComplete={completeCheckout}
          />
        ) : isSearchPage ? (
          <Search />
        ) : (
          <>
            <section className="hero" aria-labelledby="hero-title">
              <h1 id="hero-title">Nyrostat kaffe, levererat hem till dig</h1>
              <p>
                Vi rostar kaffet varje måndag och skickar det samma dag. Det tar oftast 1–3
                arbetsdagar innan du får det.
              </p>
              <p>
                <a className="standalone-link" href="#info-title">Läs om leverans och frakt</a>
              </p>
            </section>

            <section className="products" aria-labelledby="products-title">
              <h2 id="products-title">Vårt kaffe</h2>
              <ul className="grid">
                {products.map((product) => (
                  <li key={product.id}>
                    <ProductCard
                      product={product}
                      inCart={cart.filter((p) => p.id === product.id).length}
                      onAdd={addToCart}
                    />
                  </li>
                ))}
              </ul>
            </section>

            <PurchaseInfo />
            <Newsletter />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
