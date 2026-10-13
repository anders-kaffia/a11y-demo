// Runs axe-core (all default rules incl. best practices) against the site in several UI states.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { pathToFileURL } from 'node:url';

const URL = process.env.SITE_URL ?? 'http://localhost:4173/';

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
    name: 'Search results shown',
    setup: async (page) => {
      await page.fill('input[type=search]', 'kaffe');
      await page.click('.search-bar button');
      await page.waitForSelector('.result');
    },
  },
  {
    name: 'Search results after infinite scroll',
    setup: async (page) => {
      await page.fill('input[type=search]', 'kaffe');
      await page.click('.search-bar button');
      await page.waitForSelector('.result');
      await page.keyboard.press('End');
      await page.waitForFunction(() => document.querySelectorAll('.result').length > 24);
    },
  },
  {
    name: 'Info banner closed',
    setup: async (page) => page.click('.info-banner-close'),
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
    setup: async (page) => page.waitForSelector('[role=dialog]', { timeout: 10000 }),
  },
  {
    name: 'Newsletter dialog with invalid email',
    setup: async (page) => {
      await page.waitForSelector('[role=dialog]', { timeout: 10000 });
      await page.fill('#newsletter-email', 'not-an-email');
      await page.click('.dialog button[type=submit]');
    },
  },
];

export async function runAxe() {
  const browser = await chromium.launch();
  let totalViolations = 0;

  console.log(`\n=== axe-core ${URL} ===`);
  for (const state of states) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await state.setup(page);
    await page.waitForTimeout(300);

    const results = await new AxeBuilder({ page }).analyze();
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
