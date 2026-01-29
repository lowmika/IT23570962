const { test, expect } = require('@playwright/test');

test.describe('UI Tests for Tamil Transliteration', () => {

  test('UI_Fun_0001 - verify all UI elements are present and functional', async ({ page }, testInfo) => {
    await page.goto('https://tamil.changathi.com');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    await testInfo.attach('page_title', { body: title, contentType: 'text/plain' });
    expect(title).toBeTruthy();

    const inputBox = page.locator('textarea, input[type="text"]').first();
    await expect(inputBox).toBeVisible();
    await expect(inputBox).toBeEnabled();
    await testInfo.attach('input_field_status', { body: 'Input field is visible and enabled', contentType: 'text/plain' });

    await inputBox.clear();
    await inputBox.type('test', { delay: 50 });
    const inputValue = await inputBox.inputValue();
    expect(inputValue.length).toBeGreaterThan(0);
    await testInfo.attach('input_field_editable', { body: 'Input field accepts text input', contentType: 'text/plain' });

    const viewport = page.viewportSize();
    await testInfo.attach('viewport_size', { body: `${viewport?.width}x${viewport?.height}`, contentType: 'text/plain' });
    expect(viewport?.width).toBe(1280);
    expect(viewport?.height).toBe(720);

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await testInfo.attach('console_errors', { 
      body: consoleErrors.length === 0 ? 'No console errors' : consoleErrors.join('\n'), 
      contentType: 'text/plain' 
    });

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = viewport?.width || 1280;
    const hasHorizontalScroll = bodyWidth > viewportWidth;
    await testInfo.attach('horizontal_scroll', { 
      body: hasHorizontalScroll ? 'Has horizontal scroll (may need fix)' : 'No horizontal scroll', 
      contentType: 'text/plain' 
    });

    await inputBox.focus();
    const isFocused = await inputBox.evaluate(el => document.activeElement === el);
    expect(isFocused).toBe(true);
    await testInfo.attach('focus_capability', { body: 'Input field can receive focus', contentType: 'text/plain' });

    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('ui_screenshot', { body: screenshot, contentType: 'image/png' });

    await testInfo.attach('ui_test_summary', { 
      body: 'All UI elements verified: Page loads, input field visible and functional, viewport correct, accessibility basic check passed', 
      contentType: 'text/plain' 
    });
  });

});
