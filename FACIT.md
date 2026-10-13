# Facit – Brew & Bean

> **0 fel i axe-core 4.13 · 100 i Lighthouse 12.8 · minst 22 riktiga tillgänglighetsbrister**

Sidan är byggd för att se tillgänglig ut. Koden använder `role`, `aria-*`, `<label>`, landmärken och alt-texter, och den passerar automatiska tester. Den är ändå svår eller omöjlig att använda med tangentbord och skärmläsare.

Budskapet till publiken: **automatiska verktyg hittar ungefär 30–40 % av WCAG-problemen. Resten kräver manuell testning, helst med riktiga användare.**

---

## Köra demon

```bash
npm install
npx playwright install chromium   # första gången
npm run dev                       # http://localhost:5173 – visa sidan
npm run test:a11y                 # bygger + kör axe (10 tillstånd) och Lighthouse
```

Du kan också köra Lighthouse direkt i Chrome DevTools (fliken Lighthouse, kategori *Accessibility*) eller med axe DevTools-tillägget. Båda ger grönt.

**Tips:** Starta om sidan (F5) inför varje del av demon. Fokus hamnar på den dolda kryssrutan och nyhetsbrevsdialogen dyker upp efter 4 sekunder. När du har sökt ersätts produkterna av sökresultaten. Ladda om sidan för att få tillbaka dem.

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
- **I verkligheten:** `useEffect` sätter fokus på den osynliga kryssrutan direkt. NVDA säger *"Jag är inte en robot, kryssruta, inte markerad"* på en sida om kaffe, och användaren vet inte var på sidan hen är. En seende tangentbordsanvändare ser inget fokus alls, och första Tab hamnar mitt i sidan i stället för i menyn.
- **Varför verktygen missar det:** axe kontrollerar inte *var* fokus hamnar, och tekniken med visuellt dolda element är legitim (den används till exempel för skip-länkar).
- **Demo:** Ladda om sidan med NVDA på. Tryck sedan Tab utan skärmläsare och fråga: *"Var är fokus?"*
- **Åtgärd:** Flytta aldrig fokus när sidan laddas. En osynlig CAPTCHA ska inte vara fokuserbar alls (`aria-hidden="true"` plus `tabindex="-1"`), eller ska ersättas av en metod utan interaktion.

### 2. Butik-menyn säger "expanderad" men visar ingenting
**Fil:** [Header.jsx](src/components/Header.jsx) och [styles.css](src/styles.css) (`.has-submenu:hover .submenu`)
**WCAG:** 2.1.1 Tangentbord (A), 4.1.2 Namn, roll, värde (A)

- **Koden ser bra ut:** Det är ett läroboksexempel på disclosure-mönstret: `<button>` med `aria-expanded`, `aria-controls` och en `onClick` som växlar state.
- **I verkligheten:** State och `aria-expanded` uppdateras, men undermenyn visas bara med CSS `:hover`. NVDA säger *"Butik, knapp, expanderad"*, och nästa Tab går direkt till "Prenumerationer". Undermenyns fyra länkar går inte att nå utan mus.
- **Varför verktygen missar det:** `aria-controls` pekar på ett id som finns. axe kan inte veta att elementet borde synas när `aria-expanded="true"`.
- **Demo:** Tabba till Butik och tryck Enter. Ingenting syns. Visa sedan med musen att menyn finns.
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

- **I verkligheten:** Om du skriver "abc" och trycker Prenumerera blir ramen röd. Det finns ingen text, ingen `aria-invalid`, ingen `aria-describedby` och ingenting som läses upp. NVDA säger ingenting alls, och den som är färgblind ser kanske ingen skillnad.
- **Varför verktygen missar det:** Ett fält utan felmeddelande är inget fel i sig, och axe vet inte att det har uppstått ett fel.
- **Åtgärd:** Visa en felmeddelandetext, koppla den med `aria-describedby`, sätt `aria-invalid="true"` och flytta fokus till fältet.

### 5. Toasten "har lagts i varukorgen" läses troligen inte upp
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
- **I verkligheten:** Knappen heter bara *"Varukorg"*. Antalet varor finns inte för skärmläsaranvändare, och när det ändras sägs ingenting.
- **Demo:** Lägg till två produkter och tabba till varukorgen. NVDA säger bara *"Varukorg, knapp"*.
- **Åtgärd:** `<span className="visually-hidden">, 2 varor</span>` eller `aria-label="Varukorg, 2 varor"`.

### 7. Produktkortens läsordning stämmer inte med den visuella ordningen
**Fil:** [ProductCard.jsx](src/components/ProductCard.jsx), `grid-template-areas` i [styles.css](src/styles.css)
**WCAG:** 1.3.2 Meningsfull ordning (A), 2.4.3 Fokusordning (A)

- **I verkligheten:** Visuellt är ordningen bild, namn, beskrivning, pris och knapp. I DOM:en kommer **knappen först**. NVDA säger *"Lägg i varukorgen, knapp"* innan användaren vet vilken produkt det gäller, och priset läses före namnet.
- **Varför verktygen missar det:** CSS grid får flytta saker. axe jämför inte visuell ordning med DOM-ordning.
- **Demo:** `Insert+↓` (läs allt) på ett kort, eller Tab genom korten.
- **Åtgärd:** Låt DOM-ordningen följa den visuella ordningen och använd bara CSS för layout.

### 8. Sex identiska "Lägg i varukorgen"-knappar
**WCAG:** 2.4.6 Rubriker och etiketter (AA), 2.4.9 Länksyfte (AAA)

- **I verkligheten:** I NVDA:s elementlista (`Insert+F7`, "Knappar") står *"Lägg i varukorgen"* sex gånger och *"Lägg till i önskelistan"* sex gånger.
- **Åtgärd:** `aria-label` eller visuellt dold text: *"Lägg Kenya AA i varukorgen"*.

### 9. Produktnamn är inte rubriker
**WCAG:** 1.3.1 Information och relationer (A)

- **I verkligheten:** Namnen ser ut som rubriker men är `<div className="card-title">`. Med `H` hoppar NVDA från "Vårt kaffe" direkt förbi alla produkter.
- **Varför verktygen missar det:** axe kan inte veta att fet, stor text *borde* vara en rubrik.
- **Åtgärd:** Använd `<h3>`.

### 10. Alt-texter är filnamn
**Fil:** [products.js](src/products.js)
**WCAG:** 1.1.1 Icke-textuellt innehåll (A)

- **I verkligheten:** Bilderna är riktiga foton: kaffeskörd, kaffebär, bönor, en kaffesäck från Kenya och två koppar espresso. NVDA säger ändå bara *"DSC_0042.jpg, grafik"*. Den som inte ser bilden får aldrig veta vad den visar, och Kenya-bilden förklarar till exempel ursprunget. Alt-attributet finns, så axe och Lighthouse är nöjda.
- **Åtgärd:** Skriv en meningsfull alt-text, eller använd `alt=""` om bilden är dekorativ, vilket den nästan är eftersom namnet står bredvid.

### 11. Rea-priset: "189 kr 139 kr"
**WCAG:** 1.3.1 Information och relationer (A)

- **I verkligheten:** `<s>` (genomstruken) läses inte upp som genomstruken av NVDA med standardinställningar. Sumatra-kortet låter som *"189 kr 139 kr"*. Vilket pris gäller?
- **Åtgärd:** Lägg till dold text, till exempel *"Tidigare 189 kr, nu 139 kr"*.

### 12. "Slutsåld" syns men hörs inte, och knappen fungerar fortfarande
**WCAG:** 1.3.1 Information och relationer (A), 1.4.1 Användning av färg (A)

- **Koden ser bra ut:** *"Purely visual label"* med `aria-hidden="true"`.
- **I verkligheten:** Kenya AA är slutsåld, men för en skärmläsaranvändare ser kortet ut exakt som de andra. Knappen är bara grå, inte `disabled`. Användaren klickar och får ett felmeddelande som (se punkt 5) troligen inte heller läses upp.
- **Åtgärd:** Ta bort `aria-hidden` och gör statusen tydlig i knappens namn eller med `disabled`/`aria-disabled`.

### 13. Önskelisteknappen går inte att använda med tangentbord
**Fil:** [ProductCard.jsx](src/components/ProductCard.jsx)
**WCAG:** 2.1.1 Tangentbord (A)

- **Koden ser bra ut:** Den har `role="button"`, `tabIndex={0}`, `aria-label` och till och med `aria-pressed`. Den här är utmärkt att visa för publiken.
- **I verkligheten:** Det är en `<div>` med bara `onClick`. Enter och Space gör ingenting. Fokus når knappen och NVDA säger *"Lägg till i önskelistan, växlingsknapp, inte nedtryckt"*, men den går inte att aktivera.
- **Åtgärd:** Använd `<button>`. Det ger tangentbordsstöd gratis.

### 14. Fokusindikatorn är nästan osynlig
**Fil:** [styles.css](src/styles.css) (`:focus { outline: none; }`)
**WCAG:** 2.4.7 Synligt fokus (AA), 2.4.13 Fokusutseende (AAA)

- **Koden ser bra ut:** Det finns *en* fokusstil (`:focus-visible` med box-shadow), "anpassad till varumärket".
- **I verkligheten:** Ringen är `#f1ece4` på vit bakgrund, med en kontrast på cirka 1,2:1. Den syns i princip inte.
- **Varför verktygen missar det:** axe och Lighthouse testar inte fokusindikatorer.
- **Åtgärd:** Använd en tydlig `outline` med minst 3:1 kontrast mot omgivningen, till exempel `outline: 3px solid #6f3b1e; outline-offset: 2px`.

### 15. Sidans språk är engelska, men innehållet är på svenska
**Fil:** [index.html](index.html) (`<html lang="en">`)
**WCAG:** 3.1.1 Sidans språk (A)

- **Koden ser bra ut:** `lang`-attributet finns och har ett giltigt värde.
- **I verkligheten:** NVDA och andra skärmläsare väljer röst och uttal utifrån `lang`. All svensk text läses med engelsk röst, och *"Nyrostat kaffe"* blir obegripligt. Punktskriftsskärmar och avstavning påverkas också, och webbläsarens översättningsfunktion tror att sidan redan är på engelska.
- **Varför verktygen missar det:** axe kontrollerar bara att `lang` finns och är en giltig språkkod (`html-has-lang`, `html-lang-valid`). Det jämför inte språkkoden med det faktiska innehållet.
- **Demo:** Slå på NVDA och läs rubriken med `Insert+↓`. Byt sedan till `lang="sv"` i DevTools och läs igen.
- **Obs:** Det här påverkar alla NVDA-citat i facit. Publiken kommer att höra dem med engelskt uttal.
- **Åtgärd:** `<html lang="sv">`. Markera stycken på andra språk med ett eget `lang`, till exempel `<span lang="en">Single origin</span>`.

### 16. Sökresultaten: en lång lista som inte är en lista
**Fil:** [Search.jsx](src/components/Search.jsx), [searchResults.js](src/searchResults.js)
**WCAG:** 1.3.1 Information och relationer (A), 4.1.3 Statusmeddelanden (AA), 2.4.4 Länksyfte (A), 2.4.6 Rubriker och etiketter (AA)

- **Koden ser bra ut:** Sökfältet ligger i ett formulär med `role="search"`, fältet och knappen har `aria-label` och varje träff är en riktig länk.
- **I verkligheten:**
  - De 24 träffarna är `<div>`-element, inte `<ul>`/`<li>`. NVDA säger inte *"lista med 24 objekt"*, och det går inte att hoppa mellan träffar med `I` eller förbi hela listan med `,`.
  - Resultaten saknar rubrik, så det går inte att hoppa dit med `H`.
  - Efter sökningen får en skärmläsaranvändare ingen återkoppling. Fokus står kvar på sökknappen och antalet träffar (*"Visar 1–24 av 1 312 träffar"*) läses inte upp.
  - I länklistan (`Insert+F7`) står *"Kaffe"* tre gånger och *"Läs mer"* tre gånger, plus *"Untitled"*, *"Sida 3"* och ett PDF-filnamn.
  - Själva resultaten är dåliga: utgångna sidor, interna dokument, en avslutad platsannons, en slutsåld produkt högt upp och en sida som säger *"Klicka här"*. Det är ett innehållsproblem, men det drabbar hårdast den som inte kan skumma sidan visuellt.
  - Sökningen är hårdkodad, så alla sökord ger samma träffar.
- **Varför verktygen missar det:** `<div>`-element är tillåtna, länkarna har text och identiska länktexter är inget fel i axe. Verktyget vet inte heller att något just har uppdaterats.
- **Demo:** Sök på "kaffe" med NVDA på. Lyssna: det blir tyst. Öppna sedan elementlistan (`Insert+F7`) och visa länkarna.
- **Åtgärd:** Lägg till en rubrik (*"24 träffar för kaffe"*) och flytta fokus dit, eller använd en live region. Märk upp träffarna som `<ol>`. Ge sidorna unika och beskrivande titlar och rensa ut gammalt innehåll ur sökindexet.

### 17. Avancerad sökning i fyra fasta spalter
**Fil:** [Search.jsx](src/components/Search.jsx), `.search-filters` i [styles.css](src/styles.css)
**WCAG:** 1.4.10 Omflödning (AA), 1.4.4 Ändra textstorlek (AA), 1.3.2 Meningsfull ordning (A)

- **Koden ser bra ut:** Alla fält har `<label>`, de är grupperade i en `<fieldset>` med `<legend>` och formuläret ser prydligt ut i en vanlig skrivbordsvy.
- **I verkligheten:**
  - Spalterna har fast bredd (`repeat(4, 230px)`). Vid 200 % zoom på en vanlig skärm hamnar två spalter och knappen *"Visa resultat"* utanför skärmen, och användaren måste scrolla i sidled. Vid 400 % (motsvarande 320 px bredd) blir det mycket värre.
  - Den som använder ett förstoringsprogram (ZoomText, Windows Förstoringsglas) ser bara en liten del av skärmen åt gången. Det är lätt att missa att det finns fler fält till höger, och skicka-knappen ligger längst bort i nedre högra hörnet.
  - Tabbordningen går nedåt i varje spalt och hoppar sedan upp till nästa spalt. Med förstoring hoppar vyn fram och tillbaka över hela formuläret.
  - Telefoner får en enspaltig layout (`@media (pointer: coarse)`), men det gäller inte zoom på en dator. Den som testar på mobilen ser alltså inget problem.
- **Varför verktygen missar det:** Varken axe eller Lighthouse har någon regel för omflödning, vid en fönsterbredd på 1 280 px ser formuläret rätt ut och Lighthouse testar med en emulerad telefon.
- **Demo:** Zooma till 200 % med `Ctrl` och `+` och visa att knappen *"Visa resultat"* försvinner. Starta gärna Windows Förstoringsglas (`Win` och `+`) och försök fylla i formuläret.
- **Åtgärd:** Använd en enda spalt, eller en flexibel layout (`repeat(auto-fit, minmax(14rem, 1fr))`) som bryts om till en spalt vid zoom. Placera skicka-knappen direkt efter sista fältet. Basera layouten på tillgänglig bredd, inte på typ av enhet.

### 18. Krånglig text: förkortningar och långa meningar
**Fil:** [PurchaseInfo.jsx](src/components/PurchaseInfo.jsx), hero-texten i [App.jsx](src/App.jsx), [NewsletterDialog.jsx](src/components/NewsletterDialog.jsx) och sökresultaten
**WCAG:** 3.1.3 Ovanliga ord (AAA), 3.1.4 Förkortningar (AAA), 3.1.5 Läsnivå (AAA). Språklagen (2009:600) kräver dessutom att språket i offentlig verksamhet ska vara *"vårdat, enkelt och begripligt"*.

- **I verkligheten:** Avsnittet *"Bra att veta inför ditt köp"* består av tre meningar på 55–75 ord var, med vardagliga förkortningar som *bl.a., inkl., exkl., t.ex., ordernr.* och *kundnr.* Texten är skriven som på många riktiga webbutiker. Det är inte förkortningarna i sig som är värst, utan meningslängden. Bannern (punkt 19), sökresultaten och hero-texten (*"dvs."*) har samma stil.
  - Skärmläsare läser förkortningar på olika sätt. *"fr.o.m."* kan bli *"f r punkt o punkt m"*, och med `lang="en"` (punkt 15) blir det ännu värre.
  - Långa meningar belastar arbetsminnet. Det drabbar personer med kognitiva funktionsnedsättningar, dyslexi, afasi eller ett annat modersmål än svenska, men också alla som läser på mobilen eller i en stressig situation.
  - Viktig information (att öppnat kaffe inte omfattas av ångerrätten) är gömd mitt i en mening.
- **Varför verktygen missar det:** Verktygen läser inte texten. Det kräver en människa, eller ett läsbarhetsmått som LIX.
- **Demo:** Be någon i publiken läsa första stycket högt och sedan förklara vad det betyder. Visa sedan en version på klarspråk:
  > *Du kan ångra ditt köp inom 14 dagar. Det gäller inte kaffe som du har öppnat.*
- **Åtgärd:** Skriv det viktigaste först. Använd korta meningar (högst 15–20 ord), skriv ut förkortningar och dela upp texten i punktlistor. Se Språkrådets råd om klarspråk och ISO 24495-1.

### 19. Fast banner som täcker nästan hela skärmen i liggande läge
**Fil:** [InfoBanner.jsx](src/components/InfoBanner.jsx), `.info-banner` i [styles.css](src/styles.css)
**WCAG:** 1.4.10 Omflödning (AA), 2.4.11 Fokus inte dolt, minimum (AA, WCAG 2.2), 1.3.4 Visningsriktning (AA)

- **Koden ser bra ut:** Bannern är ett `<aside>` med `aria-label`, länken har beskrivande text och det finns en riktig `<button>` för att stänga.
- **I verkligheten:**
  - Bannern har `position: sticky` och mycket text. På en mobil i liggande läge täcker den nästan hela skärmen: cirka 94 % av höjden på en iPhone 13 och 82 % på en Pixel 7. Resten av sidan scrollar förbi i en springa på några pixlar.
  - Den som inte kan vrida telefonen (till exempel för att den sitter fast i ett rullstolsfäste) kan i praktiken inte använda sidan.
  - På datorn täcker bannern de översta cirka 220 pixlarna. När du tabbar genom sidan hamnar fokuserade länkar och knappar *under* bannern och syns inte (2.4.11).
  - Vid zoom växer bannern i takt med texten och tar en allt större del av skärmen.
- **Varför verktygen missar det:** axe och Lighthouse kontrollerar inte hur stor del av skärmen ett fast element tar, eller om fokus hamnar bakom det. axe rapporterar bara *needs review* för kontrast, eftersom text ligger ovanpå annan text.
- **Demo:** Öppna DevTools, välj enhetsläge och en telefon och vrid till liggande läge. Scrolla. Tabba sedan genom produktkorten i vanlig desktopvy och visa att fokus försvinner under bannern.
- **Åtgärd:** Låt bannern scrolla med sidan, och gör den kort och lätt att stänga. Om något måste vara fast, håll det lågt och stäng av `sticky` vid låg skärmhöjd (`@media (max-height: 500px)`). Använd `scroll-padding-top` så att fokuserade element inte hamnar bakom.

### 20. Mycket luft mellan interaktiva element
**Fil:** [styles.css](src/styles.css) (`main`, `.site-header`, `.menu`, `.search-bar`, `.search-filters`, `.grid`)
**WCAG:** Inget enskilt framgångskriterium. Problemet hänger ihop med 1.4.10 Omflödning och 2.4.7 Synligt fokus, och det är ett välkänt problem för användare av förstoringsprogram.

- **I verkligheten:** Sidan är upp till 1 680 px bred.
  - Varukorgen sitter längst till höger, långt från menyn.
  - Sökknappen sitter cirka 1 500 px från början av sökfältet.
  - Filterspalterna är utspridda över hela bredden.
  - I varje produktkort sitter priset längst till vänster och knappen längst till höger.
  - Med 4–8 gångers förstoring ser användaren bara en liten del av skärmen. Efter att ha skrivit i sökfältet måste hen leta upp sökknappen, och efter att ha läst priset vet hen inte att knappen finns långt till höger. Mellanrummen ser ut som slutet på innehållet.
- **Varför verktygen missar det:** Avstånd är ingen regel. Sidan ser luftig och modern ut för den som ser hela skärmen.
- **Demo:** Starta Windows Förstoringsglas (`Win` och `+`), zooma till 400 % och försök söka eller lägga en produkt i varukorgen. Visa sedan sökfältet utan förstoring.
- **Åtgärd:** Placera knappar intill det de hör till. Begränsa radlängd och komponentbredd, till exempel `max-width` på formulär och kort. Gruppera relaterade kontroller visuellt.

### 21. Oändlig laddning: sidfoten går inte att nå
**Fil:** [Search.jsx](src/components/Search.jsx) (`IntersectionObserver`)
**WCAG:** 2.1.1 Tangentbord (A), 2.4.3 Fokusordning (A), 4.1.3 Statusmeddelanden (AA)

- **Koden ser bra ut:** Det är en vanlig och modern teknik. Resultaten är riktiga länkar, och texten *"Laddar fler resultat …"* visas medan nästa sida laddas.
- **I verkligheten:**
  - När listan närmar sig slutet laddas 24 nya träffar, och sedan 24 till, upp till 1 312 stycken. När du tabbar genom resultaten laddas nya träffar innan du hinner nå sidfoten. I våra tester hade 144 träffar laddats efter 150 tryck på Tab, och fokus var fortfarande i listan.
  - I sidfoten finns *Kundtjänst*, *Köpvillkor* och *Tillgänglighetsredogörelse*. De går i praktiken inte att nå med tangentbord, och med musen bara om man hinner klicka innan listan växer.
  - Skärmläsaren får inte veta att nya resultat har laddats. Texten *"Laddar fler resultat …"* är ingen live region, och träffräknaren (*"Visar 1–48 av 1 312"*) uppdateras tyst.
  - Den som tappar positionen, till exempel genom att ladda om sidan, måste börja om från början.
- **Varför verktygen missar det:** Verktygen testar ett ögonblick. De scrollar inte och ser aldrig att innehållet växer.
- **Demo:** Sök, och tryck sedan `End` flera gånger. Sidfoten syns en kort stund och försvinner sedan. Prova också att tabba till *Tillgänglighetsredogörelse*.
- **Åtgärd:** Använd en knapp, *"Visa fler resultat"*, eller vanlig paginering. Om oändlig laddning är ett krav ska sidfotens viktigaste länkar också finnas på annan plats. Använd en live region för *"24 nya träffar har laddats"*, och flytta inte fokus.

### 22. Alla storlekar i pixlar: din textstorlek ignoreras
**Fil:** [index.html](index.html) (`<html style="font-size: 16px">`), [styles.css](src/styles.css)
**WCAG:** 1.4.4 Ändra textstorlek (AA) är tekniskt sett **godkänt**, eftersom zoom i webbläsaren (`Ctrl` och `+`) fortfarande fungerar. Det här är ännu ett exempel på nyans: kravet uppfylls, men användarens egen inställning ignoreras.

- **Koden ser bra ut:** Kommentaren säger *"Pixel-perfect typography, identical on every device"*. Designen ser likadan ut överallt.
- **I verkligheten:**
  - Roten är låst till `16px`, både i `<html>`-taggen och i CSS. Alla textstorlekar, marginaler och avstånd är i `px` i stället för `rem`/`em`.
  - Många med nedsatt syn ökar standardstorleken på text i webbläsaren i stället för att zooma, eftersom zoom även förstorar bilder och layout och ofta ger horisontell scroll. På den här sidan händer ingenting när de gör det.
  - Användaren tror att inställningen fungerar, eftersom andra webbplatser blir större. Här är texten fortfarande lika liten, till exempel etiketterna i filtret (14 px).
- **Varför verktygen missar det:** `px` är giltig CSS, och verktygen testar med webbläsarens standardinställningar.
- **Demo:** Öppna en annan sida, till exempel en svensk myndighetssida, i en flik bredvid. I Chrome väljer du *Inställningar → Utseende → Teckenstorlek → Mycket stor*. Den andra sidan växer, men Brew & Bean ser likadan ut. I Firefox kan du också välja *Visa → Zooma → Zooma endast text*.
- **Åtgärd:** Sätt aldrig `font-size` på `<html>` i `px`. Använd `rem` för textstorlekar och gärna för avstånd, så att layouten växer med texten.

### Bonus: "Klicka här" i sidfoten
**WCAG:** 2.4.9 Länksyfte, endast länktext (AAA). 2.4.4 (A) är **godkänt** eftersom sammanhanget i meningen räcker.

Det här är ett bra exempel på nyans: Tekniskt sett uppfylls nivå A, men i NVDA:s länklista (`Insert+F7`) står *"klicka här"* två gånger utan sammanhang.

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
| Sidans språk (15) | ✅ | – | ❌ |
| Sökresultat (16) | ✅ | ⚠️ | ❌ |
| Formulär vid zoom (17) | ✅ | ⚠️ | – |
| Klarspråk (18) | ✅ | ❌ | ❌ |
| Fast banner (19) | ✅ | ❌ | – |
| Luft vid förstoring (20) | ✅ | – | – |
| Oändlig laddning (21) | ✅ | ❌ | ❌ |
| Textstorlek i px (22) | ✅ | – | – |

**Lärdomar:**
1. **ARIA är ett löfte, inte en funktion.** `aria-expanded`, `role="button"` och `aria-modal` *beskriver* beteende. Du måste fortfarande *bygga* beteendet.
2. **Använd native-element** (`<button>`, `<dialog>`, `<h3>`) så slipper du hälften av problemen.
3. **Automatiska verktyg är en golvnivå, inte ett kvitto.** Kör dem i CI, men testa också med tangentbord, skärmläsare och helst riktiga användare.
