# Answer key – Brew & Bean

> **0 violations in axe-core 4.13 · 100 in Lighthouse 12.8 · at least 30 real accessibility issues**

The site is built to *look* accessible. The code uses `role`, `aria-*`, `<label>`, landmarks and alt text, and it passes automated tests. Yet it is hard or impossible to use with a keyboard, a screen reader, zoom or a screen magnifier.

The message to the audience: **automated tools only detect a portion of accessibility issues.** Estimates range from roughly a third to just over half, depending on how you count. The rest requires manual testing, ideally with real users.

The site content is in Swedish, so the UI texts quoted below are in Swedish, with an English translation in parentheses the first time they appear. Screen reader output is shown as an English NVDA would announce it.

---

## Running the demo

The easiest option is the live version at https://anders-kaffia.github.io/a11y-demo/. To run it locally:

```bash
npm install
npx playwright install chromium   # first time only
npm run dev                       # http://localhost:5173 – show the site
npm run test:a11y                 # build, then run axe (11 UI states) and Lighthouse
```

You can also run Lighthouse directly in Chrome DevTools (the Lighthouse tab, *Accessibility* category) or use the axe DevTools extension. Both come out green.

**Tip:** Reload the page (F5) before each part of the demo. Focus lands on the hidden checkbox. The newsletter dialog appears once you have scrolled about 300 px, roughly when the products come into view. Search has its own page, `/sok`. You reach it from the search field in the header, or directly via `/sok?q=kaffe`.

## Comments in the code

Every deliberate issue is marked in the code with a comment starting with `A11Y-ISSUE #n`. The number matches this document. Search for `A11Y-ISSUE` in VS Code (`Ctrl+Shift+F`) to see them all.

**Before a demo:** If you want to show the code and ask the audience *"Does this look accessible?"*, the comments give the answer away. Show the code from a branch where they have been removed, or hide them temporarily. The misleading comments, for example *"Hidden from screen readers…"* and *"Accessible modal dialog…"*, are intentional. They are part of the demo.

## Suggested running order (about 15 min)

1. **Show the code** (2 min). Open [NewsletterDialog.jsx](src/components/NewsletterDialog.jsx) and [Header.jsx](src/components/Header.jsx). Ask the audience: *"Does this look accessible?"* Most people say yes.
2. **Run the tests** (2 min). Run `npm run test:a11y` or Lighthouse in DevTools and show 0 violations and a score of 100.
3. **Put the mouse away** (5 min). Go through the page using only Tab, Shift+Tab, Enter, Space and Esc.
4. **Turn on NVDA** (5 min). Reload the page and listen.
5. **Wrap up.** Show the list below: *"All of this passed axe and Lighthouse."*

### NVDA commands you need

| Key | Function |
|---|---|
| `Ctrl+Alt+N` | Start NVDA |
| `Insert+Q` | Quit NVDA |
| `Ctrl` | Stop speech |
| `Tab` / `Shift+Tab` | Next/previous focusable element |
| `H` / `1`–`6` | Next heading / heading level (browse mode) |
| `B` | Next button (browse mode) |
| `Insert+F7` | Elements list: links, headings, landmarks |
| `Insert+↓` | Say all from the cursor |
| `Insert+Space` | Toggle between browse mode and focus mode |

---

## The issues

Each issue describes what the code claims, what actually happens, why the tools miss it and how to demonstrate it.

### 1. Hidden "reCAPTCHA" steals focus on page load
**File:** [BotProtection.jsx](src/components/BotProtection.jsx)
**WCAG:** 2.4.3 Focus Order (A), 2.4.7 Focus Visible (AA)

- **The code looks fine:** It has a real `<input type="checkbox">` with an associated `<label>`, and it is "visually hidden" but "available to assistive technology".
- **What actually happens:** `useEffect` moves focus to the invisible checkbox straight away. NVDA says *"Jag är inte en robot (I'm not a robot), check box, not checked"* on a page about coffee, and the user has no idea where on the page they are. A sighted keyboard user sees no focus at all, and the first Tab lands in the middle of the page instead of in the menu.
- **Why the tools miss it:** axe does not check *where* focus goes, and visually hidden elements are a legitimate technique (used for skip links, for example).
- **Demo:** Reload the page with NVDA on. Then press Tab without a screen reader and ask: *"Where is the focus?"*
- **Fix:** Never move focus on page load. An invisible CAPTCHA should not be focusable at all (`aria-hidden="true"` plus `tabindex="-1"`), or should be replaced with a method that needs no interaction.

### 2. The "Butik" menu says "expanded" but shows nothing
**File:** [Header.jsx](src/components/Header.jsx) and [styles.css](src/styles.css) (`.has-submenu:hover .submenu`)
**WCAG:** 2.1.1 Keyboard (A), 4.1.2 Name, Role, Value (A)

- **The code looks fine:** It is a textbook disclosure pattern: a `<button>` with `aria-expanded`, `aria-controls` and an `onClick` that toggles state.
- **What actually happens:** The state and `aria-expanded` update, but the submenu is only shown with CSS `:hover`. NVDA says *"Butik (Shop), button, expanded"*, and the next Tab goes straight to *"Prenumerationer"* (Subscriptions). The four submenu links cannot be reached without a mouse.
- **Why the tools miss it:** `aria-controls` points to an id that exists. axe cannot know that the element ought to be visible when `aria-expanded="true"`.
- **Demo:** Tab to "Butik" and press Enter. Nothing appears. Then show with the mouse that the menu exists.
- **Fix:** Control visibility with the same state as `aria-expanded`, for example `hidden={!shopOpen}`.

### 3. Newsletter dialog: focus stays behind it
**File:** [NewsletterDialog.jsx](src/components/NewsletterDialog.jsx), the scroll trigger in [App.jsx](src/App.jsx)
**WCAG:** 2.4.3 Focus Order (A), 2.4.11 Focus Not Obscured (Minimum) (AA, WCAG 2.2), 2.1.1 Keyboard (A)

- **The code looks fine:** It has `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, a `<label>` and a close button with an `aria-label`.
- **What actually happens:**
  - The dialog appears once you have scrolled a little, often while you are tabbing through the product cards, and **focus is not moved to it**. NVDA says nothing, so a screen reader user does not know it exists. Someone using magnification may only see a dark area and think the page is broken.
  - **Focus is not trapped.** Tab goes straight out of the dialog to links and buttons *behind* the dark backdrop. Focus is obscured (2.4.11), and NVDA reads out elements that cannot be seen.
  - **Esc** does not close the dialog.
  - The background is not `inert`. Because Chrome respects `aria-modal`, NVDA's browse mode can sometimes only see the dialog while Tab still reaches the background. Two different worlds at the same time.
  - The close button is last in the DOM, but visually it sits in the top right corner.
  - When the dialog closes, focus is not returned to a logical place.
- **Why the tools miss it:** All the attributes are correct. Focus management is behaviour, not markup.
- **Demo:** Tab from the menu down to the product cards. When the page scrolls, the dialog appears. Keep pressing Tab. Focus is barely visible and ends up behind the backdrop. Press Esc: nothing happens.
- **Fix:** Use the native `<dialog>` element with `showModal()`. It gives you a focus trap, Esc and an inert background for free. Move focus into the dialog when it opens and back to the triggering element when it closes. Also consider whether the dialog should appear at all without the user asking for it.

### 4. Form errors shown only as a red border
**File:** [NewsletterDialog.jsx](src/components/NewsletterDialog.jsx), `.invalid` in [styles.css](src/styles.css)
**WCAG:** 3.3.1 Error Identification (A), 1.4.1 Use of Color (A)

- **What actually happens:** If you type "abc" and press *"Prenumerera"* (Subscribe), the border turns red. There is no text, no `aria-invalid`, no `aria-describedby` and nothing is announced. NVDA says nothing at all, and someone who is colour blind may not see any difference.
- **Why the tools miss it:** A field without an error message is not a failure in itself, and axe does not know that an error has occurred.
- **Fix:** Show an error message in text, connect it with `aria-describedby`, set `aria-invalid="true"` and move focus to the field.

### 5. The "added to cart" toast is probably not announced
**File:** [Toast.jsx](src/components/Toast.jsx)
**WCAG:** 4.1.3 Status Messages (AA), 2.2.1 Timing Adjustable (A)

- **The code looks fine:** It has `role="status"`, exactly by the book.
- **What actually happens:** The element with `role="status"` **is rendered at the same time as its text** (`if (!message) return null`). A live region must exist in the DOM *before* its content changes for screen readers to announce it reliably. The toast also disappears after 2.5 seconds, which can be too short for slow readers or people using magnification.
- **Why the tools miss it:** `role="status"` is valid, and axe never sees the change happen.
- **Note:** The behaviour varies between NVDA and Chrome versions. **Test on your machine before the demo.** If it is announced anyway, you can use that to show how unreliable it is.
- **Fix:** Always render the live region (empty) and only change its text.

### 6. The cart count is hidden from screen readers
**File:** [Header.jsx](src/components/Header.jsx)
**WCAG:** 1.3.1 Info and Relationships (A), 4.1.3 Status Messages (AA)

- **The code looks fine:** The comment sounds considerate: *"Hidden from screen readers: 'left paren two right paren' sounds awful"*.
- **What actually happens:** The button is only called *"Varukorg"* (Cart). The number of items is not available to screen reader users, and nothing is said when it changes.
- **Demo:** Add two products and tab to the cart. NVDA only says *"Varukorg, button"*.
- **Fix:** `<span className="visually-hidden">, 2 varor</span>` or `aria-label="Varukorg, 2 varor"` (Cart, 2 items).

### 7. Product card reading order does not match the visual order
**File:** [ProductCard.jsx](src/components/ProductCard.jsx), `grid-template-areas` in [styles.css](src/styles.css)
**WCAG:** 1.3.2 Meaningful Sequence (A), 2.4.3 Focus Order (A)

- **What actually happens:** Visually the order is image, name, description, price and button. In the DOM the **button comes first**. NVDA says *"Lägg i varukorgen (Add to cart), button"* before the user knows which product it is about, and the price is read before the name.
- **Why the tools miss it:** CSS grid is allowed to move things around. axe does not compare the visual order with the DOM order.
- **Demo:** `Insert+↓` (say all) on a card, or Tab through the cards.
- **Fix:** Make the DOM order follow the visual order and use CSS only for layout.

### 8. Six identical "add to cart" buttons
**WCAG:** 2.4.6 Headings and Labels (AA), 2.4.9 Link Purpose (Link Only) (AAA)

- **What actually happens:** In NVDA's elements list (`Insert+F7`, "Buttons") *"Lägg i varukorgen"* appears six times and *"Lägg till i önskelistan"* (Add to wishlist) six times.
- **Fix:** `aria-label` or visually hidden text: *"Lägg Kenya AA i varukorgen"* (Add Kenya AA to cart). See also issue 23 about all the "read more" links.

### 9. Product names are not headings
**WCAG:** 1.3.1 Info and Relationships (A)

- **What actually happens:** The names look like headings but are `<div className="card-title">`. With `H`, NVDA jumps from *"Vårt kaffe"* (Our coffee) straight past all the products.
- **Why the tools miss it:** axe cannot know that bold, large text *should* be a heading.
- **Fix:** Use `<h3>`.

### 10. Alt text is the file name
**File:** [products.js](src/products.js)
**WCAG:** 1.1.1 Non-text Content (A)

- **What actually happens:** The images are real photos: a coffee harvest, coffee cherries, beans, a coffee sack from Kenya and two cups of espresso. NVDA still only says *"DSC_0042.jpg, graphic"*, and because the image is also a link it becomes *"link, DSC_0042.jpg"*. Someone who cannot see the image never finds out what it shows, even though the Kenya photo, for example, explains the origin. The alt attribute exists, so axe and Lighthouse are happy.
- **Fix:** Write meaningful alt text, or use `alt=""` if the image is decorative, which it almost is since the name is right next to it.

### 11. The sale price: "189 kr 139 kr"
**WCAG:** 1.3.1 Info and Relationships (A)

- **What actually happens:** `<s>` (strikethrough) is not announced as strikethrough by NVDA with default settings. The Sumatra card sounds like *"189 kr 139 kr"*. Which price applies?
- **Fix:** Add hidden text, for example *"Tidigare 189 kr, nu 139 kr"* (Was 189 kr, now 139 kr).

### 12. "Sold out" is visible but not heard, and the button still works
**WCAG:** 1.3.1 Info and Relationships (A), 1.4.1 Use of Color (A)

- **The code looks fine:** *"Purely visual label"* with `aria-hidden="true"`.
- **What actually happens:** Kenya AA is sold out (*"Slutsåld"*), but to a screen reader user the card looks exactly like the others. The button is only grey, not `disabled`. The user clicks it and gets an error message that (see issue 5) is probably not announced either.
- **Fix:** Remove `aria-hidden` and make the status clear in the button's name or with `disabled`/`aria-disabled`.

### 13. The wishlist button cannot be used with a keyboard
**File:** [ProductCard.jsx](src/components/ProductCard.jsx)
**WCAG:** 2.1.1 Keyboard (A)

- **The code looks fine:** It has `role="button"`, `tabIndex={0}`, `aria-label` and even `aria-pressed`. This one is great to show the audience.
- **What actually happens:** It is a `<div>` with only `onClick`. Enter and Space do nothing. Focus reaches the button and NVDA says *"Lägg till i önskelistan, toggle button, not pressed"*, but it cannot be activated.
- **Fix:** Use `<button>`. You get keyboard support for free.

### 14. The focus indicator is almost invisible
**File:** [styles.css](src/styles.css) (`:focus { outline: none; }`)
**WCAG:** 2.4.7 Focus Visible (AA), 2.4.13 Focus Appearance (AAA)

- **The code looks fine:** There *is* a focus style (`:focus-visible` with a box-shadow), "adapted to the brand".
- **What actually happens:** The ring is `#f1ece4` on a white background, with a contrast of about 1.2:1. It is practically invisible.
- **Why the tools miss it:** axe and Lighthouse do not test focus indicators.
- **Fix:** Use a clear `outline` with at least 3:1 contrast against its surroundings, for example `outline: 3px solid #6f3b1e; outline-offset: 2px`.

### 15. The page language is English, but the content is Swedish
**File:** [index.html](index.html) (`<html lang="en">`)
**WCAG:** 3.1.1 Language of Page (A)

- **The code looks fine:** The `lang` attribute exists and has a valid value.
- **What actually happens:** NVDA and other screen readers choose voice and pronunciation based on `lang`. All the Swedish text is read with an English voice, and *"Nyrostat kaffe"* (Freshly roasted coffee) becomes unintelligible. Braille displays and hyphenation are affected too, and the browser's translation feature thinks the page is already in English.
- **Why the tools miss it:** axe only checks that `lang` exists and is a valid language code (`html-has-lang`, `html-lang-valid`). It does not compare the language code with the actual content.
- **Demo:** Turn on NVDA and read the heading with `Insert+↓`. Then change it to `lang="sv"` in DevTools and read it again.
- **Note:** This affects every NVDA quote in this document. The audience will hear them with English pronunciation.
- **Fix:** `<html lang="sv">`. Mark passages in other languages with their own `lang`, for example `<span lang="en">Single origin</span>`.

### 16. Search results: a long list that is not a list
**File:** [Search.jsx](src/components/Search.jsx), [searchResults.js](src/searchResults.js)
**WCAG:** 1.3.1 Info and Relationships (A), 4.1.3 Status Messages (AA), 2.4.4 Link Purpose (In Context) (A), 2.4.6 Headings and Labels (AA)

- **The code looks fine:** The search field sits in a form with `role="search"`, the field and the button have an `aria-label`, and every result is a real link.
- **What actually happens:**
  - The 24 results are `<div>` elements, not `<ul>`/`<li>`. NVDA does not say *"list with 24 items"*, and you cannot jump between results with `I` or past the whole list with `,`.
  - The results have no heading, so you cannot jump to them with `H`.
  - After searching, a screen reader user gets no feedback. Focus stays on the search button, and the number of results (*"Visar 1–24 av 1 312 träffar"*, Showing 1–24 of 1,312 results) is not announced.
  - In the links list (`Insert+F7`), *"Kaffe"* (Coffee) appears three times and *"Läs mer"* (Read more) three times, plus *"Untitled"*, *"Sida 3"* (Page 3) and a PDF file name.
  - The results themselves are poor: outdated pages, internal documents, a closed job ad, a sold-out product near the top and a page that just says *"Klicka här"* (Click here). That is a content problem, but it hits hardest for people who cannot skim the page visually.
  - The search is hard-coded, so every query returns the same results.
- **Why the tools miss it:** `<div>` elements are allowed, the links have text and identical link texts are not a failure in axe. The tool also does not know that something has just been updated.
- **Demo:** Search for "kaffe" in the header with NVDA on. The search takes you to a new page, and the results are far down, below the form. Listen: silence. Then open the elements list (`Insert+F7`) and show the links.
- **Fix:** Add a heading (*"24 results for kaffe"*) and move focus to it, or use a live region. Mark up the results as an `<ol>`. Give pages unique, descriptive titles and remove outdated content from the search index.

### 17. Advanced search in four fixed columns
**File:** [Search.jsx](src/components/Search.jsx), `.search-filters` in [styles.css](src/styles.css)
**WCAG:** 1.4.10 Reflow (AA), 1.4.4 Resize Text (AA), 1.3.2 Meaningful Sequence (A)

- **The code looks fine:** Every field has a `<label>`, the fields are grouped in a `<fieldset>` with a `<legend>`, and the form looks tidy in a normal desktop view.
- **What actually happens:**
  - The columns have fixed widths (`repeat(4, 230px)`). At 200 % zoom on a normal screen, two columns and the *"Visa resultat"* (Show results) button end up off screen, and the user has to scroll horizontally. At 400 % (equivalent to a 320 px wide viewport) it gets much worse.
  - Someone using a screen magnifier (ZoomText, Windows Magnifier) only sees a small part of the screen at a time. It is easy to miss that there are more fields to the right, and the submit button is in the far bottom right corner.
  - The tab order goes down each column and then jumps up to the next column. With magnification the view jumps back and forth across the whole form.
  - Phones get a single-column layout (`@media (pointer: coarse)`), but desktop zoom does not. Someone testing on a phone sees no problem.
- **Why the tools miss it:** Neither axe nor Lighthouse has a rule for reflow, the form looks right at a 1,280 px window width, and Lighthouse tests with an emulated phone.
- **Demo:** Zoom to 200 % with `Ctrl` and `+` and show that the *"Visa resultat"* button disappears. Try Windows Magnifier (`Win` and `+`) and fill in the form.
- **Fix:** Use a single column, or a flexible layout (`repeat(auto-fit, minmax(14rem, 1fr))`) that wraps to one column when zoomed. Place the submit button right after the last field. Base the layout on available width, not on the type of device.

### 18. Complicated text: abbreviations and long sentences
**File:** [PurchaseInfo.jsx](src/components/PurchaseInfo.jsx), the hero text in [App.jsx](src/App.jsx), [NewsletterDialog.jsx](src/components/NewsletterDialog.jsx) and the search results
**WCAG:** 3.1.3 Unusual Words (AAA), 3.1.4 Abbreviations (AAA), 3.1.5 Reading Level (AAA). In Sweden, the Language Act (2009:600) also requires public sector language to be "cultivated, simple and comprehensible".

- **What actually happens:** The *"Bra att veta inför ditt köp"* (Good to know before you buy) section consists of three sentences of 55–75 words each, with everyday Swedish abbreviations such as *bl.a., inkl., exkl., t.ex., ordernr.* and *kundnr.* (among other things, including, excluding, e.g., order no., customer no.). The text is written like on many real web shops. It is not the abbreviations themselves that are the worst part, but the sentence length. The banner (issue 19), the search results and the hero text (*"dvs."*, i.e.) have the same style.
  - Screen readers read abbreviations in different ways. *"fr.o.m."* (from and including) can become *"f r dot o dot m"*, and with `lang="en"` (issue 15) it gets even worse.
  - Long sentences load working memory. That affects people with cognitive disabilities, dyslexia, aphasia or a first language other than Swedish, but also anyone reading on a phone or in a stressful situation.
  - Important information (that opened coffee is not covered by the right of withdrawal) is buried in the middle of a sentence.
- **Why the tools miss it:** The tools do not read the text. That takes a human, or a readability measure such as LIX.
- **Demo:** Ask someone in the audience to read the first paragraph aloud and then explain what it means. Then show a plain-language version:
  > *Du kan ångra ditt köp inom 14 dagar. Det gäller inte kaffe som du har öppnat.*
  > (You can cancel your purchase within 14 days. This does not apply to coffee you have opened.)
- **Fix:** Put the most important information first. Use short sentences (15–20 words at most), spell out abbreviations and break the text into bullet lists. See the Swedish Language Council's plain language guidance and ISO 24495-1.

### 19. Sticky banner covers almost the whole screen in landscape
**File:** [InfoBanner.jsx](src/components/InfoBanner.jsx), `.info-banner` in [styles.css](src/styles.css)
**WCAG:** 1.4.10 Reflow (AA), 2.4.11 Focus Not Obscured (Minimum) (AA, WCAG 2.2), 1.3.4 Orientation (AA)

- **The code looks fine:** The banner is an `<aside>` with an `aria-label` and has a real `<button>` to close it. The landmark is called *"Banner information"*, though, which says nothing about the content, and the link is only called *"Läs mer"* (see issue 23).
- **What actually happens:**
  - The banner has `position: sticky` and lots of text. On a phone in landscape it covers almost the whole screen: about 94 % of the height on an iPhone 13 and 82 % on a Pixel 7. The rest of the page scrolls past in a gap a few pixels high.
  - Someone who cannot rotate their phone (because it is mounted on a wheelchair, for example) effectively cannot use the site.
  - On desktop the banner covers the top 220 or so pixels. When you tab through the page, focused links and buttons end up *underneath* the banner and cannot be seen (2.4.11).
  - When zoomed, the banner grows with the text and takes up an ever larger part of the screen.
- **Why the tools miss it:** axe and Lighthouse do not check how much of the screen a fixed element takes up, or whether focus ends up behind it. axe only reports *needs review* for contrast, because text sits on top of other text.
- **Demo:** Open DevTools, choose device mode and a phone, and rotate to landscape. Scroll. Then tab through the product cards in a normal desktop view and show focus disappearing under the banner.
- **Fix:** Let the banner scroll with the page, and make it short and easy to close. If something has to be fixed, keep it small and turn off `sticky` on short viewports (`@media (max-height: 500px)`). Use `scroll-padding-top` so focused elements do not end up behind it.

### 20. Lots of space between interactive elements
**File:** [styles.css](src/styles.css) (`main`, `.site-header`, `.menu`, `.search-bar`, `.search-filters`, `.grid`)
**WCAG:** No single success criterion. The problem relates to 1.4.10 Reflow and 2.4.7 Focus Visible, and it is a well-known problem for people using screen magnifiers.

- **What actually happens:** The page is up to 1,680 px wide.
  - The cart is far to the right, a long way from the menu.
  - The search button is about 1,500 px from the start of the search field.
  - The filter columns are spread across the full width.
  - The *"Bra att veta inför ditt köp"* section, with the right of withdrawal, shipping and the delivery table, sits in a narrow column far to the right below the products. The left half is empty. Someone reading down the left edge with magnification scrolls straight past it and thinks the page has ended.
  - In each product card the price is far to the left and the button far to the right.
  - With 4–8× magnification the user only sees a small part of the screen. After typing in the search field they have to hunt for the search button, and after reading the price they do not know there is a button far to the right. The gaps look like the end of the content.
- **Why the tools miss it:** Spacing is not a rule. The page looks airy and modern to someone who can see the whole screen.
- **Demo:** Start Windows Magnifier (`Win` and `+`), zoom to 400 % and try to search or add a product to the cart. Then show the search field without magnification.
- **Fix:** Place buttons next to the things they belong to. Limit line length and component width, for example with `max-width` on forms and cards. Group related controls visually.

### 21. Infinite scroll: the footer cannot be reached
**File:** [Search.jsx](src/components/Search.jsx) (`IntersectionObserver`)
**WCAG:** 2.1.1 Keyboard (A), 2.4.3 Focus Order (A), 4.1.3 Status Messages (AA)

- **The code looks fine:** It is a common, modern technique. The results are real links, and the text *"Laddar fler resultat …"* (Loading more results …) is shown while the next page loads.
- **What actually happens:**
  - When the list nears its end, 24 new results load, then 24 more, up to 1,312. When you tab through the results, new ones load before you reach the footer. In our tests, 144 results had loaded after 150 presses of Tab, and focus was still in the list.
  - The footer contains *Kundtjänst* (Customer service), *Köpvillkor* (Terms of purchase) and *Tillgänglighetsredogörelse* (Accessibility statement). In practice they cannot be reached with a keyboard, and with a mouse only if you click before the list grows.
  - The screen reader is not told that new results have loaded. *"Laddar fler resultat …"* is not a live region, and the result counter (*"Visar 1–48 av 1 312"*) updates silently.
  - Anyone who loses their place, for example by reloading the page, has to start over from the beginning.
- **Why the tools miss it:** The tools test a single moment. They do not scroll and never see the content grow.
- **Demo:** Search, then press `End` several times. The footer shows briefly and then disappears. Also try tabbing to *Tillgänglighetsredogörelse*.
- **Fix:** Use a *"Show more results"* button or ordinary pagination. If infinite scroll is a requirement, the most important footer links must also be available somewhere else. Use a live region for *"24 new results loaded"*, and do not move focus.

### 22. Everything in pixels: your text size setting is ignored
**File:** [index.html](index.html) (`<html style="font-size: 16px">`), [styles.css](src/styles.css)
**WCAG:** 1.4.4 Resize Text (AA) technically **passes**, because browser zoom (`Ctrl` and `+`) still works. This is another example of nuance: the requirement is met, but the user's own setting is ignored.

- **The code looks fine:** The design looks the same everywhere, and `px` is easy to understand and match against design mock-ups.
- **What actually happens:**
  - The root is locked to `16px`, both in the `<html>` tag and in CSS. All font sizes, margins and spacing are in `px` instead of `rem`/`em`.
  - Many people with low vision increase the browser's default text size instead of zooming, because zoom also enlarges images and layout and often causes horizontal scrolling. On this site nothing happens when they do.
  - The user believes the setting works, because other websites get bigger. Here the text stays just as small, for example the filter labels (14 px).
- **Why the tools miss it:** `px` is valid CSS, and the tools test with the browser's default settings.
- **Demo:** Open another site, for example a government website, in a tab next to it. In Chrome, go to *Settings → Appearance → Font size → Very large*. The other site grows, but Brew & Bean looks the same. In Firefox you can also choose *View → Zoom → Zoom Text Only*.
- **Fix:** Never set `font-size` on `<html>` in `px`. Use `rem` for font sizes, and preferably for spacing too, so the layout grows with the text.

### 23. Links that say nothing
**File:** [ProductCard.jsx](src/components/ProductCard.jsx), [PurchaseInfo.jsx](src/components/PurchaseInfo.jsx), [InfoBanner.jsx](src/components/InfoBanner.jsx), the hero text in [App.jsx](src/App.jsx). Inspired by Imperial College London's [bad example page](https://www.imperial.ac.uk/staff/tools-and-reference/web-guide/training-and-events/materials/accessibility/bad-example/).
**WCAG:** 2.4.4 Link Purpose (In Context) (A), 2.4.9 Link Purpose (Link Only) (AAA), 3.2.5 Change on Request (AAA)

- **The code looks fine:** Every link has text. The image links have alt text, so axe and Lighthouse find no empty links.
- **What actually happens:** Open the links list in NVDA (`Insert+F7`):
  - *"Läs mer"* (Read more) appears nine times: once in the banner, once in the hero text, six times in the product cards and once in *"Bra att veta"*. None of them says what you will read more about.
  - Every product image is a link. The link's name becomes the image's alt text, so *"DSC_0042.jpg"* to *"DSC_0090.jpg"*.
  - *"Klicka här"* (Click here) appears three times.
  - A long URL is used as link text. The screen reader reads it character by character: *"h t t p s colon slash slash w w w dot …"*.
  - *"Köpvillkor [pdf]"* (Terms of purchase [pdf]) does not say how large the file is.
  - The *"Läs mer"* link in *"Bra att veta"* opens a PDF in a **new window** without warning. The back button does not work, and someone who cannot see the screen does not know what happened.
  - Several links go to `#`, which is nowhere.
- **Why the tools miss it:** The links have an accessible name, and that is enough for axe. Identical link texts with different targets are not a failure in axe.
- **Demo:** `Insert+F7`, choose *Links*. Let the audience guess where "Läs mer" number five leads.
- **Fix:** Write link texts that say where the link goes, for example *"Läs mer om Kenya AA"* (Read more about Kenya AA), or link the whole product name. Use `alt=""` on images in links that already have text. State the file type and size, for example *"Köpvillkor (PDF, 240 kB)"*. Do not open new windows, or say so in the link text.

### 24. A table that is not a table
**File:** [PurchaseInfo.jsx](src/components/PurchaseInfo.jsx) (`.fake-table`)
**WCAG:** 1.3.1 Info and Relationships (A)

- **The code looks fine:** The comment says *"Laid out as a grid so it lines up nicely on all screen sizes"*, and the table looks like a table.
- **What actually happens:** The table of delivery options is 20 `<div>` elements. NVDA reads *"Leveranssätt Leveranstid Pris Spårbar Ombud 1–3 arbetsdagar 49 kr Ja Hemleverans …"* (Delivery method, Delivery time, Price, Tracked, Pickup point …) as one long string. You cannot navigate with table commands (`Ctrl+Alt+arrow keys`), and when you get to *"Nej"* (No) you do not know which column it belongs to.
- **Why the tools miss it:** The tools cannot know that the div elements are meant to be a table.
- **Demo:** Press `T` in NVDA (next table). NVDA says *"no next table"*. Then read the section with `Insert+↓`.
- **Fix:** Use `<table>`, `<th scope="col">` and preferably a `<caption>`.

### 25. White text on a light hero image
**File:** `.hero` in [styles.css](src/styles.css), the image [hero.jpg](public/img/hero.jpg)
**WCAG:** 1.4.3 Contrast (Minimum) (AA)

- **The code looks fine:** The heading sits on the calm, empty part of the image, and there is even a dark fallback colour (`#8a8079`) behind the image.
- **What actually happens:** The heading and intro are white on an off-white wall. The intro is also faded with `filter: opacity(0.85)`. The contrast is about 1.2–1.5:1. People with low vision or cataracts, or anyone sitting in sunlight, cannot read the text. On mobile the text also ends up on top of the paper cup.
- **Why the tools miss it:** axe cannot calculate contrast against a background image. The elements end up as *needs review* (*"background color could not be determined due to a background image"*), not as violations, and Lighthouse still scores 100. Lighthouse does not even list these elements in its summary.
- **Demo:** Run axe DevTools and show that the issue only appears under *Needs review*. Anyone who only looks at the number of violations misses it. Then measure with a colour picker, for example TPGi's *Colour Contrast Analyser*.
- **Fix:** Put the text on a solid or semi-transparent dark panel, or use a dark overlay on the image. Check the contrast against the lightest part of the image behind the text, at every screen size.

### 26. Sold-out product faded with `filter: opacity()`
**File:** `.card--sold-out` in [styles.css](src/styles.css)
**WCAG:** 1.4.3 Contrast (Minimum) (AA)

- **The code looks fine:** It is a common design pattern to fade out products that cannot be bought.
- **What actually happens:** The name, description, price and *"Läs mer"* on Kenya AA are shown at 40 % opacity. The grey text on a white background has a contrast of about 2–2.5:1. The information is still there and it matters (which product, which price), but it is hard to read.
- **Why the tools miss it:** axe takes the CSS `opacity` property into account, but not `filter: opacity()`, which looks exactly the same. We tested seven variants:

  | Technique | axe |
  |---|---|
  | `opacity: 0.35` | ❌ violation found |
  | `color: rgb(… / 0.35)` | ❌ violation found |
  | Pseudo-element with a semi-transparent overlay | ⚠️ needs review |
  | Background image | ⚠️ needs review |
  | `filter: opacity(0.35)` | ✅ **passes** |
  | `mix-blend-mode` | ✅ **passes** |
  | `mask-image` | ✅ **passes** |

- **Demo:** Run axe and show that the Kenya card's text is listed under *Passes*. Then inspect the element and show `filter: opacity(0.4)`.
- **Fix:** Use a dedicated colour with sufficient contrast for sold-out products, and state that the product is sold out in text (see issue 12). Do not trust the tools' contrast checks when you use filters, blend modes or masks.

### 27. Infographic named only "Illustration"
**File:** [InfoIllustration.jsx](src/components/InfoIllustration.jsx)
**WCAG:** 1.1.1 Non-text Content (A), 1.4.3 Contrast (Minimum) (AA)

- **The code looks fine:** An inline SVG with `role="img"` and an `aria-label`, exactly as many guides recommend.
- **What actually happens:**
  - The image contains information that is not stated in the same form anywhere else: *14 dagars ångerrätt* (14-day right of withdrawal), *fri frakt över 400 kr* (free shipping over 400 kr) and *rostat varje måndag* (roasted every Monday). The most important exception, *"gäller inte öppnade förpackningar"* (does not apply to opened packages), is in a footnote.
  - NVDA only says *"Illustration, graphic"*. With `role="img"`, all text inside the SVG is hidden from the screen reader.
  - The footnotes are light grey (`#c9bfb4`) on a beige background, with a contrast of about 1.6:1.
- **Why the tools miss it:** `role="img"` has a name, so the `svg-img-alt` rule is satisfied. axe cannot determine the contrast of text in SVG and puts it under *needs review*.
- **Demo:** Read the image with NVDA. Then point to the footnote and ask how many people in the audience noticed it.
- **Fix:** Give the image a name that describes its content, or write the information as real text and mark the image as decorative (`aria-hidden="true"`). Hold footnotes to the same contrast requirements as other text.

### 28. Stock status shown by colour alone
**File:** [ProductCard.jsx](src/components/ProductCard.jsx) (`.stock-dot`), the legend below *"Vårt kaffe"* in [App.jsx](src/App.jsx)
**WCAG:** 1.4.1 Use of Color (A), 1.3.1 Info and Relationships (A)

- **The code looks fine:** There is a legend with text: *"● I lager ● Få kvar ● Slut"* (In stock, Few left, Sold out).
- **What actually happens:**
  - Each card only has a coloured dot: green, orange or red. With red-green colour blindness, which affects about 8 % of men, green and orange are almost impossible to tell apart. Red blends in with them too.
  - The legend is at the top, far away from the cards. With magnification, the legend and the dot are never visible at the same time.
  - The dot is an empty `<span>`, so the screen reader says nothing. The stock status only exists in a tooltip (see issue 29).
- **Why the tools miss it:** An empty element without text is not a failure. The tools do not know that the colour means something.
- **Demo:** Open DevTools and choose *Rendering → Emulate vision deficiencies → Deuteranopia*. Ask the audience which coffees are in stock.
- **Fix:** Write the status in text, for example *"Få kvar"* (Few left). Add an icon with a different shape for each status if you like.

### 29. Tooltips that only appear on mouse hover
**File:** [ProductCard.jsx](src/components/ProductCard.jsx) (`.has-tooltip`), [styles.css](src/styles.css) (`.has-tooltip:hover .tooltip`)
**WCAG:** 1.4.13 Content on Hover or Focus (AA), 2.1.1 Keyboard (A), 1.3.1 Info and Relationships (A)

- **The code looks fine:** The comment says *"Extra details on hover keep the card clean"*.
- **What actually happens:** The tooltips contain a lot of text, about 50 words each. The info icon next to the price shows the unit price, package size, best-before date and that the price only applies online. The stock dot explains delivery times, that items are not reserved and when the product will be back.
  - The tooltip is only shown on `:hover`. The icons cannot be focused, so keyboard users never reach the information.
  - The tooltip is `display: none` until the mouse is there, so the screen reader does not announce it.
  - Phones and tablets have no hover.
  - **With magnification it cannot be read.** The tooltip is 360 px wide and grows up and to the right from the icon. With Windows Magnifier at 300–400 % you only see the first few words. When you move the pointer to read the rest, the magnified view follows and the tooltip disappears immediately. It has `pointer-events: none` and sits 8 px from the icon, so it closes as soon as the pointer leaves the icon.
- **Why the tools miss it:** Hidden content is not tested, and `:hover` is ordinary CSS.
- **Demo:** Tab through a product card. Then show with the mouse what is hidden behind the icons. Start Windows Magnifier (`Win` and `+`, preferably at 300 %), hover over the info icon and try to read the whole text.
- **Fix:** Show important information directly as text. If a tooltip is needed, it must be reachable by keyboard, appear on focus, be dismissable with Esc, and let the pointer move onto it without disappearing.

### 30. Breaks in Windows High Contrast (forced colours)
**File:** [styles.css](src/styles.css)
**WCAG:** 1.4.1 Use of Color (A), 1.4.11 Non-text Contrast (AA), 2.4.7 Focus Visible (AA), 1.4.3 Contrast (Minimum) (AA)

When Windows High Contrast (Contrast themes) is on, the browser replaces the page's colours with the user's system colours (`forced-colors: active`). Background colours, shadows and transparency disappear. Anything built only with them stops working:

| What | Why | Result in high contrast |
|---|---|---|
| The stock dots (issue 28) | `background` only | **Disappear completely**, in the legend too |
| The focus indicator | `outline: none` + `box-shadow` | **No visible focus at all.** Shadows are removed. |
| Buttons (*"Lägg i varukorgen"*, *"Visa resultat"*, the search buttons) | `border: 0` and a background colour only | Look like plain text. You cannot tell they are buttons. |
| The checkboxes in *"Avancerad sökning"* (Advanced search) | `appearance: none`, the checked state is only a background colour | **Checked and unchecked look the same** |
| The hero image | `forced-color-adjust: none` | The browser is not allowed to draw a backplate behind the text, so the white text on a light image stays for exactly the users who need high contrast. |

- **Why the tools miss it:** The tools test with normal colours. High contrast mode is an operating system setting.
- **Demo:** Turn on Windows High Contrast with `Left Alt + Left Shift + Print Screen`, or via *Settings → Accessibility → Contrast themes*. Without changing the system setting, you can choose *Rendering → Emulate CSS media feature forced-colors: active* in Chrome DevTools. Show the product cards (the dots are gone), tab (no focus) and tick *"Endast i lager"* (In stock only) on the search page.
- **Fix:**
  - Use `outline` for focus. `outline: 2px solid transparent` still shows up in high contrast mode.
  - Give buttons a border, for example `border: 2px solid transparent`.
  - Use real text, or SVG with `currentColor`, for status icons.
  - Only use `forced-color-adjust: none` when you know exactly why.
  - Test with `@media (forced-colors: active)`.

### Bonus: "Klicka här" in the footer
**WCAG:** 2.4.9 Link Purpose (Link Only) (AAA). 2.4.4 (A) **passes**, because the surrounding sentence provides enough context.

This is a good example of nuance: technically level A is met, but NVDA's links list (`Insert+F7`) shows *"klicka här"* (click here) twice with no context.

---

## Summary for the final slide

⚠️ in the *Automated tools* column means axe only flags the element as *needs review*. The number of violations is still 0 and Lighthouse scores 100.

| | Automated tools | Keyboard | Screen reader |
|---|:-:|:-:|:-:|
| Focus on page load (1) | ✅ | ❌ | ❌ |
| Menu (2) | ✅ | ❌ | ❌ |
| Dialog (3) | ✅ | ❌ | ❌ |
| Form errors (4) | ✅ | – | ❌ |
| Toast/status (5, 6) | ✅ | – | ❌ |
| Reading order, headings, button names (7–9) | ✅ | ⚠️ | ❌ |
| Alt text, price, sold out (10–12) | ✅ | – | ❌ |
| Wishlist (13) | ✅ | ❌ | ❌ |
| Focus indicator (14) | ✅ | ❌ | – |
| Page language (15) | ✅ | – | ❌ |
| Search results (16) | ✅ | ⚠️ | ❌ |
| Form when zoomed (17) | ✅ | ⚠️ | – |
| Plain language (18) | ✅ | ❌ | ❌ |
| Sticky banner (19) | ✅ | ❌ | – |
| Spacing with magnification (20) | ✅ | – | – |
| Infinite scroll (21) | ✅ | ❌ | ❌ |
| Text size in px (22) | ✅ | – | – |
| Link texts (23) | ✅ | ⚠️ | ❌ |
| Fake table (24) | ✅ | – | ❌ |
| Text on hero image (25) | ⚠️ | – | – |
| `filter: opacity()` (26) | ✅ | – | – |
| Infographic (27) | ⚠️ | – | ❌ |
| Stock status by colour (28) | ✅ | – | ❌ |
| Hover-only tooltips (29) | ✅ | ❌ | ❌ |
| Windows High Contrast (30) | ✅ | ❌ | – |

**Takeaways:**
1. **ARIA is a promise, not a feature.** `aria-expanded`, `role="button"` and `aria-modal` *describe* behaviour. You still have to *build* the behaviour.
2. **Use native elements** (`<button>`, `<dialog>`, `<h3>`) and half the problems go away.
3. **Automated tools are a baseline, not a certificate.** Run them in CI, but also test with a keyboard, a screen reader and, ideally, real users.
