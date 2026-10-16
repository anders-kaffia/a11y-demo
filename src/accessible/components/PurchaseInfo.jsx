const deliveryOptions = [
  ['Till ombud', '1–3 arbetsdagar', '49 kr', 'Ja'],
  ['Hem till dörren', '2–4 arbetsdagar', '79 kr', 'Ja'],
  ['I brevlådan', '2–5 arbetsdagar', '39 kr', 'Nej'],
  ['Hämta i caféet', 'Samma dag', 'Gratis', 'Behövs inte'],
];

/**
 * Short sections with headings, the most important thing first in each.
 */
export default function PurchaseInfo() {
  return (
    <section className="info" aria-labelledby="info-title">
      <h2 id="info-title">Bra att veta innan du köper</h2>

      <div className="summary-box">
        <h3>Kort sagt</h3>
        <ul>
          <li>Du kan ångra köpet i 14 dagar, men inte om du har öppnat paketet.</li>
          <li>Frakten är gratis om du handlar för mer än 400 kr.</li>
          <li>Vi rostar kaffet varje måndag.</li>
        </ul>
      </div>

      <h3>Ångra ett köp</h3>
      <p>Du har rätt att ångra ditt köp i 14 dagar från att du fick varan.</p>
      <p>
        Ångerrätten gäller inte kaffe som du har öppnat. Det beror på att kaffe är ett livsmedel
        som kan bli sämre när paketet är öppnat.
      </p>
      <p>
        <a className="standalone-link" href="#main">Ångerrätt och returer</a>
      </p>

      <h3>Pris och frakt</h3>
      <p>Alla priser är med moms. Frakten kommer till när du betalar.</p>
      <p>
        Frakten är gratis om du handlar för mer än 400 kr. Det gäller inte stora varor, till exempel
        espressomaskiner och kvarnar.
      </p>

      {/* Tables may scroll sideways on narrow screens (allowed by 1.4.10); the region makes that keyboard-accessible */}
      <div className="table-wrap" role="region" aria-label="Tabell: leveranssätt" tabIndex={0}>
        <table className="table">
          <caption>Leveranssätt, tid och pris</caption>
          <thead>
            <tr>
              <th scope="col">Leveranssätt</th>
              <th scope="col">Leveranstid</th>
              <th scope="col">Pris</th>
              <th scope="col">Kan spåras</th>
            </tr>
          </thead>
          <tbody>
            {deliveryOptions.map(([method, ...cells]) => (
              <tr key={method}>
                <th scope="row">{method}</th>
                {cells.map((cell, i) => (
                  <td key={i}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Frågor om din beställning</h3>
      <p>
        Du kan skriva till oss via <a href="#footer-title">kundtjänst</a>. Skriv ditt ordernummer.
        Det står i bekräftelsen som du fick via e-post. Vi svarar inom två arbetsdagar.
      </p>
      <p>
        <a className="standalone-link" href="#main">Så hanterar vi dina personuppgifter</a>
      </p>
    </section>
  );
}
