import './version-switch.css';

/**
 * Demo helper shown at the top of every page: says which version you are looking at and links to
 * the same page in the other version and to the issue list. It is not part of the shop, so it is
 * built to work everywhere.
 */
export default function VersionSwitch() {
  const base = import.meta.env.BASE_URL;
  const path = window.location.pathname.slice(base.length);
  const current = path.startsWith('tillganglig') ? 'accessible' : path.startsWith('fel') ? 'errors' : 'broken';
  const searchPart = /sok\/?$/.test(path) ? 'sok/' + window.location.search : '';

  const pages = {
    broken: { href: base + searchPart, name: 'versionen med brister', link: 'Versionen med brister' },
    accessible: { href: `${base}tillganglig/${searchPart}`, name: 'den tillgängliga versionen', link: 'Den tillgängliga versionen' },
    errors: { href: `${base}fel/`, name: 'listan med alla fel', link: 'Alla fel och hur du hittar dem' },
  };

  return (
    <nav className="version-switch" aria-label="Demoversioner">
      <p>
        Du tittar på <strong>{pages[current].name}</strong>.
      </p>
      <ul>
        {Object.entries(pages)
          // The issue list gives the answers away, so it is only linked from the accessible version
          .filter(([key]) => key !== current && !(current === 'broken' && key === 'errors'))
          .map(([key, page]) => (
            <li key={key}>
              <a href={page.href}>{page.link}</a>
            </li>
          ))}
      </ul>
    </nav>
  );
}
