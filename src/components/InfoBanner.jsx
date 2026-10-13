import { useState } from 'react';

/**
 * Site-wide notice. Sticky so that important information is always visible,
 * and placed in a labelled complementary landmark.
 */
export default function InfoBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  // A11Y-ISSUE #19: Sticky banner with lots of text – covers almost the whole screen on a phone in
  // landscape and hides focused elements on desktop. The landmark name says nothing about the content.
  // A11Y-ISSUE #23: The link is only called "Läs mer" (read more).
  return (
    <aside className="info-banner" aria-label="Banner information">
      <p>
        <strong>Viktig information om leveranser i november och december:</strong> På grund av
        hög belastning hos våra fraktpartner kan leveranser just nu ta upp till 5–7 arbetsdagar
        längre än vanligt, och beställningar som läggs efter den 18 december kan tyvärr inte
        garanteras komma fram före jul.
      </p>
      <p>
        Vårt café på Södermalm håller stängt 24–26 december samt 31 december–1 januari.
        Hämtning av webbeställningar i caféet är inte möjlig under dessa dagar.
      </p>
      <p>
        Just nu: 20 % rabatt på alla prenumerationer med koden JUL26 (gäller t.o.m. 31/12 och kan
        inte kombineras med andra erbjudanden). Vi har även uppdaterat våra köpvillkor och vår
        integritetspolicy. <a href="#main">Läs mer</a>
      </p>
      <button type="button" className="info-banner-close" onClick={() => setOpen(false)}>
        Stäng
      </button>
    </aside>
  );
}
