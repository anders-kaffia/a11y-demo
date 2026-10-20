import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// Always the live site, wherever this page is opened, so the audience can open it on their phones
const url = 'https://anders-kaffia.github.io/a11y-demo/';

/** A page to show on the projector before the demo, so the audience can open the shop on their phones */
export default function QrPage() {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    // Dark modules on white whatever the theme, since many scanners cannot read an inverted code
    QRCode.toString(url, { type: 'svg', margin: 2, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } })
      .then(setSvg);
  }, []);

  return (
    <main className="qr-page">
      <h1>Öppna demon i mobilen</h1>
      <div className="qr-code" role="img" aria-label={`QR-kod till ${url}`} dangerouslySetInnerHTML={{ __html: svg }} />
      <p className="qr-url">
        <a href={url}>{url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>
      </p>
    </main>
  );
}
