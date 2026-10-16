import { useState } from 'react';

/**
 * Short notice that scrolls with the page and can be closed.
 */
export default function InfoBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  // The button disappears with the banner, so move focus to the logo first – otherwise it ends up on <body>
  const close = () => {
    document.querySelector('.site-header .logo')?.focus();
    setOpen(false);
  };

  return (
    <aside className="info-banner" aria-labelledby="banner-title">
      <div>
        <h2 id="banner-title">Viktigt om jul och nyår</h2>
        <ul>
          <li>Leveranser kan ta upp till en vecka längre än vanligt.</li>
          <li>Beställ senast 18 december om du vill ha kaffet före jul.</li>
          <li>Caféet är stängt 24–26 december och 31 december–1 januari.</li>
          <li>20 % rabatt på prenumerationer med koden JUL26. Gäller till och med 31 december.</li>
        </ul>
      </div>
      <button type="button" onClick={close}>
        Stäng meddelandet
      </button>
    </aside>
  );
}
