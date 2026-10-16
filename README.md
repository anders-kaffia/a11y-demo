# Brew & Bean – 100 % in the tests, still inaccessible

An AI-generated demo web shop that scores **0 violations in axe-core** and **100 in Lighthouse accessibility**, yet has **at least 37 serious accessibility issues**.

**Live demo:** https://anders-kaffia.github.io/a11y-demo/

## Why this project exists

AI coding assistants can produce code that *looks* accessible: semantic landmarks, `aria-*` attributes, labels, alt text and roles everywhere. If "passes axe and Lighthouse" is used as the definition of done, the result can still be hard or impossible to use for many people.

This project was generated with an AI coding assistant (Claude Code) to show exactly that. Every page and UI state passes the automated tests, but:

- keyboard users lose focus, get stuck behind a dialog and can never reach the footer
- screen reader users hear file names, "read more" nine times and nothing at all when they search
- people using zoom or a screen magnifier get horizontal scrolling, a banner that covers the screen and tooltips that vanish before they can be read
- people with low vision or colour vision deficiencies, or who use Windows High Contrast, miss text, stock status and focus indicators

**The lesson:** automated tools only cover part of WCAG. They are a useful baseline, not proof of accessibility. You still need to test manually with a keyboard, a screen reader, zoom and magnification, and ideally with real users.

The issues are deliberate, but none of them is exotic. They are patterns found on real websites every day, and an AI assistant can produce them just as easily as a human.

## Test results

| Tool | Result |
|---|---|
| axe-core 4.13 (all rules incl. best practices, 15 UI states) | **0 violations** |
| Lighthouse 12.8 – Accessibility (start page and search page) | **100** |
| Keyboard, screen reader (NVDA), zoom, magnifier, forced colours | **37+ issues** |

Some issues show up in axe only as *needs review*, for example text on a background image. They do not count as violations, so the score stays at 0 violations and 100 points.

## The issues

Each issue is marked in the code with a comment starting with `A11Y-ISSUE #n`. Search for `A11Y-ISSUE` to find them all.

| # | Issue | Main WCAG criteria |
|---|---|---|
| 1 | Hidden "reCAPTCHA" steals focus on page load | 2.4.3, 2.4.7 |
| 2 | Menu button says "expanded" but the submenu only opens on hover | 2.1.1, 4.1.2 |
| 3 | Newsletter dialog appears on scroll: no focus management, no focus trap, no Esc | 2.4.3, 2.4.11, 2.1.1 |
| 4 | Form error shown only as a red border | 3.3.1, 1.4.1 |
| 5 | Status toast is rarely announced, disappears after 3 s and does not say which product was added | 4.1.3, 2.2.1 |
| 6 | Cart item count hidden from screen readers | 1.3.1, 4.1.3 |
| 7 | Product card reading order differs from the visual order | 1.3.2, 2.4.3 |
| 8 | Six identical "add to cart" buttons | 2.4.6 |
| 9 | Product names look like headings but are not | 1.3.1 |
| 10 | Alt text is the file name (`DSC_0042.jpg`) | 1.1.1 |
| 11 | Sale price reads as "189 kr 139 kr" | 1.3.1 |
| 12 | "Sold out" is visual only, and the button still works | 1.3.1, 1.4.1 |
| 13 | Wishlist `div role="button"` cannot be used with a keyboard | 2.1.1 |
| 14 | Focus indicator is practically invisible | 2.4.7 |
| 15 | `lang="en"` on a Swedish page | 3.1.1 |
| 16 | Search results: no list, no heading, nothing announced, poor results | 1.3.1, 4.1.3, 2.4.4 |
| 17 | Multi-column form with fixed widths does not reflow when zoomed | 1.4.10, 1.4.4 |
| 18 | Long sentences and abbreviations (plain language) | 3.1.3–3.1.5 |
| 19 | Sticky banner covers almost the whole screen on a phone in landscape | 1.4.10, 2.4.11 |
| 20 | Wide layout with large gaps between controls, hard with magnification | – |
| 21 | Infinite scroll makes the footer unreachable | 2.1.1, 2.4.3 |
| 22 | All sizes in `px`, root font size locked, so the user's text size setting is ignored | 1.4.4* |
| 23 | Links: "read more" ×9, file names, raw URLs, PDF without size, new window without warning | 2.4.4, 2.4.9 |
| 24 | A "table" made of `div` elements | 1.3.1 |
| 25 | White text on a light hero image | 1.4.3 |
| 26 | `filter: opacity()` lowers contrast, and axe does not notice | 1.4.3 |
| 27 | Infographic SVG named only "Illustration" | 1.1.1, 1.4.3 |
| 28 | Stock status shown by colour alone | 1.4.1 |
| 29 | Hover-only tooltips that vanish when you move towards them | 1.4.13, 2.1.1 |
| 30 | Breaks in Windows High Contrast (forced colours) | 1.4.1, 1.4.11, 2.4.7 |
| 31 | Checkout reservation runs out without warning and throws away what you filled in | 2.2.1 |
| 32 | "Betalningen är godkänd" looks like the end, but the order is not sent, and there is no receipt | 3.3.2, 3.3.4, 4.1.3 |
| 33 | The same thing has different names: Varukorg / Kundvagn / Din order, Prenumerationer / kaffeabonnemang | 3.2.4 |
| 34 | Grind slider can only be dragged: no click, no arrow keys | 2.5.7, 2.1.1 |
| 35 | Compact mobile menu with 24 px targets and no space between them | 2.5.5* |
| 36 | Checkout form: floating labels that shrink to 11 px and get cut off, and no autocomplete | 1.3.5, 3.3.2 |
| 37 | Confetti animation that ignores the "reduce motion" setting | 2.3.3 (AAA) |

\* #22: Technically passes, because browser zoom still works. #35: Passes 2.5.8 (AA, 24 px) but fails 2.5.5 (AAA, 44 px). It is included as an example of the gap between conformance and usability.

A detailed answer key, with how to demonstrate each issue, why the tools miss it and how to fix it, is in [ANSWER-KEY.md](ANSWER-KEY.md). It also includes a suggested running order for a live demo and the NVDA commands you need.

## The accessible version

The same shop, built to work for everyone, is at [`/tillganglig/`](https://anders-kaffia.github.io/a11y-demo/tillganglig/) (Swedish for "accessible"). A yellow bar at the top of every page links to the same page in the other version, so you can compare them side by side during a workshop.

A third page, [`/fel/`](https://anders-kaffia.github.io/a11y-demo/fel/) ("issues"), lists every issue in Swedish with where it is, what the problem is, how to find it, which test method reveals it and who it can affect. It is linked only from the accessible version, so the inaccessible version does not give the answers away. The content is in [src/errors/issues.js](src/errors/issues.js).

Its code is in [src/accessible/](src/accessible/). It shares the product data with the inaccessible version, but every component is rewritten. Some examples:

- No pop-up: the newsletter form is part of the page, with error messages in text and a confirmation that stays.
- The checkout has no time limit, says exactly what you pay and to whom, moves focus to each new step and ends with a receipt and an order number.
- The same word for the same thing everywhere, plain language and a short summary first.
- Text contrast that meets AAA (at least 7:1) in both light and dark mode. The axe test checks this with the `color-contrast-enhanced` rule.
- `rem` units, a visible focus outline, targets of at least 44 × 44 px and a layout that reflows at 320 px width.
- Dark mode that follows the system setting, with a button that overrides it. The button says what it will do ("Byt till mörkt läge", switch to dark mode, or "Byt till ljust läge"), and the choice is remembered in the browser.
- Messages appear next to what they are about and do not disappear by themselves, and the product photos have alt texts that describe them.

It also scores 0 violations in axe and 100 in Lighthouse. The difference between the two versions is invisible to the tools.

## About the language

The site content is in Swedish, because the demo was made for a Swedish audience. Everything else in the project (code, comments and documentation) is in English. The page is deliberately marked up as `lang="en"` (issue #15), so screen readers read the Swedish text with an English voice. The accessible version uses `lang="sv"`.

## Running it

Requires Node.js 18 or later.

```bash
npm install
npx playwright install chromium   # first time only, used by the test scripts
npm run dev                       # start the site at http://localhost:5173
npm run test:a11y                 # build, then run axe-core (15 UI states) and Lighthouse
```

The site has two pages: the start page (`/`) and the search page (`/sok`, for example `/sok?q=kaffe`).

Opening `dist/index.html` directly from disk shows a blank page. Use `npm run preview` after `npm run build` instead.

## Deploying to GitHub Pages

The workflow in [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) builds the site and publishes it to GitHub Pages on every push to `main`. It sets `BASE_PATH` to the repository name, so the site works under `https://<user>.github.io/<repo>/`. The build also copies `index.html` to `sok/index.html`, because GitHub Pages has no fallback for single-page apps.

To enable it in a fork, go to *Settings → Pages* and set *Source* to *GitHub Actions*.

To build for a sub-path locally:

```bash
BASE_PATH=/a11y-demo/ npm run build
```

## Try it yourself

- **Keyboard:** reload the page and press Tab. Where is focus? Then try the "Butik" menu, the newsletter dialog and the search page.
- **Screen reader:** turn on NVDA (Windows) or VoiceOver (macOS) and listen to the start page. Open the links list (NVDA: `Insert+F7`).
- **Zoom and magnification:** zoom the browser to 200–400 %, or use Windows Magnifier (`Win` + `+`) and hover over the info icon next to a price.
- **Mobile landscape:** open DevTools device mode, pick a phone and rotate it.
- **Colour and contrast:** in Chrome DevTools, go to *Rendering* and emulate *Deuteranopia* or *forced-colors: active*.
- **Text size:** set a larger default font size in your browser settings and compare with another website.

## Do not copy this code

The code outside [src/accessible/](src/accessible/) is intentionally inaccessible. Do not use it as a template.

## License

The code and documentation are released under the [MIT License](LICENSE).

The photos in `public/img/` are not covered by the MIT License. They are from Unsplash and are used under the [Unsplash License](https://unsplash.com/license).

## Credits

Product and hero photos from [Unsplash](https://unsplash.com/license) (free to use, no attribution required). Photographers: Gerson Cifuentes, David Restrepo, Indra Projects, tommao wang, Katt Galvan, Irene Kredenets and Kelly Sikkema.

Some of the link and content issues were inspired by Imperial College London's [bad accessibility example page](https://www.imperial.ac.uk/staff/tools-and-reference/web-guide/training-and-events/materials/accessibility/bad-example/).
