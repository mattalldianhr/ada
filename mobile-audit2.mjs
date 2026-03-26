import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const VIEWPORT = { width: 375, height: 667 };
const OUT = 'mobile-screenshots';

mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Screenshot each feature demo window (there are multiple)
  const featureDemos = page.locator('.feature-demo-window');
  const count = await featureDemos.count();
  console.log(`Found ${count} feature demo windows`);

  for (let i = 0; i < count; i++) {
    const el = featureDemos.nth(i);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const box = await el.boundingBox();
    console.log(`  demo ${i}: ${Math.round(box.width)}x${Math.round(box.height)}`);
    await el.screenshot({ path: `${OUT}/feature-demo-${i}.png` });
  }

  // Screenshot conversation cards specifically
  const convCards = page.locator('.demo-card-conversation');
  const convCount = await convCards.count();
  console.log(`Found ${convCount} conversation cards`);

  // Screenshot the demo-margin areas in feature demos
  const margins = page.locator('.feature-demo-content .demo-margin');
  const marginCount = await margins.count();
  console.log(`Found ${marginCount} feature demo margins`);
  for (let i = 0; i < marginCount; i++) {
    const el = margins.nth(i);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const box = await el.boundingBox();
    if (box) {
      console.log(`  margin ${i}: ${Math.round(box.width)}x${Math.round(box.height)}`);
      await el.screenshot({ path: `${OUT}/feature-margin-${i}.png` });
    }
  }

  // Screenshot agent cards
  const agentCards = page.locator('.agent-demo-card');
  const agentCount = await agentCards.count();
  console.log(`Found ${agentCount} agent cards`);
  for (let i = 0; i < agentCount; i++) {
    const el = agentCards.nth(i);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const box = await el.boundingBox();
    if (box) {
      const clipped = box.x + box.width > VIEWPORT.width || box.x < 0;
      console.log(`  card ${i}: ${Math.round(box.x)},${Math.round(box.y)} ${Math.round(box.width)}x${Math.round(box.height)}${clipped ? ' ⚠ CLIPPED' : ''}`);
    } else {
      console.log(`  card ${i}: NOT VISIBLE`);
    }
  }

  // Check the privacy arrows
  const arrows = page.locator('.privacy-demo-arrow-label');
  const arrowCount = await arrows.count();
  for (let i = 0; i < arrowCount; i++) {
    const el = arrows.nth(i);
    const text = await el.textContent();
    const box = await el.boundingBox();
    if (box) {
      console.log(`Arrow label "${text?.trim()}": ${Math.round(box.width)}x${Math.round(box.height)} — ${box.height > box.width ? 'VERTICAL' : 'horizontal'}`);
    }
  }

  await browser.close();
})();
