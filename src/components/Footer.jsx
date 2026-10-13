export default function Footer() {
  return (
    <footer className="site-footer">
      {/* A11Y-ISSUE Bonus: "klicka här" (click here) has no context in a screen reader's links list. */}
      {/* A11Y-ISSUE #21: On the search page the footer cannot be reached because of infinite scroll. */}
      <p>
        Fri frakt vid köp över 400 kr. För leveranstider, <a href="#main">klicka här</a>.
      </p>
      <p>
        Frågor om returer? <a href="#main">Klicka här</a>.
      </p>
      <p>
        <a href="#main">Kundtjänst</a> · <a href="#main">Köpvillkor</a> ·{' '}
        <a href="#main">Integritetspolicy</a> · <a href="#main">Tillgänglighetsredogörelse</a>
      </p>
      <p>© 2026 Brew &amp; Bean Rosteri AB</p>
    </footer>
  );
}
