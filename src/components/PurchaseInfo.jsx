import InfoIllustration from './InfoIllustration.jsx';

const deliveryOptions = [
  ['Ombud', '1–3 arbetsdagar', '49 kr', 'Ja'],
  ['Hemleverans', '2–4 arbetsdagar', '79 kr', 'Ja'],
  ['Brevlåda', '2–5 arbetsdagar', '39 kr', 'Nej'],
  ['Hämta i caféet', 'Samma dag', 'Gratis', '–'],
];

export default function PurchaseInfo() {
  // A11Y-ISSUE #20: This section sits far to the right – easy to miss with screen magnification.
  // A11Y-ISSUE #18: Long sentences (55–75 words) and abbreviations, the key point buried in the middle.
  return (
    <div className="info-layout">
      <InfoIllustration />

      <section className="info" aria-labelledby="info-title">
        <h2 id="info-title">Bra att veta inför ditt köp</h2>

        <p>
          I enlighet med gällande lagstiftning, bl.a. distansavtalslagen och konsumentköplagen, har
          du som konsument ångerrätt i 14 dagar från den dag du mottagit varan, dock gäller detta
          inte livsmedel och liknande varor som på grund av sin beskaffenhet snabbt kan försämras,
          vilket innebär att öppnade förpackningar av kaffe, inkl. provpaket och kampanjförpackningar,
          normalt inte omfattas av ångerrätten, såvida inte annat särskilt avtalats mellan parterna
          eller framgår av de kampanjvillkor som gällde vid tidpunkten för köpet.{' '}
          {/* A11Y-ISSUE #23: "Läs mer" (read more) opens a PDF in a new window without warning. */}
          <a href="/villkor.pdf" target="_blank" rel="noreferrer">
            Läs mer
          </a>
        </p>

        <p>
          Samtliga priser anges inkl. moms men exkl. frakt, som beräknas i kassan utifrån bl.a.
          vikt, leveranssätt och eventuella tillval såsom spårbar leverans, och vid köp över 400 kr
          bjuder vi på frakten till valfritt utlämningsställe inom Sverige, förutsatt att
          beställningen inte innehåller skrymmande varor, t.ex. espressomaskiner eller kvarnar,
          vilka alltid debiteras enligt gällande prislista.
        </p>

        {/* Laid out as a grid so it lines up nicely on all screen sizes */}
        {/* A11Y-ISSUE #24: Looks like a table but is made of <div> elements – no header cells. */}
        <div className="fake-table">
          <div className="fake-table-head">Leveranssätt</div>
          <div className="fake-table-head">Leveranstid</div>
          <div className="fake-table-head">Pris</div>
          <div className="fake-table-head">Spårbar</div>
          {deliveryOptions.flat().map((cell, index) => (
            <div key={index}>{cell}</div>
          ))}
        </div>

        <p>
          Vid frågor om din order, t.ex. ändring av leveransadress, reklamation eller återbetalning,
          ber vi dig kontakta vår kundtjänst via formuläret under Kontakt och ange ordernr. (obs!
          inte kundnr.), så återkommer vi så snart som möjligt, dock senast inom två arbetsdagar
          under ordinarie öppettider, och vi behandlar dina personuppgifter i enlighet med GDPR, se{' '}
          {/* A11Y-ISSUE #23: A long URL as link text – read out character by character. */}
          <a href="#">
            https://www.brewandbean.se/kundservice/villkor/integritet/2024/version-3/index.html?ref=startsida
          </a>
          .
        </p>

        <p>
          {/* A11Y-ISSUE #23: PDF link without file size, and "Klicka här" (click here). */}
          <a href="/villkor.pdf">Köpvillkor [pdf]</a> · <a href="#">Klicka här</a> för
          returformulär.
        </p>
      </section>
    </div>
  );
}
