# Facit – Brew & Bean

> **0 fel i axe-core 4.13 · 100 i Lighthouse 12.8 · minst 13 riktiga tillgänglighetsbrister**

Sidan är byggd för att se tillgänglig ut. Koden använder `role`, `aria-*`, `<label>`, landmärken och alt-texter, och den passerar automatiska tester. Den är ändå svår eller omöjlig att använda med tangentbord och skärmläsare.

Budskapet till publiken: **automatiska verktyg hittar ungefär 30–40 % av WCAG-problemen. Resten kräver manuell testning, helst med riktiga användare.**

---

## Köra demon

```bash
npm install
npx playwright install chromium   # första gången
npm run dev                       # http://localhost:5173 – visa sidan
npm run test:a11y                 # bygger + kör axe (7 tillstånd) och Lighthouse
```

Du kan också köra Lighthouse direkt i Chrome DevTools (fliken Lighthouse, kategori *Accessibility*) eller med axe DevTools-tillägget. Båda ger grönt.

**Tips:** Starta om sidan (F5) inför varje del av demon. Fokus hamnar på den dolda kryssrutan och nyhetsbrevsdialogen dyker upp efter 4 sekunder.

## Föreslaget upplägg (cirka 15 min)

1. **Visa koden** (2 min). Öppna [NewsletterDialog.jsx](src/components/NewsletterDialog.jsx) och [Header.jsx](src/components/Header.jsx). Fråga publiken: *"Ser det här tillgängligt ut?"* De flesta svarar ja.
2. **Kör testerna** (2 min). Kör `npm run test:a11y` eller Lighthouse i DevTools och visa 0 fel och 100 poäng.
3. **Släpp musen** (5 min). Gå igenom sidan med bara Tab, Shift+Tab, Enter, Space och Esc.
4. **Slå på NVDA** (5 min). Ladda om sidan och lyssna.
5. **Avslutning.** Visa listan nedan: *"Allt det här passerade axe och Lighthouse."*

### NVDA-kommandon du behöver

| Tangent | Funktion |
|---|---|
| `Ctrl+Alt+N` | Starta NVDA |
| `Insert+Q` | Avsluta NVDA |
| `Ctrl` | Tysta talet |
| `Tab` / `Shift+Tab` | Nästa/föregående fokuserbara element |
| `H` / `1`–`6` | Nästa rubrik / rubriknivå (i läsläge) |
| `B` | Nästa knapp (i läsläge) |
| `Insert+F7` | Elementlista: länkar, rubriker, landmärken |
| `Insert+↓` | Läs allt från markören |
| `Insert+Space` | Växla mellan läsläge och fokusläge |

---

## Bristerna

Varje brist beskrivs med vad koden påstår, vad som faktiskt händer, varför verktygen inte ser det och hur man demonstrerar den.

### 1. Dold "reCAPTCHA" tar fokus när sidan laddas
**Fil:** [BotProtection.jsx](src/components/BotProtection.jsx)
**WCAG:** 2.4.3 Fokusordning (A), 2.4.7 Synligt fokus (AA)

- **Koden ser bra ut:** Den har en riktig `<input type="checkbox">` med kopplad `<label>`, och den är "visually hidden" men "tillgänglig för hjälpmedel".
- **I verkligheten:** `useEffect` sätter fokus på den osynliga kryssrutan direkt. NVDA säger *"I'm not a robot, kryssruta, inte markerad"* på en sida om kaffe, och användaren vet inte var på sidan hen är. En seende tangentbordsanvändare ser inget fokus alls, och första Tab hamnar mitt i sidan i stället för i menyn.
- **Varför verktygen missar det:** axe kontrollerar inte *var* fokus hamnar, och tekniken med visuellt dolda element är legitim (den används till exempel för skip-länkar).
- **Demo:** Ladda om sidan med NVDA på. Tryck sedan Tab utan skärmläsare och fråga: *"Var är fokus?"*
- **Åtgärd:** Flytta aldrig fokus när sidan laddas. En osynlig CAPTCHA ska inte vara fokuserbar alls (`aria-hidden="true"` plus `tabindex="-1"`), eller ska ersättas av en metod utan interaktion.

### 2. Shop-menyn säger "expanderad" men visar ingenting
**Fil:** [Header.jsx](src/components/Header.jsx) och [styles.css](src/styles.css) (`.has-submenu:hover .submenu`)
**WCAG:** 2.1.1 Tangentbord (A), 4.1.2 Namn, roll, värde (A)

- **Koden ser bra ut:** Det är ett läroboksexempel på disclosure-mönstret: `<button>` med `aria-expanded`, `aria-controls` och en `onClick` som växlar state.
- **I verkligheten:** State och `aria-expanded` uppdateras, men undermenyn visas bara med CSS `:hover`. NVDA säger *"Shop, knapp, expanderad"*, och nästa Tab går direkt till "Subscriptions". Undermenyns fyra länkar går inte att nå utan mus.
- **Varför verktygen missar det:** `aria-controls` pekar på ett id som finns. axe kan inte veta att elementet borde synas när `aria-expanded="true"`.
- **Demo:** Tabba till Shop och tryck Enter. Ingenting syns. Visa sedan med musen att menyn finns.
- **Åtgärd:** Styr synligheten med samma state som `aria-expanded`, till exempel `hidden={!shopOpen}`.

### 3. Nyhetsbrevsdialogen: fokus stannar bakom
**Fil:** [NewsletterDialog.jsx](src/components/NewsletterDialog.jsx)
**WCAG:** 2.4.3 Fokusordning (A), 2.4.11 Fokus inte dolt (AA, WCAG 2.2), 2.1.1 Tangentbord (A)

- **Koden ser bra ut:** Den har `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, en `<label>` och en stängknapp med `aria-label`.
- **I verkligheten:**
  - Dialogen dyker upp efter 4 sekunder och **fokus flyttas inte dit**. NVDA säger ingenting, så en skärmläsaranvändare vet inte att den finns.
  - **Fokus fångas inte.** Tab går rakt ut ur dialogen till länkar och knappar *bakom* den mörka bakgrunden. Fokus döljs (2.4.11), och NVDA läser upp element som inte går att se.
  - **Esc** stänger inte dialogen.
  - Bakgrunden är inte `inert`. Eftersom Chrome respekterar `aria-modal` kan läsläget i NVDA ibland bara se dialogen medan Tab ändå når bakgrunden. Två olika världar samtidigt.
  - Stängknappen ligger sist i DOM:en, men visuellt sitter den uppe till höger.
  - När dialogen stängs återförs inte fokus till någon logisk plats.
- **Varför verktygen missar det:** Alla attribut är korrekta. Fokushantering är beteende, inte markup.
- **Demo:** Vänta tills dialogen visas och tryck Tab några gånger. Fokus syns knappt och hamnar bakom bakgrunden. Tryck Esc: inget händer.
- **Åtgärd:** Använd det inbyggda `<dialog>`-elementet med `showModal()`. Det ger fokusfälla, Esc och inert bakgrund automatiskt. Flytta fokus till dialogen när den öppnas och tillbaka till utlösande element när den stängs. Fundera också på om dialogen alls ska visas utan att användaren bett om den.

### 4. Formulärfel visas bara med röd ram
**Fil:** [NewsletterDialog.jsx](src/components/NewsletterDialog.jsx), `.invalid` i [styles.css](src/styles.css)
**WCAG:** 3.3.1 Identifiering av fel (A), 1.4.1 Användning av färg (A)

- **I verkligheten:** Om du skriver "abc" och trycker Subscribe blir ramen röd. Det finns ingen text, ingen `aria-invalid`, ingen `aria-describedby` och ingenting som läses upp. NVDA säger ingenting alls, och den som är färgblind ser kanske ingen skillnad.
- **Varför verktygen missar det:** Ett fält utan felmeddelande är inget fel i sig, och axe vet inte att det har uppstått ett fel.
- **Åtgärd:** Visa en felmeddelandetext, koppla den med `aria-describedby`, sätt `aria-invalid="true"` och flytta fokus till fältet.

### 5. Toasten "Added to cart" läses troligen inte upp
**Fil:** [Toast.jsx](src/components/Toast.jsx)
**WCAG:** 4.1.3 Statusmeddelanden (AA), 2.2.1 Justerbar tidsgräns (A)

- **Koden ser bra ut:** Den har `role="status"`, precis enligt boken.
- **I verkligheten:** Elementet med `role="status"` **renderas samtidigt som texten** (`if (!message) return null`). En live region måste finnas i DOM:en *innan* innehållet ändras för att skärmläsare pålitligt ska läsa upp den. Toasten försvinner dessutom efter 2,5 sekunder, vilket kan vara för kort för den som läser långsamt eller använder förstoring.
- **Varför verktygen missar det:** `role="status"` är giltig och axe ser aldrig ändringen ske.
- **Obs:** Beteendet varierar mellan versioner av NVDA och Chrome. **Testa på din dator innan demon.** Om den ändå läses upp kan du visa att det är just så opålitligt det är.
- **Åtgärd:** Rendera live-regionen alltid (tom) och byt bara texten.

### 6. Varukorgens antal är dolt för skärmläsare
**Fil:** [Header.jsx](src/components/Header.jsx)
**WCAG:** 1.3.1 Information och relationer (A), 4.1.3 Statusmeddelanden (AA)

- **Koden ser bra ut:** Kommentaren låter omtänksam: *"Hidden from screen readers: 'left paren two right paren' sounds awful"*.
- **I verkligheten:** Knappen heter bara *"Cart"*. Antalet varor finns inte för skärmläsaranvändare, och när det ändras sägs ingenting.
- **Demo:** Lägg till två produkter och tabba till varukorgen. NVDA säger bara *"Cart, knapp"*.
- **Åtgärd:** `<span className="visually-hidden">, 2 items</span>` eller `aria-label="Cart, 2 items"`.

### 7. Produktkortens läsordning stämmer inte med den visuella ordningen
**Fil:** [ProductCard.jsx](src/components/ProductCard.jsx), `grid-template-areas` i [styles.css](src/styles.css)
**WCAG:** 1.3.2 Meningsfull ordning (A), 2.4.3 Fokusordning (A)

- **I verkligheten:** Visuellt är ordningen bild, namn, beskrivning, pris och knapp. I DOM:en kommer **knappen först**. NVDA säger *"Add to cart, knapp"* innan användaren vet vilken produkt det gäller, och priset läses före namnet.
- **Varför verktygen missar det:** CSS grid får flytta saker. axe jämför inte visuell ordning med DOM-ordning.
- **Demo:** `Insert+↓` (läs allt) på ett kort, eller Tab genom korten.
- **Åtgärd:** Låt DOM-ordningen följa den visuella ordningen och använd bara CSS för layout.

### 8. Sex identiska "Add to cart"-knappar
**WCAG:** 2.4.6 Rubriker och etiketter (AA), 2.4.9 Länksyfte (AAA)

- **I verkligheten:** I NVDA:s elementlista (`Insert+F7`, "Knappar") står *"Add to cart"* sex gånger och *"Add to wishlist"* sex gånger.
- **Åtgärd:** `aria-label` eller visuellt dold text: *"Add Kenya AA to cart"*.

### 9. Produktnamn är inte rubriker
**WCAG:** 1.3.1 Information och relationer (A)

- **I verkligheten:** Namnen ser ut som rubriker men är `<div className="card-title">`. Med `H` hoppar NVDA från "Our coffees" direkt förbi alla produkter.
- **Varför verktygen missar det:** axe kan inte veta att fet, stor text *borde* vara en rubrik.
- **Åtgärd:** Använd `<h3>`.

### 10. Alt-texter är filnamn
**Fil:** [products.js](src/products.js)
**WCAG:** 1.1.1 Icke-textuellt innehåll (A)

- **I verkligheten:** NVDA säger *"DSC_0042.jpg, grafik"*. Alt-attributet finns, så axe och Lighthouse är nöjda.
- **Åtgärd:** Skriv en meningsfull alt-text, eller använd `alt=""` om bilden är dekorativ, vilket den nästan är eftersom namnet står bredvid.

### 11. Rea-priset: "$18 $13"
**WCAG:** 1.3.1 Information och relationer (A)

- **I verkligheten:** `<s>` (genomstruken) läses inte upp som genomstruken av NVDA med standardinställningar. Sumatra-kortet låter som *"18 dollar 13 dollar"*. Vilket pris gäller?
- **Åtgärd:** Lägg till dold text, till exempel *"Was $18, now $13"*.

### 12. "Sold out" syns men hörs inte, och knappen fungerar fortfarande
**WCAG:** 1.3.1 Information och relationer (A), 1.4.1 Användning av färg (A)

- **Koden ser bra ut:** *"Purely visual label"* med `aria-hidden="true"`.
- **I verkligheten:** Kenya AA är slutsåld, men för en skärmläsaranvändare ser kortet ut exakt som de andra. Knappen är bara grå, inte `disabled`. Användaren klickar och får ett felmeddelande som (se punkt 5) troligen inte heller läses upp.
- **Åtgärd:** Ta bort `aria-hidden` och gör statusen tydlig i knappens namn eller med `disabled`/`aria-disabled`.

### 13. Önskelisteknappen går inte att använda med tangentbord
**Fil:** [ProductCard.jsx](src/components/ProductCard.jsx)
**WCAG:** 2.1.1 Tangentbord (A)

- **Koden ser bra ut:** Den har `role="button"`, `tabIndex={0}`, `aria-label` och till och med `aria-pressed`. Den här är utmärkt att visa för publiken.
- **I verkligheten:** Det är en `<div>` med bara `onClick`. Enter och Space gör ingenting. Fokus når knappen och NVDA säger *"Add to wishlist, växlingsknapp, inte nedtryckt"*, men den går inte att aktivera.
- **Åtgärd:** Använd `<button>`. Det ger tangentbordsstöd gratis.

### 14. Fokusindikatorn är nästan osynlig
**Fil:** [styles.css](src/styles.css) (`:focus { outline: none; }`)
**WCAG:** 2.4.7 Synligt fokus (AA), 2.4.13 Fokusutseende (AAA)

- **Koden ser bra ut:** Det finns *en* fokusstil (`:focus-visible` med box-shadow), "anpassad till varumärket".
- **I verkligheten:** Ringen är `#f1ece4` på vit bakgrund, med en kontrast på cirka 1,2:1. Den syns i princip inte.
- **Varför verktygen missar det:** axe och Lighthouse testar inte fokusindikatorer.
- **Åtgärd:** Använd en tydlig `outline` med minst 3:1 kontrast mot omgivningen, till exempel `outline: 3px solid #6f3b1e; outline-offset: 2px`.

### Bonus: "Click here" i sidfoten
**WCAG:** 2.4.9 Länksyfte, endast länktext (AAA). 2.4.4 (A) är **godkänt** eftersom sammanhanget i meningen räcker.

Det här är ett bra exempel på nyans: Tekniskt sett uppfylls nivå A, men i NVDA:s länklista (`Insert+F7`) står *"click here"* två gånger utan sammanhang.

---

## Sammanfattning för sista bilden

| | Automatiska verktyg | Tangentbord | Skärmläsare |
|---|:-:|:-:|:-:|
| Fokus vid laddning (1) | ✅ | ❌ | ❌ |
| Meny (2) | ✅ | ❌ | ❌ |
| Dialog (3) | ✅ | ❌ | ❌ |
| Formulärfel (4) | ✅ | – | ❌ |
| Toast/status (5, 6) | ✅ | – | ❌ |
| Läsordning, rubriker, knappnamn (7–9) | ✅ | ⚠️ | ❌ |
| Alt-text, pris, slutsåld (10–12) | ✅ | – | ❌ |
| Önskelista (13) | ✅ | ❌ | ❌ |
| Fokusindikator (14) | ✅ | ❌ | – |

**Lärdomar:**
1. **ARIA är ett löfte, inte en funktion.** `aria-expanded`, `role="button"` och `aria-modal` *beskriver* beteende. Du måste fortfarande *bygga* beteendet.
2. **Använd native-element** (`<button>`, `<dialog>`, `<h3>`) så slipper du hälften av problemen.
3. **Automatiska verktyg är en golvnivå, inte ett kvitto.** Kör dem i CI, men testa också med tangentbord, skärmläsare och helst riktiga användare.
