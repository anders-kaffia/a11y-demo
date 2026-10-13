import { useEffect, useState } from 'react';
import BotProtection from './components/BotProtection.jsx';
import Header from './components/Header.jsx';
import InfoBanner from './components/InfoBanner.jsx';
import ProductCard from './components/ProductCard.jsx';
import NewsletterDialog from './components/NewsletterDialog.jsx';
import Toast from './components/Toast.jsx';
import Footer from './components/Footer.jsx';
import Search from './components/Search.jsx';
import PurchaseInfo from './components/PurchaseInfo.jsx';
import { products } from './products.js';

export default function App() {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [searching, setSearching] = useState(false);

  // Show the newsletter offer once the visitor has had a moment to look around
  useEffect(() => {
    const timer = setTimeout(() => setShowNewsletter(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (product) => {
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
      <Header cartCount={cart.length} />

      <main id="main">
        <BotProtection />

        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">Nyrostat kaffe, levererat hem till dig</h1>
          <p>
            Vi rostar i små satser varje måndag och skickar samma dag, dvs. normalt 1–3 arbetsdagars
            leveranstid inom Sverige.
          </p>
        </section>

        <Search onSearch={() => setSearching(true)} />

        {/* The search results replace the start page content */}
        {!searching && (
          <>
            <section className="products" aria-labelledby="products-title">
              <h2 id="products-title">Vårt kaffe</h2>
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
