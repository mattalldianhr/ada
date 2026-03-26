import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const VIEWPORT = { width: 375, height: 667 };
const OUT = 'mobile-screenshots';

mkdirSync(OUT, { recursive: true });

const sections = [
  { name: '01-hero', selector: '.hero' },
  { name: '02-demo-hero', selector: '.demo-hero' },
  { name: '03-features', selector: '#features' },
  { name: '04-feature-demo-conversations', selector: '.feature-demo-window' },
  { name: '05-privacy', selector: '.privacy-demo-content' },
  { name: '06-agents', selector: '#agents' },
  { name: '07-agent-demo', selector: '.agent-demo-window' },
  { name: '08-deslop', selector: '#deslop' },
  { name: '09-updates', selector: '#updates' },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Full page screenshot first
  await page.screenshot({ path: `${OUT}/00-full-page.png`, fullPage: true });
  console.log('Saved full page screenshot');

  for (const { name, selector } of sections) {
    try {
      const el = page.locator(selector).first();
      await el.waitFor({ timeout: 3000 });

      // Scroll into view
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Get bounding box to check overflow
      const box = await el.boundingBox();
      if (box) {
        const overflow = box.width > VIEWPORT.width;
        console.log(`${name}: ${Math.round(box.width)}x${Math.round(box.height)}${overflow ? ' ⚠ OVERFLOWS' : ''}`);
      }

      await el.screenshot({ path: `${OUT}/${name}.png` });
      console.log(`  → ${OUT}/${name}.png`);
    } catch (e) {
      console.log(`${name}: SKIP (${e.message.slice(0, 60)})`);
    }
  }

  // Also check all elements that overflow viewport
  console.log('\n--- Overflow audit ---');
  const overflows = await page.evaluate((vw) => {
    const results = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > vw + 1 && rect.height > 0) {
        const cls = el.className?.toString?.()?.slice(0, 60) || '';
        const id = el.id || '';
        const tag = el.tagName.toLowerCase();
        results.push({
          selector: id ? `#${id}` : cls ? `.${cls.split(' ')[0]}` : tag,
          width: Math.round(rect.width),
          overflow: Math.round(rect.width - vw)
        });
      }
    });
    return results;
  }, VIEWPORT.width);

  for (const o of overflows) {
    console.log(`  ${o.selector}: ${o.width}px (${o.overflow}px overflow)`);
  }

  await browser.close();
})();
