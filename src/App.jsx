import { useEffect, useState } from 'react';
import BotProtection from './components/BotProtection.jsx';
import Header from './components/Header.jsx';
import ProductCard from './components/ProductCard.jsx';
import NewsletterDialog from './components/NewsletterDialog.jsx';
import Toast from './components/Toast.jsx';
import Footer from './components/Footer.jsx';
import { products } from './products.js';

export default function App() {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [showNewsletter, setShowNewsletter] = useState(false);

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
      notify(`Sorry, ${product.name} is sold out`);
      return;
    }
    setCart((items) => [...items, product]);
    notify(`${product.name} added to cart`);
  };

  return (
    <>
      <Header cartCount={cart.length} />

      <main id="main">
        <BotProtection />

        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">Freshly roasted coffee, delivered</h1>
          <p>Small batches, roasted every Monday and shipped the same day.</p>
        </section>

        <section className="products" aria-labelledby="products-title">
          <h2 id="products-title">Our coffees</h2>
          <div className="grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {showNewsletter && (
        <NewsletterDialog
          onClose={() => setShowNewsletter(false)}
          onSubscribe={() => {
            setShowNewsletter(false);
            notify('Thanks for subscribing!');
          }}
        />
      )}

      <Toast message={toast} />
    </>
  );
}
