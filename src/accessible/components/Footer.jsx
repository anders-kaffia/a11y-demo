export default function Footer() {
  return (
    <footer className="site-footer" aria-labelledby="footer-title">
      <h2 id="footer-title">Kontakta oss</h2>
      <ul className="contact-list">
        <li>
          Skriv till kundtjänst: <a href="mailto:kundtjanst@example.com">kundtjanst@example.com</a>.
          Vi svarar inom två arbetsdagar.
        </li>
        <li>Chatta med oss vardagar kl. 9–16.</li>
        <li>Ring 08-123 456 78 vardagar kl. 9–11.</li>
      </ul>
      <ul className="footer-links">
        <li><a href="#info-title">Leverans och frakt</a></li>
        <li><a href="#main">Returer</a></li>
        <li><a href="#main">Köpvillkor</a></li>
        <li><a href="#main">Integritetspolicy</a></li>
        <li><a href="#main">Tillgänglighetsredogörelse</a></li>
      </ul>
      <p>© 2026 Brew &amp; Bean Rosteri AB</p>
    </footer>
  );
}
