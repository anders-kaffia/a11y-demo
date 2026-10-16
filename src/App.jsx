import { useCallback, useEffect, useState } from 'react';
import BotProtection from './components/BotProtection.jsx';
import Header from './components/Header.jsx';
import InfoBanner from './components/InfoBanner.jsx';
import ProductCard from './components/ProductCard.jsx';
import NewsletterDialog from './components/NewsletterDialog.jsx';
import Toast from './components/Toast.jsx';
import Footer from './components/Footer.jsx';
import Search from './components/Search.jsx';
import PurchaseInfo from './components/PurchaseInfo.jsx';
import Checkout from './components/Checkout.jsx';
import { products } from './products.js';

const isSearchPage = /\/sok\/?$/.test(window.location.pathname);

export default function App() {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Show the newsletter offer once the visitor has scrolled a bit and shown interest
  // A11Y-ISSUE #3: The dialog opens unprompted while scrolling/tabbing, and focus is not moved to it.
  useEffect(() => {
    if (isSearchPage) return;
    const onScroll = () => {
      if (window.scrollY > 300) {
        setShowNewsletter(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const notify = useCallback((message) => {
    setToast(message);
    // A11Y-ISSUE #5: 2.5 seconds is too short to read the message.
    setTimeout(() => setToast(null), 2500);
  }, []);

  const openCheckout = () => {
    setShowCheckout(true);
    window.scrollTo(0, 0);
  };

  const closeCheckout = () => {
    setShowCheckout(false);
    window.scrollTo(0, 0);
  };

  // A11Y-ISSUE #31: When the reservation runs out, the cart and the form are emptied silently.
  const expireCheckout = useCallback(() => {
    setCart([]);
    setShowCheckout(false);
    notify('Sessionen har gått ut');
  }, [notify]);

  // A11Y-ISSUE #32: No receipt page and no order number – just a toast that disappears.
  const completeCheckout = () => {
    setCart([]);
    setShowCheckout(false);
    window.scrollTo(0, 0);
    notify('Tack för ditt köp!');
  };

  const addToCart = (product) => {
    // A11Y-ISSUE #12: Sold-out items can still be "added to cart" – the error only shows in the toast.
    if (product.soldOut) {
      notify(`Tyvärr, ${product.name} är slutsåld`);
      return;
    }
    setCart((items) => [...items, product]);
    notify(`${product.name} har lagts i varukorgen`);
  };

  return (
    <>
      <InfoBanner />
      <Header cartCount={cart.length} showSearch={!isSearchPage} onCartClick={openCheckout} />

      <main id="main">
        {showCheckout ? (
          cart.length > 0 ? (
            <Checkout
              cart={cart}
              onBack={closeCheckout}
              onExpire={expireCheckout}
              onComplete={completeCheckout}
            />
          ) : (
            <section className="checkout" aria-labelledby="checkout-title">
              <h1 id="checkout-title">Kundvagn</h1>
              <p>Kundvagnen är tom.</p>
              <button type="button" className="primary" onClick={closeCheckout}>
                Fortsätt handla
              </button>
            </section>
          )
        ) : isSearchPage ? (
          <Search />
        ) : (
          <>
            {/* A11Y-ISSUE #1: Steals focus to an invisible checkbox on page load. */}
            <BotProtection />

            {/* A11Y-ISSUE #25: White text on a light background image – axe can only report "needs review". */}
            {/* A11Y-ISSUE #18, #23: Abbreviation ("dvs.") and a "Läs mer" (read more) link without context. */}
            <section className="hero" aria-labelledby="hero-title">
              <h1 id="hero-title">Nyrostat kaffe, levererat hem till dig</h1>
              <p>
                Vi rostar i små satser varje måndag och skickar samma dag, dvs. normalt 1–3
                arbetsdagars leveranstid inom Sverige. <a href="#">Läs mer</a>
              </p>
            </section>

            <section className="products" aria-labelledby="products-title">
              <h2 id="products-title">Vårt kaffe</h2>
              {/* A11Y-ISSUE #28: Stock status is only explained with coloured dots, far away from the cards. */}
              <p className="stock-legend">
                <span className="stock-dot stock-dot--in" /> I lager
                <span className="stock-dot stock-dot--low" /> Få kvar
                <span className="stock-dot stock-dot--out" /> Slut
              </p>
              <div className="grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} />
                ))}
              </div>
            </section>

            <PurchaseInfo />
          </>
        )}
      </main>

      <Footer />

      {showNewsletter && (
        <NewsletterDialog
          onClose={() => setShowNewsletter(false)}
          onSubscribe={() => {
            setShowNewsletter(false);
            notify('Tack för att du prenumererar!');
          }}
        />
      )}

      <Toast message={toast} />
    </>
  );
}
