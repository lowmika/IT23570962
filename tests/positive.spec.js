const { test, expect } = require('@playwright/test');

async function runTest(page, testInfo, input, expected) {
  await page.goto('https://tamil.changathi.com');
  await page.waitForLoadState('networkidle');

  const inputBox = page.locator('textarea, input[type="text"]').first();
  await inputBox.waitFor({ state: 'visible', timeout: 10000 });
  await inputBox.clear();
  await inputBox.type(input, { delay: 75 });
  await inputBox.press('Space');

  let output = '';
  let found = false;
  const maxRetries = 8;
  const retryDelay = 800;

  for (let attempt = 0; attempt < maxRetries && !found; attempt++) {
    await page.waitForTimeout(retryDelay);
    output = await inputBox.inputValue();
    if (output.includes(expected)) {
      found = true;
    }
  }

  await testInfo.attach('input', { body: input, contentType: 'text/plain' });
  await testInfo.attach('expected', { body: expected, contentType: 'text/plain' });
  await testInfo.attach('output', { body: output, contentType: 'text/plain' });

  expect(output, `Expected output to contain "${expected}" but got "${output}"`).toContain(expected);
}

test.describe('Positive Tamil Transliteration Tests', () => {

  test('Pos_Fun_0001 - vanakkam transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'vanakkam', 'வணக்கம்');
  });

  test('Pos_Fun_0002 - naan transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'naan', 'நான்');
  });

  test('Pos_Fun_0003 - nee transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'nee', 'நீ');
  });

  test('Pos_Fun_0004 - eppadi transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'eppadi', 'எப்படி');
  });

  test('Pos_Fun_0005 - enakku transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'enakku', 'எனக்கு');
  });

  test('Pos_Fun_0006 - irukken transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'irukken', 'இருக்கேன்');
  });

  test('Pos_Fun_0007 - poganum transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'poganum', 'போகணும்');
  });

  test('Pos_Fun_0008 - varen transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'varen', 'வரேன்');
  });

  test('Pos_Fun_0009 - poren transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'poren', 'போறேன்');
  });

  test('Pos_Fun_0010 - sapten transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'sapten', 'சாப்பிட்டேன்');
  });

  test('Pos_Fun_0011 - sapadu transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'sapadu', 'சாப்பாடு');
  });

  test('Pos_Fun_0012 - romba transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'romba', 'ரொம்ப');
  });

  test('Pos_Fun_0013 - nalla transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'nalla', 'நல்ல');
  });

  test('Pos_Fun_0014 - enna transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'enna', 'என்ன');
  });

  test('Pos_Fun_0015 - yaar transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'yaar', 'யார்');
  });

  test('Pos_Fun_0016 - enge transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'enge', 'எங்கே');
  });

  test('Pos_Fun_0017 - eppo transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'eppo', 'எப்போ');
  });

  test('Pos_Fun_0018 - paadam transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'paadam', 'பாடம்');
  });

  test('Pos_Fun_0019 - velai transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'velai', 'வேலை');
  });

  test('Pos_Fun_0020 - veedu transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'veedu', 'வீடு');
  });

  test('Pos_Fun_0021 - thanni transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'thanni', 'தண்ணி');
  });

  test('Pos_Fun_0022 - kaalam transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'kaalam', 'காலம்');
  });

  test('Pos_Fun_0023 - nandri transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'nandri', 'நன்றி');
  });

  test('Pos_Fun_0024 - anbu transliteration', async ({ page }, testInfo) => {
    await runTest(page, testInfo, 'anbu', 'அன்பு');
  });

});
