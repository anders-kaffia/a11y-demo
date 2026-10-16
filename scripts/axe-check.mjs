// Runs axe-core (all default rules incl. best practices) against the site in several UI states.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { pathToFileURL } from 'node:url';

const URL = process.env.SITE_URL ?? 'http://localhost:4173/';

// Adding a product scrolls the page, which opens the newsletter dialog – close it first
async function openCheckoutWithItem(page) {
  await page.click('.card-add >> nth=2');
  await page.waitForTimeout(300);
  if (await page.isVisible('.dialog-close')) await page.click('.dialog-close');
  await page.click('.cart');
}

const states = [
  {
    name: 'Initial page load',
    setup: async () => {},
  },
  {
    name: 'Shop menu open (mouse hover)',
    setup: async (page) => page.hover('.has-submenu > button'),
  },
  {
    name: 'Shop menu "expanded" via click (keyboard path)',
    setup: async (page) => page.click('.has-submenu > button'),
  },
  {
    name: 'Search page, no query',
    path: 'sok',
    setup: async () => {},
  },
  {
    name: 'Search page via header quick search',
    setup: async (page) => {
      await page.fill('.header-search input', 'kaffe');
      await page.press('.header-search input', 'Enter');
      await page.waitForSelector('.result');
    },
  },
  {
    name: 'Search results after infinite scroll',
    path: 'sok?q=kaffe',
    setup: async (page) => {
      await page.waitForSelector('.result');
      await page.keyboard.press('End');
      await page.waitForFunction(() => document.querySelectorAll('.result').length > 24);
    },
  },
  {
    name: 'Mobile layout (compact menu)',
    viewport: { width: 390, height: 844 },
    setup: async () => {},
  },
  {
    name: 'Checkout, empty cart',
    setup: async (page) => page.click('.cart'),
  },
  {
    name: 'Checkout step 1 (order and delivery)',
    setup: async (page) => {
      await openCheckoutWithItem(page);
      await page.waitForSelector('.checkout-form');
    },
  },
  {
    name: 'Checkout step 2 (payment approved)',
    setup: async (page) => {
      await openCheckoutWithItem(page);
      await page.click('.checkout-form button[type=submit]');
      await page.click('.checkout .secondary');
    },
  },
  {
    name: 'Checkout step 3 (review and send)',
    setup: async (page) => {
      await openCheckoutWithItem(page);
      await page.click('.checkout-form button[type=submit]');
      await page.click('.checkout .secondary');
      await page.click('.checkout .primary');
      await page.check('#co-terms');
    },
  },
  {
    name: 'Toast visible after "Add to cart"',
    setup: async (page) => {
      await page.click('.card-add >> nth=0');
      await page.waitForSelector('[role=status]');
    },
  },
  {
    name: 'Wishlist toggled',
    setup: async (page) => page.click('.card-wish >> nth=1'),
  },
  {
    name: 'Newsletter dialog open',
    setup: async (page) => {
      await page.mouse.wheel(0, 1200);
      await page.waitForSelector('[role=dialog]', { timeout: 10000 });
    },
  },
  {
    name: 'Newsletter dialog with invalid email',
    setup: async (page) => {
      await page.mouse.wheel(0, 1200);
      await page.waitForSelector('[role=dialog]', { timeout: 10000 });
      await page.fill('#newsletter-email', 'not-an-email');
      await page.click('.dialog button[type=submit]');
    },
  },
  // ---------- The accessible version ----------
  {
    name: 'Accessible: start page',
    path: 'tillganglig/',
    setup: async () => {},
  },
  {
    name: 'Accessible: shop menu open',
    path: 'tillganglig/',
    setup: async (page) => page.click('.has-submenu > button'),
  },
  {
    name: 'Accessible: newsletter error, then status message',
    path: 'tillganglig/',
    setup: async (page) => {
      await page.click('.newsletter button[type=submit]');
      await page.click('.card .primary >> nth=0');
    },
  },
  {
    name: 'Accessible: search results',
    path: 'tillganglig/sok/?q=kaffe',
    setup: async (page) => page.waitForSelector('.result-list'),
  },
  {
    name: 'Accessible: checkout with errors',
    path: 'tillganglig/',
    setup: async (page) => {
      await page.click('.card .primary >> nth=0');
      await page.click('.cart');
      await page.click('.checkout-form button[type=submit]');
    },
  },
  {
    name: 'Accessible: checkout review step',
    path: 'tillganglig/',
    setup: async (page) => {
      await page.click('.card .primary >> nth=0');
      await page.click('.cart');
      for (const [id, value] of [['name', 'Ingrid'], ['address', 'Gatan 1'], ['zip', '11122'], ['city', 'Stockholm'], ['email', 'a@b.se']]) {
        await page.fill(`#co-${id}`, value);
      }
      await page.click('.checkout-form button[type=submit]');
      await page.click('.checkout .button-row .primary');
    },
  },
  {
    name: 'Accessible: receipt',
    path: 'tillganglig/',
    setup: async (page) => {
      await page.click('.card .primary >> nth=0');
      await page.click('.cart');
      for (const [id, value] of [['name', 'Ingrid'], ['address', 'Gatan 1'], ['zip', '11122'], ['city', 'Stockholm'], ['email', 'a@b.se']]) {
        await page.fill(`#co-${id}`, value);
      }
      await page.click('.checkout-form button[type=submit]');
      await page.click('.checkout .button-row .primary');
      await page.click('.checkout .button-row .primary');
      await page.waitForSelector('text=Ordernummer');
    },
  },
  {
    name: 'Accessible: dark mode (system setting)',
    path: 'tillganglig/',
    colorScheme: 'dark',
    setup: async (page) => {
      await page.click('.card .primary >> nth=0');
      await page.click('.newsletter button[type=submit]');
    },
  },
  {
    name: 'Accessible: dark mode checkout with errors',
    path: 'tillganglig/',
    colorScheme: 'dark',
    setup: async (page) => {
      await page.click('.card .primary >> nth=0');
      await page.click('.cart');
      await page.click('.checkout-form button[type=submit]');
    },
  },
  {
    name: 'Accessible: dark mode chosen with the button',
    path: 'tillganglig/sok/?q=kaffe',
    setup: async (page) => {
      await page.click('.theme-toggle');
      await page.waitForSelector('html[data-theme=dark]');
    },
  },
  {
    name: 'Accessible: mobile layout',
    path: 'tillganglig/',
    viewport: { width: 320, height: 640 },
    setup: async () => {},
  },
  // ---------- The issue list page ----------
  {
    name: 'Issue list: all issues',
    path: 'fel/',
    setup: async () => {},
  },
  {
    name: 'Issue list: issues shown',
    path: 'fel/',
    setup: async (page) => page.click('[aria-controls=issue-list]'),
  },
  {
    name: 'Issue list: dark mode',
    path: 'fel/',
    colorScheme: 'dark',
    setup: async () => {},
  },
];

export async function runAxe() {
  const browser = await chromium.launch();
  let totalViolations = 0;

  console.log(`\n=== axe-core ${URL} ===`);
  for (const state of states) {
    const context = await browser.newContext({
      ...(state.viewport && { viewport: state.viewport }),
      ...(state.colorScheme && { colorScheme: state.colorScheme }),
    });
    const page = await context.newPage();
    await page.goto(URL + (state.path ?? ''), { waitUntil: 'networkidle' });
    await state.setup(page);
    await page.waitForTimeout(300);

    const builder = new AxeBuilder({ page });
    // The accessible version and the issue list must also meet AAA text contrast (7:1)
    if (/^(Accessible|Issue list)/.test(state.name)) {
      builder.options({ rules: { 'color-contrast-enhanced': { enabled: true } } });
    }
    const results = await builder.analyze();
    totalViolations += results.violations.length;

    const status = results.violations.length === 0 ? 'PASS' : 'FAIL';
    console.log(
      `${status}  ${state.name.padEnd(48)} violations: ${results.violations.length}  ` +
        `passes: ${results.passes.length}  needs review: ${results.incomplete.length}`
    );
    for (const v of results.violations) {
      console.log(`      - [${v.id}] ${v.help} (${v.nodes.length} nodes)`);
      for (const n of v.nodes) console.log(`          ${n.target.join(' ')}`);
    }
    for (const v of results.incomplete) {
      console.log(`      ? [${v.id}] ${v.help}`);
    }
    await context.close();
  }

  await browser.close();
  console.log(`\naxe total violations: ${totalViolations}`);
  return totalViolations;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const violations = await runAxe();
  process.exit(violations === 0 ? 0 : 1);
}
