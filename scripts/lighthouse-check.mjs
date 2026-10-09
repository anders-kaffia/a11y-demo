// Runs the Lighthouse accessibility audit (same as Chrome DevTools > Lighthouse > Accessibility).
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';

const URL = process.env.SITE_URL ?? 'http://localhost:4173/';

export async function runLighthouse() {
  const chrome = await chromeLauncher.launch({
    chromePath: process.env.CHROME_PATH ?? chromium.executablePath(),
    chromeFlags: ['--headless=new'],
  });

  try {
    const { lhr } = await lighthouse(URL, {
      port: chrome.port,
      onlyCategories: ['accessibility'],
      output: 'json',
      logLevel: 'error',
    });

    const score = Math.round(lhr.categories.accessibility.score * 100);
    console.log(`\n=== Lighthouse ${lhr.lighthouseVersion} ${URL} ===`);
    console.log(`Accessibility score: ${score}`);

    const failed = lhr.categories.accessibility.auditRefs
      .map((ref) => lhr.audits[ref.id])
      .filter((a) => a.score !== null && a.score < 1);
    for (const audit of failed) console.log(`  - [${audit.id}] ${audit.title}`);

    return score;
  } finally {
    await chrome.kill();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const score = await runLighthouse();
  process.exit(score === 100 ? 0 : 1);
}
