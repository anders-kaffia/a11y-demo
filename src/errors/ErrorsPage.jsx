import { useState } from 'react';
import VersionSwitch from '../shared/VersionSwitch.jsx';
import ThemeToggle from '../accessible/components/ThemeToggle.jsx';
import { issues } from './issues.js';

const base = import.meta.env.BASE_URL;

const methods = [
  {
    name: 'Tangentbord',
    tips: [
      'Lägg undan musen. Använd Tabb, Skift+Tabb, Enter, mellanslag, Esc och piltangenterna.',
      'Ser du hela tiden var fokus är? Kommer du åt allt, och kommer du ut igen?',
      'Går fokus i samma ordning som du läser?',
    ],
  },
  {
    name: 'Skärmläsare',
    tips: [
      'NVDA är gratis för Windows. På Mac och iPhone finns VoiceOver, på Android TalkBack.',
      <>
        NVDA: Tabb och Skift+Tabb flyttar mellan länkar, knappar och fält. H hoppar mellan rubriker, B
        mellan knappar, och Insert+F7 visar alla länkar, rubriker och landmärken. Fler kommandon finns
        hos <a href="https://webaim.org/resources/shortcuts/nvda">WebAIM: NVDA-kortkommandon (på engelska)</a>.
      </>,
      'Får du veta vad som hände när du tryckte på en knapp?',
    ],
  },
  {
    name: 'Zoom och förstoring',
    tips: [
      'Zooma till 200 % och 400 % (Ctrl och +). Måste du skrolla i sidled?',
      'Gör texten större i webbläsarens inställningar. Blir den större?',
      'Prova förstoringsglaset i Windows (Windows + plus). Hittar du det som hör ihop?',
    ],
  },
  {
    name: 'Titta',
    tips: [
      'Mät kontrasten med Colour Contrast Analyser eller en färgpipett. Text behöver minst 4,5:1.',
      'Simulera färgblindhet i Chrome: DevTools → Rendering → Emulate vision deficiencies.',
      'Färg får inte vara det enda sättet att visa något. Det ska också finnas text, en form eller ett mönster.',
    ],
  },
  {
    name: 'Högkontrast',
    tips: [
      'Slå på Kontrastteman i Windows: vänster Alt + vänster Skift + Print Screen.',
      'Eller i Chrome: DevTools → Rendering → Emulate CSS media feature forced-colors: active.',
      'Syns knappar, fokus och ikoner fortfarande?',
    ],
  },
  {
    name: 'Mobil',
    tips: [
      'Använd en riktig mobil, både stående och liggande.',
      'Går knapparna att träffa med tummen?',
    ],
  },
  {
    name: 'Läs',
    tips: [
      'Läs texten högt. Förstår du den första gången?',
      'Finns det förkortningar eller interna ord? Heter samma sak samma sak överallt?',
      'Säger länkar och knappar vad som händer?',
    ],
  },
  {
    name: 'Verktyg',
    tips: [
      'axe DevTools, Lighthouse och WAVE hittar en del brister. På den här sidan hittar de inga alls.',
      'Använd verktygen som en första kontroll, aldrig som bevis på att något är tillgängligt.',
      'Tillägg som HeadingsMap visar rubrikerna, och det finns tillägg som visar alt-texter.',
    ],
  },
];

export default function ErrorsPage() {
  // Hidden by default, so a group can try to find the issues themselves first
  const [showIssues, setShowIssues] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main">
        Hoppa till huvudinnehållet
      </a>
      <VersionSwitch />
      <header className="site-header">
        <a href={`${base}tillganglig/`} className="logo">
          Brew &amp; Bean <span className="visually-hidden">– tillgänglig version</span>
        </a>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </header>

      <main id="main" tabIndex={-1} className="errors">
        <h1>Exempel på brister på demosidan och hur du hittar dem</h1>
        <div className="summary-box">
          <p>
            axe hittar inga brister i <a href={base}>versionen med brister</a>, och den får 100 poäng i Lighthouse. Ändå
            finns det minst 37 brister som gör sidan svår eller omöjlig att använda. Här listar vi de brister vi
            känner till. Det kan finnas fler som vi inte har hittat.
          </p>
          <p>
            Automatiska verktyg hittar bara en del av bristerna. Resten hittar du genom att testa själv.{' '}
            <a href={`${base}tillganglig/`}>Den tillgängliga versionen</a> visar hur sidan kan se ut när
            bristerna är rättade.
          </p>
        </div>

        <section aria-labelledby="methods-title">
          <h2 id="methods-title">Så hittar du brister</h2>
          <div className="method-grid">
            {methods.map((m) => (
              <section key={m.name} className="method" aria-labelledby={`method-${m.name}`}>
                <h3 id={`method-${m.name}`}>{m.name}</h3>
                <ul>
                  {m.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section aria-labelledby="issues-title">
          <h2 id="issues-title">Brister</h2>
          <p>Försök gärna hitta bristerna själv innan du visar listan.</p>
          <button
            type="button"
            className="primary"
            aria-expanded={showIssues}
            aria-controls="issue-list"
            onClick={() => setShowIssues(!showIssues)}
          >
            {showIssues ? 'Dölj bristerna' : 'Visa bristerna'}
          </button>

          <ol className="issue-list" id="issue-list" hidden={!showIssues}>
            {issues.map((issue) => (
              <li key={issue.n}>
                <article aria-labelledby={`issue-${issue.n}`} className="issue">
                  <h3 id={`issue-${issue.n}`}>
                    <span className="issue-number">{issue.bonus ? 'Bonus' : `Brist ${issue.n}`}:</span>{' '}
                    {issue.title.replace(/^Bonus: /, '')}
                  </h3>
                  <dl>
                    <dt>Var</dt>
                    <dd>{issue.where}</dd>
                    <dt>Problemet</dt>
                    <dd>{issue.problem}</dd>
                    <dt>Så hittar du det</dt>
                    <dd>{issue.find}</dd>
                    <dt>Testa med</dt>
                    <dd>{issue.methods.join(', ')}</dd>
                    <dt>Kan påverka</dt>
                    <dd>{issue.affects}</dd>
                    <dt>WCAG</dt>
                    <dd>{issue.wcag}</dd>
                  </dl>
                </article>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </>
  );
}
