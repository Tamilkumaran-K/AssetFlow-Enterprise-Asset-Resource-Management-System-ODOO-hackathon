const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER ERROR]:`, err);
  });

  try {
    console.log('Navigating to http://localhost:3000 ...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    // Login
    console.log('Attempting login...');
    await page.fill('input[type="email"]', 'admin@assetflow.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Go to Maintenance page
    console.log('Navigating to Maintenance page...');
    // Click sidebar button for maintenance
    await page.click('button:has-text("Maintenance")');
    await page.waitForTimeout(1000);

    // Move first ticket to Approved (trigger onMoveTicket)
    console.log('Approving ticket...');
    const approveBtn = page.locator('button:has-text("Approve")').first();
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      console.log('Clicked Approve');
    } else {
      console.log('Approve button not visible, searching...');
    }
    await page.waitForTimeout(1000);

    // Go to Notifications (Logs)
    console.log('Navigating to Notifications...');
    await page.click('button:has-text("Notifications")');
    await page.waitForTimeout(2000);

    console.log('Taking screenshot of notifications page...');
    await page.screenshot({ path: 'notifications_screenshot.png' });
    console.log('Screenshot saved to notifications_screenshot.png');
  } catch (e) {
    console.error('Test script crashed:', e);
  } finally {
    await browser.close();
  }
}

run();
